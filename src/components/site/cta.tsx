"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Mail, Phone, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function CTA() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast({
        title: "Faltan datos",
        description: "Por favor completa tu nombre y correo para continuar.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      toast({
        title: "¡Solicitud recibida!",
        description: "Te contactaremos en menos de 2 horas hábiles.",
      });
    }, 1200);
  }

  return (
    <section id="diagnostico" className="relative py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-[100px]" />

          <div className="relative grid grid-cols-1 gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-mono">
                  06 / 06
                </span>
                <Sparkles className="h-3 w-3" />
                Diagnóstico gratuito
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Empecemos a hacer crecer
                <br />
                <span className="text-gradient-animated">tu negocio hoy</span>
              </h2>
              <p className="mt-4 max-w-md text-base text-muted-foreground">
                Agenda una sesión de 30 minutos con nuestro equipo. Te entregamos un análisis
                inicial y un plan de acción sin compromiso.
              </p>

              <ul className="mt-6 space-y-2.5">
                {[
                  "Análisis de tu presencia digital actual",
                  "Identificación de oportunidades de crecimiento",
                  "Propuesta inicial con métricas estimadas",
                  "Plan de acción a 6 meses a medida",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/90">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground">
                <a href="mailto:hola@impulsala.com" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  hola@impulsala.com
                </a>
                <a href="tel:3196354992" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  319 635 4992
                </a>
                <div className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Lunes a viernes · 8am a 6pm (COT)
                </div>
              </div>
            </motion.div>

            {/* Right form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-border/60 bg-background/60 p-6 sm:p-8"
            >
              {done ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-8 w-8 text-primary" />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">¡Solicitud enviada!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Recibimos tu solicitud de diagnóstico. Nuestro equipo te contactará en menos de 2
                    horas hábiles para agendar tu sesión.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setDone(false);
                      setForm({ name: "", email: "", company: "", message: "" });
                    }}
                  >
                    Enviar otra solicitud
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Solicita tu diagnóstico</h3>
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Nombre *
                    </label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Tu nombre completo"
                      className="bg-background/60"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Correo electrónico *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="tu@empresa.com"
                      className="bg-background/60"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Empresa
                    </label>
                    <Input
                      id="company"
                      value={form.company}
                      onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                      placeholder="Nombre de tu empresa"
                      className="bg-background/60"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      ¿En qué podemos ayudarte?
                    </label>
                    <Textarea
                      id="message"
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Cuéntanos brevemente tu objetivo..."
                      className="bg-background/60 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {submitting ? (
                      "Enviando..."
                    ) : (
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
