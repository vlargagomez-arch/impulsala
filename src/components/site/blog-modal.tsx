"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, ArrowRight, User, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import type { BlogPost } from "@/components/site/blog-data";
import { BLOG_POSTS } from "@/components/site/blog-data";
import { BlogCoverArt } from "@/components/site/blog-cover-art";

type BlogModalProps = {
  post: BlogPost | null;
  onClose: () => void;
  onNavigate: (post: BlogPost) => void;
};

export function BlogModal({ post, onClose, onNavigate }: BlogModalProps) {
  const [shareCopied, setShareCopied] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (post) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [post]);

  // ESC to close, arrow keys to navigate
  useEffect(() => {
    if (!post) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const idx = BLOG_POSTS.findIndex((p) => p.slug === post!.slug);
        if (idx === -1) return;
        const direction = e.key === "ArrowRight" ? 1 : -1;
        const nextIdx = (idx + direction + BLOG_POSTS.length) % BLOG_POSTS.length;
        onNavigate(BLOG_POSTS[nextIdx]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [post, onClose, onNavigate]);

  function navigate(direction: 1 | -1) {
    if (!post) return;
    const idx = BLOG_POSTS.findIndex((p) => p.slug === post.slug);
    if (idx === -1) return;
    const nextIdx = (idx + direction + BLOG_POSTS.length) % BLOG_POSTS.length;
    onNavigate(BLOG_POSTS[nextIdx]);
  }

  function handleShare() {
    if (!post) return;
    const url = `${window.location.origin}/#blog-${post.slug}`;
    navigator.clipboard?.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  }

  return (
    <AnimatePresence>
      {post && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-background/80 p-3 backdrop-blur-md sm:p-6 md:p-10"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-4 w-full max-w-3xl overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl"
          >
            {/* Cover — real image or gradient fallback */}
            <div className="relative h-40 overflow-hidden sm:h-56">
              {post.image ? (
                <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <>
                  <div className={`absolute inset-0 bg-gradient-to-br ${post.cover.from} ${post.cover.to}`} />
                  <div className="absolute inset-0 opacity-80">
                    <BlogCoverArt category={post.category} />
                  </div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

              {/* Top bar */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
                  {post.category}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    aria-label="Compartir"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/60 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onClose}
                    aria-label="Cerrar"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/60 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {shareCopied && (
                <div className="absolute right-4 top-16 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg">
                  ¡Enlace copiado!
                </div>
              )}
            </div>

            {/* Article body */}
            <article className="scrollbar-thin max-h-[calc(90vh-12rem)] overflow-y-auto px-5 pb-8 pt-4 sm:px-8 sm:pt-6">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  {post.author.name}
                </span>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {post.readingTime} min de lectura
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {post.excerpt}
              </p>

              <div className="mt-6 h-px bg-gradient-to-r from-border via-border/40 to-transparent" />

              {/* Body blocks */}
              <div className="mt-6 space-y-4">
                {post.body.map((block, i) => {
                  if (block.type === "p") {
                    return (
                      <p key={i} className="text-[15px] leading-relaxed text-foreground/90">
                        {block.content}
                      </p>
                    );
                  }
                  if (block.type === "h2") {
                    return (
                      <h2 key={i} className="pt-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        {block.content}
                      </h2>
                    );
                  }
                  if (block.type === "h3") {
                    return (
                      <h3 key={i} className="pt-2 text-lg font-semibold text-foreground">
                        {block.content}
                      </h3>
                    );
                  }
                  if (block.type === "ul" && block.items) {
                    return (
                      <ul key={i} className="space-y-2">
                        {block.items.map((item, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2.5 text-[15px] leading-relaxed text-foreground/90"
                          >
                            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (block.type === "quote") {
                    return (
                      <blockquote
                        key={i}
                        className="border-l-4 border-primary/50 bg-primary/5 px-5 py-4 text-base italic leading-relaxed text-foreground"
                      >
                        “{block.content}”
                      </blockquote>
                    );
                  }
                  if (block.type === "stat" && block.value && block.label) {
                    return (
                      <div
                        key={i}
                        className="my-6 flex flex-col items-center justify-center gap-1 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6 text-center"
                      >
                        <div className="text-4xl font-bold text-gradient-primary sm:text-5xl">
                          {block.value}
                        </div>
                        <div className="mt-1 max-w-sm text-sm text-muted-foreground">
                          {block.label}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Footer CTA */}
              <div className="mt-10 rounded-2xl border border-border/60 bg-background/40 p-5">
                <p className="text-sm font-semibold text-foreground">
                  ¿Quieres implementar esto en tu negocio?
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Agenda un diagnóstico gratuito de 30 minutos y te decimos cómo aplicarlo a tu caso.
                </p>
                <a
                  href="#diagnostico"
                  onClick={onClose}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  Solicitar diagnóstico gratis
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Anterior
                </button>
                <span className="text-[11px] text-muted-foreground">
                  {BLOG_POSTS.findIndex((p) => p.slug === post.slug) + 1} / {BLOG_POSTS.length}
                </span>
                <button
                  onClick={() => navigate(1)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Siguiente
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
