import dynamic from "next/dynamic";
import { Navbar } from "@/components/site/navbar";
import { ScrollProgress } from "@/components/site/top-progress-bar";
import { StickyCTA } from "@/components/site/sticky-cta";
import WhatsAppButton from "@/components/site/ai-chat-fab";
import { Footer } from "@/components/site/footer";

const ContactoPage = dynamic(() => import("@/components/site/contacto-page").then((m) => m.ContactoPage));

export const metadata = {
  title: "Contacto — Impulsala | Agenda tu diagnóstico gratuito",
  description: "Agenda una sesión de 30 minutos con nuestro equipo. Diagnóstico gratuito, respuesta en menos de 2 horas, sin compromiso.",
};

export default function Contacto() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <ScrollProgress />
      <Navbar />

      <main className="flex-1">
        <ContactoPage />
      </main>

      <Footer />
      <StickyCTA />
      <WhatsAppButton />
    </div>
  );
}
