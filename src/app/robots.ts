import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impulsala.com";

// Nada se bloquea por robots.txt: las rutas internas (/crm, /api) se excluyen
// con X-Robots-Tag noindex (next.config.ts). Bloquear por robots.txt hace que
// Search Console las reporte como "Bloqueada por robots.txt" sin poder ver el
// noindex, y ensucia el informe de indexación.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
