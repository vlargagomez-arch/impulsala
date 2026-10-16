import dynamic from "next/dynamic";
import { Navbar } from "@/components/site/navbar";
import { ScrollProgress } from "@/components/site/top-progress-bar";
import { StickyCTA } from "@/components/site/sticky-cta";
import WhatsAppButton from "@/components/site/ai-chat-fab";
import { Footer } from "@/components/site/footer";

const BlogSection = dynamic(() => import("@/components/site/blog-section").then((m) => m.BlogSection));

export const metadata = {
  title: "Blog — Impulsala | Marketing digital, IA, SEO y tecnología",
  description: "Análisis, tendencias y casos de estudio sobre IA, SEO, Ads, automatización y las tecnologías que están redefiniendo el marketing digital.",
};

export default function BlogPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <ScrollProgress />
      <Navbar />

      <main className="flex-1">
        <BlogSection />
      </main>

      <Footer />
      <StickyCTA />
      <WhatsAppButton />
    </div>
  );
}
