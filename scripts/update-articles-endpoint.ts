import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const articles = await req.json();
    const results = [];
    
    for (const article of articles) {
      const updated = await db.blogArticle.update({
        where: { slug: article.slug },
        data: { content: article.content },
      });
      results.push({ slug: article.slug, ok: true });
    }
    
    return NextResponse.json({ success: true, updated: results.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
