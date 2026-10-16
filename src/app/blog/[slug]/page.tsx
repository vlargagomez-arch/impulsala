import { notFound } from "next/navigation";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts, type BlogPost } from "@/components/site/blog-data";
import { BlogArticle } from "@/components/site/blog-article";
import { SITE_URL } from "@/lib/site-config";
import AiChatFabWrapper from "@/components/site/ai-chat-fab-wrapper";
import { db } from "@/lib/db";

// Hacer la página dinámica para que funcione con artículos del CRM
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  // Generar páginas estáticas para los artículos hardcodeados
  const staticParams = BLOG_POSTS.map((post) => ({ slug: post.slug }));

  // También generar páginas para los artículos del CRM en la base de datos
  try {
    const crmArticles = await db.blogArticle.findMany({
      where: { published: true },
      select: { slug: true },
    });
    const crmParams = crmArticles.map((a) => ({ slug: a.slug }));
    return [...staticParams, ...crmParams];
  } catch {
    // Si la BD no está disponible, solo usar los estáticos
    return staticParams;
  }
}

// Función para buscar artículo en el CRM
async function getPostFromCRM(slug: string): Promise<BlogPost | null> {
  try {
    const article = await db.blogArticle.findUnique({
      where: { slug },
    });

    if (!article || !article.published) return null;

    // Asignar imagen específica del CRM por slug
    let image = article.imageUrl || `/blog/crm/${article.slug}.webp`;

    // Parsear contenido
    let content: any = article.content;
    if (typeof content === "string") {
      // Separar JSON del CTA
      const ctaSplit = content.split(/\n---\n/);
      const jsonPart = ctaSplit[0].trim();
      const ctaPart = ctaSplit.slice(1).join('\n---\n').trim();
      
      // Intentar JSON.parse normal
      let parsed = false;
      if (jsonPart.startsWith("[")) {
        try {
          content = JSON.parse(jsonPart);
          parsed = true;
        } catch {
          // JSON inválido (probablemente por HTML crudo dentro)
          // Extraer bloques con regex
          const blocks: any[] = [];
          const blockPattern = /\{"type":"([^"]+)","([^"]+)":"([^}]*)\}/g;
          let match;
          while ((match = blockPattern.exec(jsonPart)) !== null) {
            const type = match[1];
            const field = match[2];
            const value = match[3];
            blocks.push({ type, [field]: value });
          }
          
          // Si también hay bloques con "items" (listas), extraerlos
          const ulPattern = /\{"type":"ul","items":\[([^\]]*)\]\}/g;
          while ((match = ulPattern.exec(jsonPart)) !== null) {
            const itemsStr = match[1];
            const items = itemsStr.split('","').map(s => s.replace(/^"|"$/g, '').replace(/\\"/g, '"'));
            blocks.push({ type: "ul", items });
          }
          
          content = blocks.length > 0 ? blocks : [{ type: "p", content: content }];
          parsed = true;
        }
      } else if (jsonPart.startsWith("{")) {
        try {
          content = [JSON.parse(jsonPart)];
          parsed = true;
        } catch {
          content = [{ type: "p", content: content }];
          parsed = true;
        }
      }
      
      if (!parsed) {
        // Texto plano
        const paragraphs = content.split(/\n\n+/).filter((p: string) => p.trim());
        const blocks: any[] = [];
        for (const para of paragraphs) {
          const trimmed = para.trim();
          if (trimmed.startsWith("### ")) blocks.push({ type: "h3", content: trimmed.replace(/^###\s+/, "") });
          else if (trimmed.startsWith("## ")) blocks.push({ type: "h2", content: trimmed.replace(/^##\s+/, "") });
          else if (trimmed.startsWith("---")) continue;
          else blocks.push({ type: "p", content: trimmed });
        }
        content = blocks.length > 0 ? blocks : [{ type: "p", content: content }];
      }
      
      // Agregar CTA si existe
      if (ctaPart && Array.isArray(content)) {
        content.push({ type: "p", content: ctaPart });
      }
    }

    return {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      body: content,
      content: content,
      category: (article.category as any) || "Marketing Digital",
      tags: article.tags ? article.tags.split(",").map((t) => t.trim()) : [],
      author: article.author || "Equipo Impulsala",
      date: new Date(article.createdAt).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      rawDate: article.createdAt.toISOString(),
      readTime: "5 min",
      readingTime: 5,
      image,
      featured: article.featured,
    } as unknown as BlogPost;
  } catch (error) {
    console.error("Error buscando artículo en CRM:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Buscar primero en los artículos estáticos
  let post: BlogPost | null | undefined = getPostBySlug(slug);

  // Si no se encuentra, buscar en el CRM
  if (!post) {
    post = await getPostFromCRM(slug);
  }

  if (!post) return { title: "Artículo no encontrado — Impulsala" };

  const articleUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} — Impulsala Blog`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: articleUrl,
      siteName: "Impulsala",
      locale: "es_CO",
      images: post.image
        ? [{ url: post.image, width: 1200, height: 630, alt: post.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Buscar primero en los artículos estáticos
  let post: BlogPost | null | undefined = getPostBySlug(slug);

  // Si no se encuentra, buscar en el CRM
  if (!post) {
    post = await getPostFromCRM(slug);
  }

  if (!post) notFound();

  const related = getRelatedPosts(post, 3);
  const articleUrl = `${SITE_URL}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    url: articleUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "Impulsala",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Impulsala",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    inLanguage: "es-CO",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogArticle post={post} relatedPosts={related} />
      <AiChatFabWrapper />
    </>
  );
}
