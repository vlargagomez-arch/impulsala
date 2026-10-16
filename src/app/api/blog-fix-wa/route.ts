import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const WA_URL = "https://wa.me/573196354992?text=Hola,%20quiero%20agendar%20mi%20diagn%C3%B3stico%20gratis%20con%20Impulsala";
const WA_LINK = `[319 635 4992](${WA_URL})`;

export async function GET() {
  try {
    const articles = await db.blogArticle.findMany();
    const results: any[] = [];
    
    for (const article of articles) {
      let content = article.content;
      let changed = false;
      
      if (typeof content === "string") {
        // Reemplazar cualquier link de WhatsApp existente por el nuevo con mensaje
        const newContent = content
          // Links markdown existentes de WhatsApp
          .replace(/\[([^\]]*)\]\(https:\/\/wa\.me\/573196354992[^)]*\)/gi, WA_LINK)
          .replace(/\[([^\]]*)\]\(https:\/\/wa\.me\/573196354992\)/gi, WA_LINK)
          // Texto plano sin link
          .replace(/WhatsApp al \+?57?\s*319\s*635\s*4992/gi, `WhatsApp al ${WA_LINK}`)
          .replace(/WhatsApp:?\s*\+?57?\s*319\s*635\s*4992/gi, `WhatsApp: ${WA_LINK}`)
          .replace(/whatsapp al \+?57?\s*319\s*635\s*4992/gi, `WhatsApp al ${WA_LINK}`)
          // También agregar CTA al final si no existe
          ;
        
        if (newContent !== content) {
          content = newContent;
          changed = true;
        }
        
        // Agregar CTA con link de WhatsApp al final si no lo tiene
        if (!content.includes("wa.me/573196354992?text=")) {
          content += `\n\n---\n\n**¿Listo para empezar?** Agenda tu diagnóstico gratis con Impulsala escribiéndonos al WhatsApp: [319 635 4992](${WA_URL})`;
          changed = true;
        }
        
        if (changed) {
          await db.blogArticle.update({
            where: { id: article.id },
            data: { content },
          });
          results.push({ slug: article.slug, updated: true });
        }
      } else if (Array.isArray(content)) {
        const newBlocks = (content as any[]).map((block: any) => {
          if (typeof block.content === "string") {
            const original = block.content;
            block.content = block.content
              .replace(/\[([^\]]*)\]\(https:\/\/wa\.me\/573196354992[^)]*\)/gi, WA_LINK)
              .replace(/\[([^\]]*)\]\(https:\/\/wa\.me\/573196354992\)/gi, WA_LINK)
              .replace(/WhatsApp al \+?57?\s*319\s*635\s*4992/gi, `WhatsApp al ${WA_LINK}`)
              .replace(/WhatsApp:?\s*\+?57?\s*319\s*635\s*4992/gi, `WhatsApp: ${WA_LINK}`);
            if (block.content !== original) changed = true;
          }
          return block;
        });
        
        // Agregar bloque CTA al final si no tiene el link con mensaje
        const hasWAMessage = JSON.stringify(newBlocks).includes("wa.me/573196354992?text=");
        if (!hasWAMessage) {
          newBlocks.push({ type: "p", content: `---` });
          newBlocks.push({ type: "p", content: `**¿Listo para empezar?** Agenda tu diagnóstico gratis con Impulsala escribiéndonos al WhatsApp: [319 635 4992](${WA_URL})` });
          changed = true;
        }
        
        if (changed) {
          await db.blogArticle.update({
            where: { id: article.id },
            data: { content: JSON.stringify(newBlocks) },
          });
          results.push({ slug: article.slug, updated: true });
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      updated: results.length,
      total: articles.length,
      results 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
