import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/components/site/blog-data";
import { db } from "@/lib/db";

// URL canónica del sitio: sale de NEXT_PUBLIC_SITE_URL (fallback impulsala.com)
import { SITE_URL as BASE_URL } from "@/lib/site-config";

export const revalidate = 3600; // 1 h: los artículos nuevos del agente entran solos

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // lastmod REAL (no `now`, que cambia en cada request y Google acaba ignorándolo)
  const UPD = new Date("2026-10-18T00:00:00Z");

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: UPD, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/servicios`, lastModified: UPD, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/servicios/desarrollo-web`, lastModified: UPD, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/servicios/seo`, lastModified: UPD, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/servicios/publicidad-digital`, lastModified: UPD, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/servicios/automatizacion-ia`, lastModified: UPD, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/diagnostico-gratis`, lastModified: UPD, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: UPD, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/demos`, lastModified: UPD, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contacto`, lastModified: UPD, changeFrequency: "monthly", priority: 0.8 },
  ];

  // Artículos escritos a mano (blog-data.ts)
  const localPosts: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Artículos publicados por el agente SEO en la BD (antes NO se anunciaban a Google)
  let dbPosts: MetadataRoute.Sitemap = [];
  try {
    const rows = await db.blogArticle.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 500,
    });
    const seen = new Set(BLOG_POSTS.map((p) => p.slug));
    dbPosts = rows
      .filter((r) => r.slug && !seen.has(r.slug))
      .map((r) => ({
        url: `${BASE_URL}/blog/${r.slug}`,
        lastModified: r.updatedAt ?? UPD,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch {
    // Si la BD no responde, el sitemap igual sirve las páginas estáticas
  }

  return [...staticPages, ...localPosts, ...dbPosts];
}
