import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/blog/posts
 * API público que devuelve los artículos del blog creados desde el CRM.
 * No requiere auth (es público para que el blog los muestre).
 */
export async function GET() {
  try {
    const articles = await db.blogArticle.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        category: true,
        tags: true,
        author: true,
        imageUrl: true,
        featured: true,
        views: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ articles, count: articles.length });
  } catch (error: any) {
    // Si la BD no está disponible, devolver vacío
    return NextResponse.json({ articles: [], count: 0 });
  }
}
