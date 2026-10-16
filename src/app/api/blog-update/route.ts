import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/blog-update
 * Actualiza el contenido de artículos del blog.
 * Endpoint temporal para completar artículos cortos.
 */
export async function POST(req: NextRequest) {
  try {
    const articles = await req.json();
    const results: any[] = [];
    
    for (const article of articles) {
      try {
        const updated = await db.blogArticle.update({
          where: { slug: article.slug },
          data: { content: article.content },
        });
        results.push({ slug: article.slug, ok: true, title: updated.title });
      } catch (err: any) {
        results.push({ slug: article.slug, ok: false, error: err.message });
      }
    }
    
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET para probar sin auth
export async function GET() {
  return NextResponse.json({ 
    status: "ready",
    message: "Endpoint de actualización de blog activo. Usar POST con array de artículos."
  });
}
