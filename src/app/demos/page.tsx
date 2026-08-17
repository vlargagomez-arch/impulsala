import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { ScrollProgress } from "@/components/site/top-progress-bar";
import { StickyCTA } from "@/components/site/sticky-cta";
import WhatsAppButton from "@/components/site/ai-chat-fab";
import { Footer } from "@/components/site/footer";

const Demos = dynamic(() => import("@/components/site/demos").then((m) => m.default));

const SITE_URL = "https://w14nq5fjb3z1-d.space-z.ai";

export const metadata: Metadata = {
  title: "Demos Interactivas | Impulsala",
  description:
    "Prueba nuestros servicios en vivo: analizador SEO, chatbot con IA, dashboard de ventas. Demos gratuitas.",
  alternates: {
    canonical: `${SITE_URL}/demos`,
  },
  openGraph: {
    title: "Demos Interactivas | Impulsala",
    description:
      "Prueba nuestros servicios en vivo: analizador SEO, chatbot con IA, dashboard de ventas.",
    url: `${SITE_URL}/demos`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Demos Interactivas | Impulsala",
    description:
      "Prueba nuestros servicios en vivo: analizador SEO, chatbot con IA, dashboard de ventas.",
  },
};

export default function DemosPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <ScrollProgress />
      <Navbar />

      <main className="flex-1">
        <div className="h-20" />
        <Demos />
      </main>

      <Footer />
      <StickyCTA />
      <WhatsAppButton />
    </div>
  );
}
