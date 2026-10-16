"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { openAiChat } from "@/lib/open-ai-chat";
import {
  Calendar, Clock, ArrowRight, ArrowLeft, ChevronRight, Tag,
  Link2, Check, TrendingUp, X,
  Facebook, MessageCircle, Linkedin, Share2, BookOpen,
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
  const shareText = encodeURIComponent(post.title);
  const shareUrlEnc = encodeURIComponent(shareUrl);

  const handleShare = (platform: string) => {
    if (platform === "copy") {
      navigator.clipboard?.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrlEnc}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrlEnc}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrlEnc}`, "_blank");
    } else if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${shareText}%20${shareUrlEnc}`, "_blank");
    } else if (platform === "reddit") {
      window.open(`https://www.reddit.com/submit?url=${shareUrlEnc}&title=${shareText}`, "_blank");
    }
  };

  return (
    <article className="bg-background min-h-screen">
      {/* Floating close button — DERECHA, más arriba y más grande */}
      <Link
        href="/blog"
        className="fixed right-4 top-16 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card/90 text-muted-foreground shadow-lg backdrop-blur-sm transition-all hover:text-foreground hover:border-primary/40 sm:right-6 sm:top-20 sm:h-12 sm:w-12"
        aria-label="Cerrar artículo y volver al blog"
      >
        <X className="h-5 w-5 sm:h-6 sm:w-6" />
      </Link>

      {/* Share buttons flotantes — solo desktop, más abajo y centrado */}
      <div className="fixed right-4 top-44 z-40 hidden flex-col gap-2 sm:flex sm:right-6 sm:top-48">
        <span className="text-center text-[8px] font-semibold uppercase text-muted-foreground">Compartir</span>
        <button onClick={() => handleShare("facebook")} aria-label="Facebook" title="Facebook" className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground shadow backdrop-blur-sm transition-colors hover:text-blue-500 hover:border-blue-500/40">
          <Facebook className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => handleShare("twitter")} aria-label="X (Twitter)" title="X (Twitter)" className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground shadow backdrop-blur-sm transition-colors hover:text-foreground hover:border-foreground/40 text-[10px] font-bold">
          𝕏
        </button>
        <button onClick={() => handleShare("linkedin")} aria-label="LinkedIn" title="LinkedIn" className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground shadow backdrop-blur-sm transition-colors hover:text-blue-600 hover:border-blue-600/40">
          <Linkedin className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => handleShare("whatsapp")} aria-label="WhatsApp" title="WhatsApp" className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground shadow backdrop-blur-sm transition-colors hover:text-green-500 hover:border-green-500/40">
          <MessageCircle className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => handleShare("reddit")} aria-label="Reddit" title="Reddit" className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground shadow backdrop-blur-sm transition-colors hover:text-orange-500 hover:border-orange-500/40">
          <BookOpen className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => handleShare("copy")} aria-label="Copiar enlace" title="Copiar enlace" className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground shadow backdrop-blur-sm transition-colors hover:text-primary hover:border-primary/40">
          {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Link2 className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Header */}
      <header className="relative overflow-hidden pt-28 pb-6 sm:pt-32 sm:pb-8">
        <div className="absolute inset-0 bg-grid mask-fade-bottom opacity-15" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-5">
            <Link href="/" className="hover:text-foreground">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate">{post.title}</span>
          </nav>

          {/* Category + date */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${style.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} /> {post.category}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" /> {new Date(post.date).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" /> {post.readingTime} min de lectura
            </span>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-3 text-sm text-muted-foreground sm:text-base"
          >
            {post.excerpt}
          </motion.p>

          {/* Hero image */}
          {post.image && (
            <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl border border-border/40 bg-secondary/20">
              <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
            </div>
          )}
        </div>
      </header>

      {/* Content — ancho completo restaurado */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-8 lg:px-12">
        <div className="prose prose-sm sm:prose-base max-w-none">
          {post.body.map((block, i) => {
            if (block.type === "h2") {
              return <h2 key={i} className="mt-8 mb-3 text-xl font-bold text-foreground sm:text-2xl">{block.content}</h2>;
            }
            if (block.type === "h3") {
              return <h3 key={i} className="mt-6 mb-2 text-lg font-bold text-foreground sm:text-xl">{block.content}</h3>;
            }
            if (block.type === "p") {
              return <p key={i} className="mb-4 text-sm leading-relaxed text-foreground/80 sm:text-base">{block.content}</p>;
            }
            if (block.type === "quote") {
              return (
                <blockquote key={i} className="my-6 border-l-4 border-primary/40 pl-4 italic text-muted-foreground">
                  &ldquo;{block.content}&rdquo;
                </blockquote>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={i} className="mb-4 ml-4 space-y-1.5">
                  {block.items?.map((item, j) => (
                    <li key={j} className="text-sm text-foreground/80 sm:text-base list-disc">{item}</li>
                  ))}
                </ul>
              );
            }
            if (block.type === "stat") {
              return (
                <div key={i} className="my-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
                  <div className="text-3xl font-bold text-gradient-primary sm:text-4xl">{block.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{block.label}</div>
                </div>
              );
            }
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

        {/* Compartir en móvil — horizontal, dentro del artículo */}
        <div className="mt-4 flex flex-wrap items-center gap-2 sm:hidden">
          <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"><Share2 className="h-3.5 w-3.5" /> Compartir:</span>
          <button onClick={() => handleShare("facebook")} aria-label="Facebook" className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:text-blue-500">
            <Facebook className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => handleShare("twitter")} aria-label="X" className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:text-foreground text-[10px] font-bold">
            𝕏
          </button>
          <button onClick={() => handleShare("linkedin")} aria-label="LinkedIn" className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:text-blue-600">
            <Linkedin className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => handleShare("whatsapp")} aria-label="WhatsApp" className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:text-green-500">
            <MessageCircle className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => handleShare("copy")} aria-label="Copiar" className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:text-primary">
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Link2 className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* CTA — Solicitar diagnóstico gratis (abre Asistente IA en modo conversación) */}
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
          <p className="text-sm font-semibold text-foreground">¿Quieres implementar esto en tu negocio?</p>
          <p className="mt-1 text-xs text-muted-foreground">Cuéntanos sobre tu proyecto y te damos una asesoría personalizada.</p>
          <button
            type="button"
            onClick={() => openAiChat({ diagnostic: true })}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:brightness-110 active:scale-95"
          >
            Solicitar diagnóstico gratis
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-2 text-[11px] text-muted-foreground">
            💬 Habla con nuestro asistente IA — resuelve tus dudas y agenda cuando quieras
          </p>
        </div>

        {/* Back to blog */}
        <Link href="/blog" className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver al blog
        </Link>
      </div>

      {/* Related */}
      {relatedPosts.length > 0 && (
        <section className="mt-12 border-t border-border/40 py-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12">
            <h2 className="text-lg font-bold text-foreground mb-5">Artículos relacionados</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                      <div className="p-3">
                        <h3 className="text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{rp.title}</h3>
                        <p className="mt-1 text-[10px] text-muted-foreground">{rp.readingTime} min · {new Date(rp.date).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}</p>
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
