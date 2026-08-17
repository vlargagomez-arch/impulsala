"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  Eye,
  Star,
  Calendar,
} from "lucide-react";
import { useFetch } from "./types";

interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  author: string;
  imageUrl: string | null;
  featured: boolean;
  published: boolean;
  views: number;
  createdAt: string;
}

interface BlogResponse {
  articles: BlogArticle[];
  count: number;
}

const CATEGORIES = [
  "Marketing Digital",
  "SEO",
  "Desarrollo Web",
  "Automatización IA",
  "Publicidad Digital",
  "Casos de Éxito",
];

export function CrmBlog() {
  const { data, loading, refetch } = useFetch<BlogResponse>("/api/crm/blog");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogArticle | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Marketing Digital");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("Equipo Impulsala");
  const [imageUrl, setImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  const articles = data?.articles || [];

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setCategory("Marketing Digital");
    setTags("");
    setAuthor("Equipo Impulsala");
    setImageUrl("");
    setFeatured(false);
    setPublished(true);
    setEditing(null);
    setShowForm(false);
  };

  const editArticle = (a: BlogArticle) => {
    setEditing(a);
    setTitle(a.title);
    setExcerpt(a.excerpt);
    setContent(a.content);
    setCategory(a.category);
    setTags(a.tags);
    setAuthor(a.author);
    setImageUrl(a.imageUrl || "");
    setFeatured(a.featured);
    setPublished(a.published);
    setShowForm(true);
  };

  const save = async () => {
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      alert("Título, resumen y contenido son requeridos");
      return;
    }
    setSaving(true);
    setSuccess(null);

    try {
      // Parsear contenido (puede ser texto plano o JSON)
      let contentData: string = content;
      try {
        const parsed = JSON.parse(content);
        contentData = parsed;
      } catch {
        // Si no es JSON, convertir a formato de bloques
        const paragraphs = content.split("\n\n").filter((p) => p.trim());
        contentData = JSON.stringify(
          paragraphs.map((p) => ({
            type: "p",
            content: p.trim(),
          }))
        );
      }

      if (editing) {
        // Actualizar
        const res = await fetch("/api/crm/blog", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editing.id,
            title,
            excerpt,
            content: contentData,
            category,
            tags,
            author,
            imageUrl,
            featured,
            published,
          }),
        });
        if (res.ok) {
          setSuccess("Artículo actualizado");
          resetForm();
          refetch();
        }
      } else {
        // Crear nuevo
        const res = await fetch("/api/crm/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            excerpt,
            content: contentData,
            category,
            tags,
            author,
            imageUrl,
            featured,
            published,
          }),
        });
        if (res.ok) {
          setSuccess("Artículo creado");
          resetForm();
          refetch();
        }
      }
    } catch (e) {
      alert("Error al guardar");
    }
    setSaving(false);
    setTimeout(() => setSuccess(null), 3000);
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este artículo?")) return;
    await fetch(`/api/crm/blog?id=${id}`, { method: "DELETE" });
    refetch();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Blog ({articles.length})</h3>
          <p className="text-xs text-muted-foreground">Crea y administra artículos del blog</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-sky-600 hover:from-violet-500 hover:to-sky-500 text-white rounded-xl text-sm font-semibold transition"
        >
          <Plus className="w-4 h-4" />
          Nuevo artículo
        </button>
      </div>

      {/* Success message */}
      {success && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300 text-sm">
          ✓ {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-foreground">
              {editing ? "Editar artículo" : "Nuevo artículo"}
            </h4>
            <button onClick={resetForm} className="p-1 rounded-lg hover:bg-muted">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Cómo aumentar tus ventas con IA en 2026"
              className="w-full mt-1 px-3 py-2 bg-background/60 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Resumen *</label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Breve descripción del artículo (1-2 líneas)"
              className="w-full mt-1 px-3 py-2 bg-background/60 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">
              Contenido * (escribe párrafos separados por línea en blanco)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={"Primer párrafo del artículo...\n\nSegundo párrafo...\n\nTercer párrafo..."}
              rows={10}
              className="w-full mt-1 px-3 py-2 bg-background/60 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-background/60 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Autor</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-background/60 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Tags (separados por coma)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ia, ventas, marketing"
                className="w-full mt-1 px-3 py-2 bg-background/60 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">URL de imagen (opcional)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/blog/mi-articulo.webp"
                className="w-full mt-1 px-3 py-2 bg-background/60 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded"
              />
              ⭐ Destacado
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded"
              />
              📤 Publicado
            </label>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-sky-600 hover:from-violet-500 hover:to-sky-500 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                {editing ? "Actualizar" : "Publicar"} artículo
              </>
            )}
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No hay artículos creados desde el CRM</p>
          <p className="text-xs mt-1">Los artículos existentes del blog siguen funcionando</p>
        </div>
      ) : (
        <div className="space-y-2">
          {articles.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-border bg-card/60 p-3 hover:border-violet-500/30 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {a.featured && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                    <h4 className="text-sm font-semibold text-foreground truncate">{a.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.excerpt}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                    <span className="px-2 py-0.5 rounded bg-violet-500/15 text-violet-400">
                      {a.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {a.views} vistas
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(a.createdAt).toLocaleDateString("es-CO")}
                    </span>
                    {a.published ? (
                      <span className="text-emerald-400">✓ Publicado</span>
                    ) : (
                      <span className="text-amber-400">Borrador</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => editArticle(a)}
                    className="p-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 transition"
                    title="Editar"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => remove(a.id)}
                    className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
