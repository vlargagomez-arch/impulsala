import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const articles = await db.blogArticle.findMany();
    const results: any[] = [];
    
    for (const article of articles) {
      // Asignar imagen directamente en la base de datos
      const imageUrl = `/blog/crm/${article.slug}.webp`;
      
      await db.blogArticle.update({
        where: { id: article.id },
        data: { imageUrl },
      });
      
      results.push({ slug: article.slug, imageUrl });
    }
    
    return NextResponse.json({ 
      success: true, 
      updated: results.length,
      results: results.slice(0, 5)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
