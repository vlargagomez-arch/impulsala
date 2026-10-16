"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar, Clock, ArrowRight, ArrowLeft, ChevronRight, Tag,
  Share2, Link2, Check, TrendingUp, X,
} from "lucide-react";
import type { BlogPost, BlogCategory } from "@/components/site/blog-data";

const CATEGORY_STYLES: Record<BlogCategory, { dot: string; badge: string }> = {
  "Desarrollo Web": { dot: "bg-sky-500", badge: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20" },
  "SEO": { dot: "bg-cyan-500", badge: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  "Marketing Digital": { dot: "bg-amber-500", badge: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20" },
  "Automatización con IA": { dot: "bg-emerald-500", badge: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  "Casos de Éxito": { dot: "bg-violet-500", badge: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20" },
};

export function BlogArticle({ post, relatedPosts }: { post: BlogPost; relatedPosts: BlogPost[] }) {
  const [copied, setCopied] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const style = CATEGORY_STYLES[post.category];

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = (platform: string) => {
    if (platform === "copy") {
      navigator.clipboard?.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
    }
  };

  return (
    <article className="bg-background min-h-screen">
      {/* Floating close button (always visible) */}
      <Link
        href="/blog"
        className="fixed left-4 top-20 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground shadow-lg backdrop-blur-sm transition-all hover:text-foreground hover:border-primary/40 sm:left-6"
        aria-label="Volver al blog"
      >
        <X className="h-5 w-5" />
      </Link>

      {/* Floating share buttons (desktop) */}
      <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 sm:flex">
        <button onClick={() => handleShare("linkedin")} aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground shadow backdrop-blur-sm transition-colors hover:text-foreground">
          <Share2 className="h-4 w-4" />
        </button>
        <button onClick={() => handleShare("twitter")} aria-label="X" className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground shadow backdrop-blur-sm transition-colors hover:text-foreground text-xs font-bold">
          X
        </button>
        <button onClick={() => handleShare("copy")} aria-label="Copiar link" className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground shadow backdrop-blur-sm transition-colors hover:text-foreground">
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground shadow-lg backdrop-blur-sm transition-colors hover:text-foreground"
          aria-label="Volver arriba"
        >
          <ArrowLeft className="h-4 w-4 -rotate-90" />
        </button>
      )}

      {/* Header */}
      <header className="relative overflow-hidden pt-28 pb-6 sm:pt-32 sm:pb-8">
        <div className="absolute inset-0 bg-grid mask-fade-bottom opacity-15" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-[100px]" />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-5">
            <Link href="/" className="hover:text-foreground">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate max-w-[150px]">{post.category}</span>
          </nav>

          {/* Category */}
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${style.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} /> {post.category}
          </span>

          {/* Title */}
          <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="mt-3 text-sm text-muted-foreground sm:text-base leading-relaxed">{post.excerpt}</p>

          {/* Meta */}
          <div className="mt-5 flex items-center gap-4 border-y border-border/40 py-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{new Date(post.date).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{post.readingTime} min</span>
            <span className="ml-auto flex items-center gap-1.5 font-medium text-foreground/80">{post.author.name}</span>
          </div>
        </div>
      </header>

      {/* Cover image */}
      {post.image && (
        <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12 mb-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-12 pb-10">
        <div className="space-y-4">
          {post.body.map((block, i) => {
            if (block.type === "p") return <p key={i} className="text-[15px] leading-[1.75] text-foreground/90">{block.content}</p>;
            if (block.type === "h2") return <h2 key={i} className="pt-4 text-xl font-bold text-foreground sm:text-2xl">{block.content}</h2>;
            if (block.type === "h3") return <h3 key={i} className="pt-3 text-lg font-semibold text-foreground">{block.content}</h3>;
            if (block.type === "ul" && block.items) return (
              <ul key={i} className="space-y-2 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-[15px] text-foreground/90">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />{item}
                  </li>
                ))}
              </ul>
            );
            if (block.type === "quote") return (
              <blockquote key={i} className="border-l-4 border-primary/50 bg-primary/5 px-5 py-4 text-base italic text-foreground">
                "{block.content}"
              </blockquote>
            );
            if (block.type === "stat" && block.value && block.label) return (
              <div key={i} className="flex flex-col items-center gap-1 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6 text-center">
                <div className="text-4xl font-bold text-gradient-primary sm:text-5xl">{block.value}</div>
                <div className="mt-1 max-w-sm text-sm text-muted-foreground">{block.label}</div>
              </div>
            );
            return null;
          })}
        </div>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-border/40 pt-6">
          <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"><Tag className="h-3.5 w-3.5" /> Tags:</span>
          {post.tags.map((tag) => (
            <Link key={tag} href={`/blog`} className="rounded-full bg-secondary/40 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">#{tag}</Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
          <p className="text-sm font-semibold text-foreground">¿Quieres implementar esto en tu negocio?</p>
          <p className="mt-1 text-xs text-muted-foreground">Agenda un diagnóstico gratuito de 30 minutos.</p>
          <Link href="/contacto" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            Solicitar diagnóstico gratis <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Back to blog */}
        <Link href="/blog" className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver al blog
        </Link>
      </div>

      {/* Related */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border/40 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h2 className="text-base font-bold">Artículos relacionados</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rp, i) => {
                const rpStyle = CATEGORY_STYLES[rp.category];
                return (
                  <motion.div key={rp.slug} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <Link href={`/blog/${rp.slug}`} className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/40 transition-all hover:border-primary/40 hover:shadow-lg">
                      <div className="relative h-28 overflow-hidden">
                        {rp.image && <img src={rp.image} alt={rp.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />
                        <span className={`absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px] font-medium ${rpStyle.badge} backdrop-blur-sm`}>
                          <span className={`h-1 w-1 rounded-full ${rpStyle.dot}`} /> {rp.category}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-3.5">
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug">{rp.title}</h3>
                        <div className="mt-auto pt-2.5 flex items-center gap-2 text-[9px] text-muted-foreground">
                          <Calendar className="h-2.5 w-2.5" />{new Date(rp.date).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
                          <Clock className="h-2.5 w-2.5 ml-1" />{rp.readingTime} min
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
