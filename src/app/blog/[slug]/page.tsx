import { notFound } from "next/navigation";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from "@/components/site/blog-data";
import { BlogArticle } from "@/components/site/blog-article";
import { SITE_URL } from "@/lib/site-config";
import AiChatFabWrapper from "@/components/site/ai-chat-fab-wrapper";
import { db } from "@/lib/db";
import type { BlogPost, BlogCategory } from "@/components/site/blog-data";

// Los artículos del agente SEO viven en la base de datos: revalidamos seguido para
// que aparezcan publicados sin necesitar un nuevo despliegue.
export const revalidate = 60;
export const dynamicParams = true;

const CATEGORIAS: BlogCategory[] = [
  "Desarrollo Web",
  "SEO",
  "Marketing Digital",
  "Automatización con IA",
  "Casos de Éxito",
];

function normalizarCategoria(valor: string | null | undefined): BlogCategory {
  if (!valor) return "Marketing Digital";
  const exacta = CATEGORIAS.find((c) => c.toLowerCase() === valor.toLowerCase());
  if (exacta) return exacta;
  const parcial = CATEGORIAS.find((c) => valor.toLowerCase().includes(c.toLowerCase().split(" ")[0]));
  return parcial || "Marketing Digital";
}

type DbArticle = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  author: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/** Convierte un artículo creado por el agente IA al formato que renderiza la web. */
function desdeBaseDeDatos(a: DbArticle): BlogPost {
  let body: BlogPost["body"] = [];
  try {
    const parsed = JSON.parse(a.content);
    if (Array.isArray(parsed)) body = parsed;
  } catch {
    body = a.content
      .split("\n\n")
      .filter((p) => p.trim())
      .map((p) => ({ type: "p" as const, content: p.trim() }));
  }

  const palabras = body.reduce((total, b) => {
    if (b.items?.length) return total + b.items.join(" ").split(/\s+/).length;
    return total + (b.content || "").split(/\s+/).length;
  }, 0);

  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: normalizarCategoria(a.category),
    tags: a.tags ? a.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    author: { name: a.author || "Equipo Impulsala", role: "Equipo Impulsala" },
    date: new Date(a.createdAt).toISOString().slice(0, 10),
    readingTime: Math.max(3, Math.round(palabras / 200)),
    image: a.imageUrl || undefined,
    cover: { from: "from-violet-500/30", to: "to-sky-500/20", icon: "Bot" },
    body,
  };
}

/** Primero busca en los artículos estáticos; si no está, en los que publica el agente. */
async function buscarArticulo(slug: string): Promise<BlogPost | null> {
  const estatico = getPostBySlug(slug);
  if (estatico) return estatico;
  try {
    const articulo = await db.blogArticle.findFirst({ where: { slug, published: true } });
    if (!articulo) return null;
    return desdeBaseDeDatos(articulo);
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await buscarArticulo(slug);
  if (!post) return { title: "Artículo no encontrado" };

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
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ["Impulsala"],
      tags: post.tags,
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
  const post = await buscarArticulo(slug);
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
        url: `${SITE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    wordCount: post.body.length * 80,
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
