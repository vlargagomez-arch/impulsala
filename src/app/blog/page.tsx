import { Navbar } from "@/components/site/navbar";
import { ScrollProgress } from "@/components/site/top-progress-bar";
import { StickyCTA } from "@/components/site/sticky-cta";
import WhatsAppButton from "@/components/site/ai-chat-fab";
import { Footer } from "@/components/site/footer";
import { BlogSection } from "@/components/site/blog-section";
import { BLOG_POSTS, type BlogPost } from "@/components/site/blog-data";
import { db } from "@/lib/db";

export const metadata = {
  title: "Blog — Impulsala | Marketing digital, IA, SEO y tecnología",
  description: "Análisis, tendencias y casos de estudio sobre IA, SEO, Ads, automatización y las tecnologías que están redefiniendo el marketing digital.",
};

async function getCrmPosts(): Promise<BlogPost[]> {
  try {
    const articles = await db.blogArticle.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });

    return articles.map((a: any) => {
      let content = a.content;
      if (typeof content === "string") {
        if (content.trim().startsWith("[") || content.trim().startsWith("{")) {
          try { content = JSON.parse(content); } catch { content = [{ type: "p", content }]; }
        } else {
          const paragraphs = content.split(/\n\n+/).filter((p: string) => p.trim());
          content = paragraphs.length > 0
            ? paragraphs.map((p: string) => ({ type: "p", content: p.trim() }))
            : [{ type: "p", content }];
        }
      }

      return {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        body: content as any,
        content: content as any,
        category: (a.category as any) || "Marketing Digital",
        tags: a.tags ? a.tags.split(",").map((t: string) => t.trim()) : [],
        author: a.author || "Equipo Impulsala",
        date: new Date(a.createdAt).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" }),
        readTime: "5 min",
        readingTime: 5,
        image: a.imageUrl || `/blog/crm/${a.slug}.webp`,
        featured: a.featured,
      } as unknown as BlogPost;
    });
  } catch (error) {
    console.error("Error cargando artículos del CRM:", error);
    return [];
  }
}

export default async function BlogPage() {
  const crmPosts = await getCrmPosts();

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <ScrollProgress />
      <Navbar />

      <main className="flex-1">
        <BlogSection crmPosts={crmPosts} />
      </main>

      <Footer />
      <StickyCTA />
      <WhatsAppButton />
    </div>
  );
}
