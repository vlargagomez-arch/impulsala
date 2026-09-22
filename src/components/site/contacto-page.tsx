"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Calendar, MapPin, Clock, MessageCircle, ArrowRight, Check, Sparkles, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function ContactoPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", service: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast({ title: "Faltan datos", description: "Por favor completa tu nombre y correo.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      toast({ title: "¡Solicitud recibida!", description: "Te contactaremos en menos de 2 horas hábiles." });
    }, 1200);
  }

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16 noise-overlay">
        <div className="absolute inset-0 bg-grid mask-fade-bottom opacity-30" />
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              Diagnóstico gratuito · Respuesta en 2 horas
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Hablemos de tu <span className="text-gradient-animated">próximo proyecto</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }} className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Agenda una sesión de 30 minutos con nuestro equipo. Te entregamos un análisis inicial y un plan de acción sin compromiso.
          </motion.p>
        </div>
      </section>

      {/* Contact methods */}
      <section className="relative py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: MessageCircle, title: "WhatsApp", value: "319 635 4992", href: "https://wa.me/573196354992?text=¡Hola! Quiero más información", color: "text-green-500", note: "Respuesta inmediata" },
              { icon: Mail, title: "Email", value: "hola@impulsala.com", href: "mailto:hola@impulsala.com", color: "text-primary", note: "Respuesta en 2 horas" },
              { icon: Phone, title: "Teléfono", value: "319 635 4992", href: "tel:3196354992", color: "text-accent", note: "Lun-Vie 8am-6pm" },
            ].map((m, i) => (
              <motion.a
                key={m.title}
                href={m.href}
                target={m.href.startsWith("http") ? "_blank" : undefined}
                rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col items-center rounded-2xl border border-border/60 bg-card/40 p-5 text-center backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/40 ${m.color}`}>
                  <m.icon className="h-6 w-6" />
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">{m.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.value}</p>
                <p className="mt-1 text-[10px] text-primary">{m.note}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="relative py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">¿Qué incluye el diagnóstico gratuito?</h2>
                <ul className="mt-4 space-y-3">
                  {[
                    { icon: Shield, title: "Análisis de tu presencia digital actual", desc: "Revisamos tu web, SEO, redes sociales y competencia" },
                    { icon: Zap, title: "Identificación de oportunidades de crecimiento", desc: "Encontramos dónde puedes ganar más con menos inversión" },
                    { icon: Users, title: "Propuesta inicial con métricas estimadas", desc: "Proyección de resultados realista basada en tu sector" },
                    { icon: Calendar, title: "Plan de acción a 6 meses a medida", desc: "Roadmap claro con prioridades, timeline y presupuesto" },
                  ].map((item, i) => (
                    <motion.li
                      key={item.title}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <item.icon className="h-4.5 w-4.5 text-primary" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Guarantee */}
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
                <div className="flex items-center gap-2 text-primary">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-bold">Nuestra garantía</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Si no generamos resultados medibles, no nos pagas. Sin contratos de permanencia, sin letra pequeña. Tu confianza es nuestra prioridad.
                </p>
              </div>

              {/* Office info */}
              <div className="rounded-2xl border border-border/60 bg-card/40 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Información de oficina</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" /> Bogotá, Colombia · Remoto en toda LATAM</p>
                  <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-primary" /> Lunes a Viernes · 8:00am - 6:00pm (COT)</p>
                  <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-primary" /> hola@impulsala.com</p>
                  <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-primary" /> 319 635 4992</p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm">
              {done ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-8 w-8 text-primary" />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">¡Solicitud enviada!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Recibimos tu solicitud de diagnóstico. Nuestro equipo te contactará en menos de 2 horas hábiles para agendar tu sesión.
                  </p>
                  <Button variant="outline" className="mt-6" onClick={() => { setDone(false); setForm({ name: "", email: "", company: "", phone: "", service: "", message: "" }); }}>
                    Enviar otra solicitud
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Solicita tu diagnóstico</h3>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Nombre *</label>
                    <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Tu nombre completo" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Correo electrónico *</label>
                    <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="tu@empresa.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Empresa</label>
                      <Input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="Tu empresa" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Teléfono</label>
                      <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="319 635 4992" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">¿Qué servicio te interesa?</label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                      className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Selecciona un servicio</option>
                      <option value="software">Desarrollo de Software</option>
                      <option value="seo">Mejoramiento Web + SEO</option>
                      <option value="ads">Campañas Publicitarias</option>
                      <option value="automation">Automatizaciones + IA</option>
                      <option value="full">Solución integral (varios servicios)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Cuéntanos sobre tu proyecto</label>
                    <Textarea rows={3} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="¿Cuál es tu objetivo principal?" className="resize-none" />
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {submitting ? "Enviando..." : (
                      <>
                        Solicitar diagnóstico gratis
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <p className="text-center text-[11px] text-muted-foreground">
                    Sin compromiso · Respuesta en menos de 2 horas · 100% confidencial
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-foreground">Preguntas frecuentes</h2>
          <div className="mt-8 space-y-3">
            {[
              { q: "¿El diagnóstico es realmente gratuito?", a: "Sí, 100% gratuito y sin compromiso. Te damos un análisis completo y un plan de acción. Si decides trabajar con nosotros, great. Si no, te quedas con el análisis." },
              { q: "¿Cuánto tarda la sesión de diagnóstico?", a: "La sesión dura 30 minutos por videollamada (Google Meet o Zoom). Antes de la sesión te pediremos algunos datos para prepararla." },
              { q: "¿Trabajan con empresas de cualquier tamaño?", a: "Trabajamos principalmente con PYMES y startups que facturan entre $50M y $5,000M COP al año. También tenemos paquetes para empresas más grandes." },
              { q: "¿Ofrecen garantía de resultados?", a: "Sí. Si después de 90 días no generamos resultados medibles, seguimos trabajando sin costo hasta lograrlos. Sin contratos de permanencia." },
              { q: "¿En qué países trabajan?", a: "Tenemos base en Bogotá, Colombia, pero trabajamos remotamente con clientes en toda LATAM: México, Argentina, Perú, Chile, Ecuador y más." },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-border/60 bg-card/40 p-4">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-foreground">
                  {faq.q}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
