import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/components/site/blog-data";

const BASE_URL = "https://w14nq5fjb3z1-d.space-z.ai";

// Fecha de última actualización del sitio (home + blog + páginas estáticas)
const HOME_LASTMOD = "2026-07-08";
const ARTICLE_LASTMOD = "2026-07-01";

export default function sitemap(): MetadataRoute.Sitemap {
  // Páginas principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(HOME_LASTMOD),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/servicios`,
      lastModified: new Date(HOME_LASTMOD),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/servicios/desarrollo-web`,
      lastModified: new Date(HOME_LASTMOD),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/servicios/seo`,
      lastModified: new Date(HOME_LASTMOD),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/servicios/publicidad-digital`,
      lastModified: new Date(HOME_LASTMOD),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/servicios/automatizacion-ia`,
      lastModified: new Date(HOME_LASTMOD),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/diagnostico-gratis`,
      lastModified: new Date(HOME_LASTMOD),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(HOME_LASTMOD),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/demos`,
      lastModified: new Date(HOME_LASTMOD),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: new Date(HOME_LASTMOD),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Artículos del blog — priority 0.8, monthly
  const blogPosts: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(ARTICLE_LASTMOD),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPosts];
}
