import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Actualiza todos los artículos del CRM para que el WhatsApp tenga link directo.
 */
export async function GET() {
  try {
    const articles = await db.blogArticle.findMany();
    const results: any[] = [];
    
    for (const article of articles) {
      let content = article.content;
      
      if (typeof content === "string") {
        // Reemplazar "WhatsApp al 319 635 4992" o "WhatsApp: 319 635 4992" por link
        content = content.replace(
          /WhatsApp al \+?57?\s*319\s*635\s*4992/gi,
          'WhatsApp al <a href="https://wa.me/573196354992" target="_blank" rel="noopener noreferrer" style="color: #22c55e; font-weight: bold; text-decoration: underline;">319 635 4992</a>'
        );
        content = content.replace(
          /WhatsApp:?\s*\+?57?\s*319\s*635\s*4992/gi,
          'WhatsApp: <a href="https://wa.me/573196354992" target="_blank" rel="noopener noreferrer" style="color: #22c55e; font-weight: bold; text-decoration: underline;">+57 319 635 4992</a>'
        );
        content = content.replace(
          /whatsapp al \+?57?\s*319\s*635\s*4992/gi,
          'WhatsApp al <a href="https://wa.me/573196354992" target="_blank" rel="noopener noreferrer" style="color: #22c55e; font-weight: bold; text-decoration: underline;">319 635 4992</a>'
        );
        
        // Solo actualizar si hubo cambios
        if (content !== article.content) {
          await db.blogArticle.update({
            where: { id: article.id },
            data: { content },
          });
          results.push({ slug: article.slug, updated: true });
        }
      } else if (Array.isArray(content)) {
        // Si el contenido es un array de bloques
        let changed = false;
        const newContent = (content as any[]).map((block: any) => {
          if (typeof block.content === "string") {
            const original = block.content;
            block.content = block.content.replace(
              /WhatsApp al \+?57?\s*319\s*635\s*4992/gi,
              'WhatsApp al [319 635 4992](https://wa.me/573196354992)'
            );
            block.content = block.content.replace(
              /WhatsApp:?\s*\+?57?\s*319\s*635\s*4992/gi,
              'WhatsApp: [+57 319 635 4992](https://wa.me/573196354992)'
            );
            if (block.content !== original) changed = true;
          }
          return block;
        });
        
        if (changed) {
          await db.blogArticle.update({
            where: { id: article.id },
            data: { content: JSON.stringify(newContent) },
          });
          results.push({ slug: article.slug, updated: true });
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      updated: results.length,
      results 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
