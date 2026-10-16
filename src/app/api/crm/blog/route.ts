import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

// GET — listar todos los artículos del blog
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const articles = await db.blogArticle.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ articles, count: articles.length });
}

// POST — crear nuevo artículo
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const body = await req.json();
  const { title, excerpt, content, category, tags, author, imageUrl, featured, published } = body;

  if (!title || !excerpt || !content) {
    return NextResponse.json(
      { error: "Título, resumen y contenido son requeridos" },
      { status: 400 }
    );
  }

  // Generar slug único
  let slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 80);

  // Verificar que el slug sea único
  const existing = await db.blogArticle.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-6)}`;
  }

  const article = await db.blogArticle.create({
    data: {
      slug,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: typeof content === "string" ? content : JSON.stringify(content),
      category: category || "Marketing Digital",
      tags: tags || "",
      author: author || "Equipo Impulsala",
      imageUrl: imageUrl || null,
      featured: featured || false,
      published: published !== false,
    },
  });

  return NextResponse.json({ article, success: true });
}

// DELETE — eliminar artículo
export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  await db.blogArticle.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

// PATCH — actualizar artículo
export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  const article = await db.blogArticle.update({
    where: { id },
    data: updates,
  });

  return NextResponse.json({ article, success: true });
}
