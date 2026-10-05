import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

/**
 * GET /api/blog/cover?slug=<slug>&title=<titulo>&cat=<categoria>
 * Devuelve la portada del artículo como IMAGEN real (PNG 1200x630).
 * Sirve para el correo diario y para las previsualizaciones en WhatsApp/redes.
 */

export const runtime = "edge";

const PALETA: Record<string, { from: string; to: string; icono: string }> = {
  "IA y Chatbots": { from: "#10b981", to: "#0ea5e9", icono: "🤖" },
  "SEO Orgánico": { from: "#10b981", to: "#059669", icono: "🔍" },
  "Ads y Performance": { from: "#f59e0b", to: "#ef4444", icono: "📈" },
  "Automatización": { from: "#a855f7", to: "#6366f1", icono: "⚙️" },
  "Nuevas tecnologías": { from: "#eab308", to: "#f97316", icono: "🚀" },
  "Desarrollo Software": { from: "#0ea5e9", to: "#6366f1", icono: "💻" },
  "Marketing Digital": { from: "#8b5cf6", to: "#0ea5e9", icono: "✨" },
};

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const title = (p.get("title") || "Impulsala").slice(0, 110);
  const category = (p.get("cat") || "Marketing Digital").slice(0, 40);
  const pal = PALETA[category] || PALETA["Marketing Digital"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: `linear-gradient(135deg, ${pal.from} 0%, ${pal.to} 100%)`,
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{ fontSize: 54 }}>{pal.icono}</div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              opacity: 0.92,
            }}
          >
            {category}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1.15, maxWidth: 1000 }}>
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>Impulsala</div>
          <div style={{ display: "flex", fontSize: 24, opacity: 0.9 }}>
            agencia digital · web · SEO · IA
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
