"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Calendar, Clock, ArrowRight, Search, TrendingUp, Bot, Megaphone,
  Cog, Sparkles, Code2, Newspaper, Mail, Tag, ChevronRight, X,
  ShoppingCart, CheckCircle, Award,
} from "lucide-react";
import { BLOG_POSTS, BLOG_CATEGORIES, ALL_TAGS, type BlogCategory, type BlogPost } from "@/components/site/blog-data";

const CATEGORY_ICONS: Record<BlogCategory, React.ComponentType<{ className?: string }>> = {
  "Desarrollo Web": Code2,
  "SEO": Search,
  "Marketing Digital": Megaphone,
  "Automatización con IA": Bot,
  "Casos de Éxito": Award,
};

const CATEGORY_STYLES: Record<BlogCategory, { dot: string; badge: string; gradient: string }> = {
  "Desarrollo Web": { dot: "bg-sky-500", badge: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20", gradient: "from-sky-500/40 via-blue-500/20 to-transparent" },
  "SEO": { dot: "bg-cyan-500", badge: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20", gradient: "from-cyan-500/40 via-blue-500/20 to-transparent" },
  "Marketing Digital": { dot: "bg-amber-500", badge: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20", gradient: "from-amber-500/40 via-orange-500/20 to-transparent" },
  "Automatización con IA": { dot: "bg-emerald-500", badge: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20", gradient: "from-emerald-500/40 via-cyan-500/20 to-transparent" },
  "Casos de Éxito": { dot: "bg-violet-500", badge: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20", gradient: "from-violet-500/40 via-indigo-500/20 to-transparent" },
};

export function BlogSection() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "Todos">("Todos");
  const [crmPosts, setCrmPosts] = useState<BlogPost[]>([]);

  // Cargar artículos del CRM
  useEffect(() => {
    fetch("/api/blog/posts")
      .then((r) => r.json())
      .then((data) => {
        if (data.articles && data.articles.length > 0) {
          // Convertir artículos del CRM al formato BlogPost
          const converted: BlogPost[] = data.articles.map((a: any) => ({
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt,
            content: typeof a.content === "string" ? JSON.parse(a.content) : a.content,
            category: a.category,
            tags: a.tags ? a.tags.split(",").map((t: string) => t.trim()) : [],
            author: a.author,
            date: new Date(a.createdAt).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" }),
            readTime: "5 min",
            image: a.imageUrl || "/blog/default.webp",
            featured: a.featured,
          }));
          setCrmPosts(converted);
        }
      })
      .catch(() => {});
  }, []);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 6;

  // Combinar artículos estáticos con los del CRM
  const allPosts = [...crmPosts, ...BLOG_POSTS];
  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1);

  const filtered = useMemo(() => {
    let result = activeCategory === "Todos" ? allPosts : allPosts.filter((p) => p.category === activeCategory);
    if (activeTag) result = result.filter((p) => p.tags.includes(activeTag));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeCategory, activeTag, search]);

  const isFiltering = activeCategory !== "Todos" || search.trim() !== "" || activeTag !== null;
  const visibleTags = showAllTags ? ALL_TAGS : ALL_TAGS.slice(0, 10);

  // Paginación para recentPosts
  const totalRecentPages = Math.ceil(recentPosts.length / POSTS_PER_PAGE);
  const paginatedRecent = recentPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  // Paginación para filtered
  const totalFilteredPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginatedFiltered = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  // Reset página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, activeTag, search]);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-10 sm:pt-36 sm:pb-12">
        <div className="absolute inset-0 bg-grid mask-fade-bottom opacity-15" />
        <div className="absolute left-1/2 top-0 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Blog</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
                <Newspaper className="h-3 w-3 text-primary" /> Blog & Insights
              </motion.span>
              <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ideas que hacen crecer <span className="text-gradient-animated">tu negocio</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                Análisis, tendencias y casos de estudio sobre IA, SEO, Ads y automatización.
              </motion.p>

              {/* Search */}
              <div className="mt-5 relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar artículos..." className="w-full rounded-xl border border-border/60 bg-card/40 py-2.5 pl-10 pr-4 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            {/* Ilustración lado derecho */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-sky-500/5 to-transparent rounded-3xl" />
                <div className="relative grid grid-cols-2 gap-3 p-6">
                  {[
                    { icon: Bot, label: "IA & Chatbots", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                    { icon: Search, label: "SEO Orgánico", color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
                    { icon: Megaphone, label: "Google Ads", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                    { icon: Code2, label: "Desarrollo Web", color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className={`flex flex-col items-center gap-2 rounded-2xl border ${item.border} ${item.bg} p-4`}
                    >
                      <item.icon className={`h-8 w-8 ${item.color}`} />
                      <span className="text-xs font-semibold text-foreground">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
                {/* Badge flotante */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-3 -right-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-sky-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  +12 artículos
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters bar */}
      <div className="sticky top-16 z-30 border-y border-border/40 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="scrollbar-thin flex gap-2 overflow-x-auto py-3">
            <button onClick={() => { setActiveCategory("Todos"); setActiveTag(null); }} className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${activeCategory === "Todos" && !activeTag ? "bg-primary text-primary-foreground" : "bg-secondary/40 text-muted-foreground hover:text-foreground"}`}>
              Todos <span className="ml-1 opacity-60">{allPosts.length}</span>
            </button>
            {BLOG_CATEGORIES.map((cat) => {
              const count = allPosts.filter((p) => p.category === cat).length;
              return (
                <button key={cat} onClick={() => { setActiveCategory(cat); setActiveTag(null); }} className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary/40 text-muted-foreground hover:text-foreground"}`}>
                  {cat} <span className="ml-1 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="border-b border-border/40 bg-secondary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground mr-1">
              <Tag className="h-3 w-3" /> Tags:
            </span>
            {visibleTags.map(({ tag, count }) => (
              <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)} className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-all ${activeTag === tag ? "bg-primary text-primary-foreground" : "bg-secondary/30 text-muted-foreground hover:text-foreground"}`}>
                #{tag}
              </button>
            ))}
            {ALL_TAGS.length > 10 && (
              <button onClick={() => setShowAllTags(!showAllTags)} className="text-[10px] text-primary hover:underline">
                {showAllTags ? "− menos" : `+${ALL_TAGS.length - 10} más`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!isFiltering ? (
            <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Featured */}
              <FeaturedCard post={featuredPost} />

              <div className="mt-10 mb-5 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h2 className="text-base font-bold">Artículos recientes</h2>
                <span className="text-xs text-muted-foreground">({recentPosts.length})</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedRecent.map((post, i) => <ArticleCard key={post.slug} post={post} index={i} />)}
              </div>

              {/* Paginación recentPosts */}
              {totalRecentPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronRight className="h-3.5 w-3.5 rotate-180" /> Anterior
                  </button>
                  {Array.from({ length: totalRecentPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "border border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalRecentPages, p + 1))}
                    disabled={currentPage === totalRecentPages}
                    className="flex items-center gap-1 rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-30"
                  >
                    Siguiente <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="filtered" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? "artículo" : "artículos"}{activeTag && ` · #${activeTag}`}{search.trim() && ` · "${search}"`}</p>
                <button onClick={() => { setSearch(""); setActiveCategory("Todos"); setActiveTag(null); }} className="flex items-center gap-1 text-xs text-primary hover:underline">
                  <X className="h-3 w-3" /> Limpiar
                </button>
              </div>
              {filtered.length > 0 ? (
                <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedFiltered.map((post, i) => <ArticleCard key={post.slug} post={post} index={i} />)}
                </div>

                {/* Paginación filtered */}
                {totalFilteredPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronRight className="h-3.5 w-3.5 rotate-180" /> Anterior
                    </button>
                    {Array.from({ length: totalFilteredPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground"
                            : "border border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalFilteredPages, p + 1))}
                      disabled={currentPage === totalFilteredPages}
                      className="flex items-center gap-1 rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-30"
                    >
                      Siguiente <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                </>
              ) : (
                <div className="py-16 text-center">
                  <Search className="mx-auto h-10 w-10 text-muted-foreground/20" />
                  <p className="mt-3 text-sm text-muted-foreground">No se encontraron artículos.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Newsletter */}
      <section className="border-t border-border/40 py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card/40 to-accent/5 p-6 text-center sm:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">
              <Mail className="h-3 w-3" /> Newsletter
            </span>
            <h3 className="mt-3 text-xl font-bold sm:text-2xl">Suscríbete a la newsletter</h3>
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              Recibe estrategias de marketing digital, IA y SEO cada 2 semanas. Sin spam, solo contenido útil.
            </p>
            <form
              className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-2 sm:max-w-md sm:mx-auto"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.querySelector("input") as HTMLInputElement;
                const email = input.value.trim();
                if (!email) return;
                try {
                  const res = await fetch("/api/newsletter", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, source: "blog" }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    input.value = "";
                    form.querySelector("button")!.textContent = data.alreadySubscribed ? "Ya estabas suscrito ✓" : "¡Suscrito! ✓";
                    setTimeout(() => {
                      form.querySelector("button")!.textContent = "Suscribirme gratis";
                    }, 3000);
                  } else {
                    alert(data.error || "Error al suscribirse");
                  }
                } catch {
                  alert("Error de conexión. Intenta de nuevo.");
                }
              }}
            >
              <input
                type="email"
                required
                placeholder="tu@email.com"
                className="flex-1 rounded-xl border border-border/60 bg-card/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Suscribirme gratis <ArrowRight className="h-3 w-3" />
              </button>
            </form>
            <p className="mt-2 text-[10px] text-muted-foreground">✓ Sin spam · ✓ Cancela cuando quieras · ✓ Contenido exclusivo</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============ Featured Card ============ */
function FeaturedCard({ post }: { post: BlogPost }) {
  const style = CATEGORY_STYLES[post.category];
  return (
    <Link href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition-all hover:border-primary/40 hover:shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-56 overflow-hidden sm:h-64 lg:h-auto">
          {post.image && <img src={post.image} alt={post.title} loading="lazy" width="400" height="200" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground">DESTACADO</span>
        </div>
        <div className="flex flex-col justify-center p-5 sm:p-6">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium ${style.badge} w-fit`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} /> {post.category}
          </span>
          <h2 className="mt-3 text-xl font-bold leading-tight sm:text-2xl">{post.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((t) => <span key={t} className="rounded-full bg-secondary/30 px-1.5 py-0.5 text-[9px] text-muted-foreground">#{t}</span>)}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.date).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readingTime} min</span>
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-primary transition-transform group-hover:translate-x-1">Leer <ArrowRight className="h-3.5 w-3.5" /></span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ============ Article Card ============ */
function ArticleCard({ post, index }: { post: BlogPost; index: number }) {
  const style = CATEGORY_STYLES[post.category];
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: (index % 6) * 0.05 }}>
      <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card/40 transition-all hover:border-primary/40 hover:shadow-lg">
        <div className="relative h-36 overflow-hidden">
          {post.image && <img src={post.image} alt={post.title} loading="lazy" width="400" height="200" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
          <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />
          <span className={`absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px] font-medium ${style.badge} backdrop-blur-sm`}>
            <span className={`h-1 w-1 rounded-full ${style.dot}`} /> {post.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-3.5">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug">{post.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{post.excerpt}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {post.tags.slice(0, 2).map((t) => <span key={t} className="rounded-full bg-secondary/20 px-1.5 py-0.5 text-[8px] text-muted-foreground">#{t}</span>)}
          </div>
          <div className="mt-auto pt-2.5 flex items-center justify-between text-[9px] text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />{new Date(post.date).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}</span>
            <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{post.readingTime} min</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
