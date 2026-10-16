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

    // Asignar imagen por defecto según categoría si no tiene
    let image = article.imageUrl || "/blog/default.webp";
    if (!article.imageUrl) {
      const cat = article.category || "Marketing Digital";
      if (cat.includes("SEO")) image = "/blog/seo-con-ia.webp";
      else if (cat.includes("Ads") || cat.includes("Publicidad")) image = "/blog/google-ads-ia.webp";
      else if (cat.includes("IA") || cat.includes("Automatización")) image = "/blog/agentes-ia-venden.webp";
      else if (cat.includes("Web") || cat.includes("Desarrollo")) image = "/blog/pagina-web-vende.webp";
      else if (cat.includes("Email")) image = "/blog/email-marketing-ia.webp";
      else if (cat.includes("WhatsApp")) image = "/blog/whatsapp-business-ia.webp";
      else if (cat.includes("CRM")) image = "/blog/crm-piensa-por-ti.webp";
      else if (cat.includes("E-commerce") || cat.includes("Tienda")) image = "/blog/ecommerce-autonomo.webp";
      else image = "/blog/default.webp";
    }

    // Parsear contenido
    let content: any = article.content;
    if (typeof content === "string") {
      try {
        content = JSON.parse(content);
      } catch {
        // Si no es JSON, convertir a bloques simples
        content = [{ type: "p", content: content }];
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
