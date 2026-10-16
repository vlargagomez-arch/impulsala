"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Mail, MessageSquare, Bell, CheckCircle2, Clock,
  Send, ArrowRight, Play, Pause, RotateCcw,
  Database, Bot, FileText, ShoppingCart, CreditCard,
  Star, UserPlus, CalendarDays, Globe, Instagram,
  Youtube, BarChart3, Users, Filter, Copy,
  TrendingUp, Sparkles, ChevronRight, ChevronDown,
  Receipt, Truck, Package, Hash, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/* ===== Types ===== */
interface FlowNode {
  id: string;
  icon: LucideIcon;
  label: string;
  sublabel: string;
  color: string;
  bg: string;
  border: string;
  outputType: "email" | "whatsapp" | "invoice" | "crm" | "notification" | "social" | "analytics" | "calendar" | "trigger";
  output: () => React.ReactNode;
}

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  tag: string;
  tagColor: string;
  icon: LucideIcon;
  impact: string;
  metrics: { label: string; value: string; detail: string }[];
  nodes: FlowNode[];
  /* Final result summary after all steps complete */
  finalResult: {
    title: string;
    description: string;
    outcomes: { icon: LucideIcon; label: string; value: string; color: string }[];
    totalTime: string;
  };
}

/* ===== Automation Templates ===== */
const automations: AutomationTemplate[] = [
  {
    id: "ecommerce",
    name: "E-Commerce: Venta Automatizada",
    description: "Un cliente compra y el sistema procesa todo solo: confirmación, factura, inventario, envío y fidelización.",
    tag: "E-Commerce",
    tagColor: "text-neon-purple",
    icon: ShoppingCart,
    impact: "Reduce el proceso post-venta de 45 min a 8 segundos",
    metrics: [
      { label: "Pedidos/mes", value: "2,847", detail: "100% automático" },
      { label: "Error manual", value: "0%", detail: "Antes: 12%" },
      { label: "Retención", value: "+34%", detail: "Email follow-up" },
      { label: "Tiempo ahorrado", value: "214h/mes", detail: "Enfoque en estrategia" },
    ],
    finalResult: {
      title: "Pedido #4521 — Completado 100% Automáticamente",
      description: "Todo el proceso post-venta se ejecutó sin intervención humana en 8 segundos. Desde que el cliente pagó hasta que el equipo de logística recibió la orden de despacho.",
      totalTime: "8 segundos",
      outcomes: [
        { icon: Receipt, label: "Factura electrónica", value: "#INV-2026-4521 generada", color: "text-neon-purple" },
        { icon: Mail, label: "Email al cliente", value: "Entregado y abierto en 2 min", color: "text-blue-500" },
        { icon: MessageSquare, label: "WhatsApp logística", value: "Visto por equipo en 23 seg", color: "text-green-500" },
        { icon: Package, label: "Inventario actualizado", value: "141/200 unidades", color: "text-neon-cyan" },
        { icon: Star, label: "Puntos fidelidad", value: "+450 pts (Cupón desbloqueado)", color: "text-yellow-500" },
        { icon: BarChart3, label: "Dashboard", value: "Venta registrada en tiempo real", color: "text-indigo-500" },
      ],
    },
    nodes: [
      {
        id: "trigger", icon: ShoppingCart, label: "Nuevo Pedido", sublabel: "Webhook — tienda online",
        color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200",
        outputType: "trigger",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-amber-500">Evento recibido via webhook</p>
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 font-mono text-[10px] space-y-0.5">
              <p className="text-muted-foreground">{"{"}</p>
              <p className="text-muted-foreground">  "order_id": <span className="text-neon-green">4521</span>,</p>
              <p className="text-muted-foreground">  "customer": <span className="text-foreground">"María López"</span>,</p>
              <p className="text-muted-foreground">  "email": <span className="text-foreground">"maria@email.com"</span>,</p>
              <p className="text-muted-foreground">  "total": <span className="text-neon-green">89,900 COP</span>,</p>
              <p className="text-muted-foreground">  "status": <span className="text-amber-600">"payment_pending"</span></p>
              <p className="text-muted-foreground">{"}"}</p>
            </div>
          </div>
        ),
      },
      {
        id: "payment", icon: CreditCard, label: "Pago Verificado", sublabel: "Stripe — confirmación",
        color: "text-neon-green", bg: "bg-neon-green/5", border: "border-neon-green/20",
        outputType: "notification",
        output: () => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-neon-green/10 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-neon-green" /></div>
              <p className="text-[10px] font-bold text-neon-green">Pago aprobado por Stripe</p>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-neon-green/20 space-y-1">
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">ID Transacción</span><span className="font-mono font-bold">ch_3NzK8f...xY2</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Método</span><span>Visa •••• 4242</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Monto</span><span className="font-bold text-neon-green">$89,900 COP</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Estado</span><span className="text-neon-green font-bold">succeeded</span></div>
            </div>
          </div>
        ),
      },
      {
        id: "inventory", icon: Package, label: "Inventario Actualizado", sublabel: "Stock sincronizado",
        color: "text-neon-cyan", bg: "bg-neon-cyan/5", border: "border-neon-cyan/20",
        outputType: "notification",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-neon-cyan">Base de datos actualizada</p>
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span>Camiseta Premium — Talla L</span>
                <div className="flex items-center gap-1">
                  <span className="text-red-400 line-through">142</span>
                  <ArrowRight className="w-3 h-3 text-neon-cyan" />
                  <span className="font-bold text-neon-cyan">141</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-blue-400" style={{ width: "70%" }} />
              </div>
              <p className="text-[9px] text-muted-foreground">Stock: 141/200 (70%) — Alerta de reposición: NO</p>
            </div>
          </div>
        ),
      },
      {
        id: "invoice", icon: Receipt, label: "Factura Generada", sublabel: "PDF automático — DIAN",
        color: "text-neon-purple", bg: "bg-neon-purple/5", border: "border-neon-purple/20",
        outputType: "invoice",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-neon-purple">Factura electrónica generada</p>
            <div className="bg-white rounded-lg border border-neon-purple/20 overflow-hidden">
              <div className="bg-neon-purple/5 px-3 py-2 flex items-center justify-between border-b border-neon-purple/10">
                <span className="text-[10px] font-bold">FACTURA DE VENTA</span>
                <span className="text-[9px] text-muted-foreground">#INV-2026-4521</span>
              </div>
              <div className="p-2.5 space-y-1 text-[10px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Cliente</span><span>María López</span></div>
                <div className="flex justify-between"><span>Camiseta Premium x1</span><span>$89,900</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">IVA (19%)</span><span>$17,081</span></div>
                <div className="flex justify-between font-bold text-sm border-t border-slate-100 pt-1"><span>Total</span><span className="text-neon-purple">$106,981</span></div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "email", icon: Mail, label: "Email Confirmación", sublabel: "Enviado al cliente",
        color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200",
        outputType: "email",
        output: () => (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <div>
                <p className="text-[10px] font-bold">Para: maria@email.com</p>
                <p className="text-[9px] text-muted-foreground">Asunto: Tu pedido #4521 está confirmado</p>
              </div>
            </div>
            <div className="p-2.5 text-[10px] text-muted-foreground leading-relaxed space-y-1">
              <p className="text-foreground font-bold">Hola María,</p>
              <p>Tu pedido ha sido confirmado y procesado exitosamente.</p>
              <div className="bg-slate-50 rounded p-2 border border-slate-100 space-y-0.5">
                <p className="text-[9px] text-muted-foreground">RESUMEN DEL PEDIDO</p>
                <div className="flex justify-between"><span>Camiseta Premium (L)</span><span className="font-bold">$89,900</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Envío</span><span>Gratis</span></div>
              </div>
              <p>Estimamos la entrega entre <span className="text-blue-500 font-bold">3-5 días hábiles</span>.</p>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[9px] text-muted-foreground">Estado</span>
              <span className="flex items-center gap-1 text-[9px] text-neon-green font-bold"><CheckCircle2 className="w-2.5 h-2.5" /> Entregado — Abierto en 2 min</span>
            </div>
          </div>
        ),
      },
      {
        id: "whatsapp", icon: MessageSquare, label: "WhatsApp Logística", sublabel: "Despacho al equipo",
        color: "text-green-500", bg: "bg-green-50", border: "border-green-200",
        outputType: "whatsapp",
        output: () => (
          <div className="bg-[#075e54]/5 rounded-xl p-3 border border-[#075e54]/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-[#25d366] flex items-center justify-center"><MessageSquare className="w-3 h-3 text-white" /></div>
              <div>
                <p className="text-[10px] font-bold text-[#075e54]">Grupo: Logística Impulsala</p>
                <p className="text-[8px] text-[#075e54]/60">Ahora — 3 participantes</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-slate-100 space-y-1">
              <p className="text-[10px] font-bold text-green-600 flex items-center gap-1"><Truck className="w-3 h-3" /> ORDEN LISTA PARA DESPACHO</p>
              <div className="text-[10px] font-mono space-y-0.5 leading-relaxed text-foreground">
                <p><span className="text-muted-foreground">Orden:</span> #4521</p>
                <p><span className="text-muted-foreground">Cliente:</span> María López</p>
                <p><span className="text-muted-foreground">Dirección:</span> Cra 15 #82-34, Bogotá</p>
                <p><span className="text-muted-foreground">Envío:</span> Servientrega — Premio</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#25d366]/10 text-[#075e54] font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> Visto por 2 — En 23 segundos
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "loyalty", icon: Star, label: "Puntos Fidelidad", sublabel: "Programa automático",
        color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200",
        outputType: "notification",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-yellow-600">Programa de Fidelidad — Puntos asignados</p>
            <div className="bg-white rounded-lg p-2.5 border border-yellow-200 space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Puntos ganados</span><span className="font-bold text-yellow-600">+450 pts</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Total acumulado</span><span className="font-bold">2,340 pts</span>
              </div>
              <div className="border-t border-yellow-100 pt-1.5">
                <div className="bg-yellow-50 rounded p-1.5 flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-[10px] font-bold">Cupón BIENVENIDA15 — 15% próxima compra</span>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "leads",
    name: "Marketing: Lead a Reunión Automático",
    description: "Un lead descarga un recurso y el sistema lo nutre con IA hasta agendar una reunión de ventas automáticamente.",
    tag: "Marketing",
    tagColor: "text-neon-cyan",
    icon: Users,
    impact: "De lead a reunión en 2.3 días (antes: 12 días manualmente)",
    metrics: [
      { label: "Leads/mes", value: "1,240", detail: "Captados automáticamente" },
      { label: "Conversión", value: "23.4%", detail: "Lead a reunión" },
      { label: "Ciclo venta", value: "-81%", detail: "De 12 a 2.3 días" },
      { label: "Revenue", value: "$28M/mes", detail: "Cerrado por automatización" },
    ],
    finalResult: {
      title: "Carlos Rodríguez — De Lead a Reunión Agendada en 2.3 Días",
      description: "El sistema captó el lead, lo calificó con IA, lo registró en el CRM, envió 2 emails de nurturing, un WhatsApp personal del vendedor, y agendó la reunión automáticamente. Sin intervención humana.",
      totalTime: "2.3 días (automático)",
      outcomes: [
        { icon: Globe, label: "Lead capturado", value: "Landing — Guía SEO descargada", color: "text-amber-500" },
        { icon: Bot, label: "IA calificación", value: "Score 89/100 — HOT", color: "text-neon-green" },
        { icon: Database, label: "CRM sincronizado", value: "HubSpot — Pipeline Cierre Q3", color: "text-neon-cyan" },
        { icon: Mail, label: "Emails nurturing", value: "2 enviados — 67% clic CTA", color: "text-blue-500" },
        { icon: MessageSquare, label: "WhatsApp vendedor", value: "Andrea contactó — Respondió en 2h", color: "text-green-500" },
        { icon: CalendarDays, label: "Reunión agendada", value: "Mar 3 Jul, 10:00 AM — Confirmada", color: "text-neon-purple" },
      ],
    },
    nodes: [
      {
        id: "form", icon: Globe, label: "Lead Capturado", sublabel: "Landing — formulario",
        color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200",
        outputType: "trigger",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-amber-500">Nuevo lead desde landing page</p>
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 font-mono text-[10px] space-y-0.5">
              <p className="text-muted-foreground">{"{"}</p>
              <p className="text-muted-foreground">  "name": <span className="text-foreground">"Carlos Rodríguez"</span>,</p>
              <p className="text-muted-foreground">  "email": <span className="text-foreground">"carlos@techco.co"</span>,</p>
              <p className="text-muted-foreground">  "company": <span className="text-foreground">"TechCo S.A.S"</span>,</p>
              <p className="text-muted-foreground">  "downloaded": <span className="text-neon-cyan">"Guía SEO 2026"</span>,</p>
              <p className="text-muted-foreground">  "source": <span className="text-amber-600">"Google Ads — Campaña Brand"</span></p>
              <p className="text-muted-foreground">{"}"}</p>
            </div>
          </div>
        ),
      },
      {
        id: "ai", icon: Bot, label: "IA Califica Lead", sublabel: "ImpulsaBot — scoring",
        color: "text-neon-green", bg: "bg-neon-green/5", border: "border-neon-green/20",
        outputType: "analytics",
        output: () => (
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-neon-green/5 border border-neon-green/15 rounded-lg p-2">
              <Bot className="w-4 h-4 text-neon-green" />
              <span className="text-[10px] font-bold text-neon-green">ImpulsaBot — Análisis de Lead</span>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Intención de compra</span>
                <div className="flex items-center gap-1"><div className="w-16 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-neon-green" style={{ width: "94%" }} /></div><span className="text-neon-green font-bold">94%</span></div>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Fit con servicios</span>
                <div className="flex items-center gap-1"><div className="w-16 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-neon-cyan" style={{ width: "91%" }} /></div><span className="text-neon-cyan font-bold">91%</span></div>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Presupuesto estimado</span>
                <div className="flex items-center gap-1"><div className="w-16 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-400" style={{ width: "78%" }} /></div><span className="text-amber-500 font-bold">Alto</span></div>
              </div>
              <div className="border-t border-slate-100 pt-1.5 flex items-center gap-2">
                <span className="text-[10px] font-bold">Score global:</span>
                <span className="text-sm font-extrabold text-neon-green">89/100</span>
                <span className="text-[8px] px-2 py-0.5 rounded-full bg-red-400/10 text-red-400 font-bold">HOT</span>
                <span className="text-[8px] px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple font-bold">Asignar: Andrea</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "crm", icon: Database, label: "Registro en CRM", sublabel: "HubSpot — pipeline",
        color: "text-neon-cyan", bg: "bg-neon-cyan/5", border: "border-neon-cyan/20",
        outputType: "crm",
        output: () => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center"><span className="text-[8px] text-white font-bold">H</span></div>
              <span className="text-[10px] font-bold">HubSpot CRM</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-neon-green/10 text-neon-green font-bold ml-auto">Sincronizado</span>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-1">
              <div className="text-[10px]"><span className="text-muted-foreground">Contacto:</span> <span className="font-bold">Carlos Rodríguez</span></div>
              <div className="text-[10px]"><span className="text-muted-foreground">Empresa:</span> TechCo S.A.S</div>
              <div className="text-[10px]"><span className="text-muted-foreground">Pipeline:</span> <span className="text-neon-cyan font-bold">Cierre Q3 2026</span></div>
              <div className="flex gap-1.5 pt-1 border-t border-slate-100">
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-400/10 text-red-400 font-bold">HOT</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-neon-purple/10 text-neon-purple font-bold">SEO</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "seq1", icon: Mail, label: "Email #1: Bienvenida", sublabel: "Recurso + onboarding",
        color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200",
        outputType: "email",
        output: () => (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <div>
                <p className="text-[10px] font-bold">Para: carlos@techco.co</p>
                <p className="text-[9px] text-muted-foreground">Asunto: Tu Guía SEO 2026 + próximo paso</p>
              </div>
            </div>
            <div className="p-2.5 text-[10px] text-muted-foreground leading-relaxed space-y-1">
              <p className="text-foreground font-bold">Hola Carlos,</p>
              <p>Gracias por descargar nuestra <span className="text-neon-cyan font-medium">Guía SEO 2026</span>.</p>
              <p className="text-blue-500 font-bold">Lo próximo: Caso de éxito en 3 días</p>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 border-t border-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[9px] text-neon-green"><CheckCircle2 className="w-2.5 h-2.5" /> Entregado — Abierto 4 min después</span>
              <span className="flex items-center gap-1 text-[9px] text-amber-400"><Star className="w-2.5 h-2.5" /> Clic en CTA: 67%</span>
            </div>
          </div>
        ),
      },
      {
        id: "seq2", icon: Mail, label: "Email #2: Caso Éxito", sublabel: "Día 3 — prueba social",
        color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200",
        outputType: "email",
        output: () => (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <div>
                <p className="text-[10px] font-bold">Para: carlos@techco.co</p>
                <p className="text-[9px] text-muted-foreground">Asunto: Clínica San Juan +180% tráfico en 4 meses</p>
              </div>
            </div>
            <div className="p-2.5 text-[10px] text-muted-foreground leading-relaxed space-y-1">
              <p className="text-foreground font-bold">Carlos, un caso que te interesa:</p>
              <div className="bg-neon-green/5 rounded p-2 border border-neon-green/10">
                <p className="text-[10px] font-bold text-neon-green">Clínica San Juan</p>
                <p className="text-[9px]">Tráfico: 2K → 5.6K/mes (+180%)</p>
                <p className="text-[9px]">Revenue SEO: $18M en 4 meses</p>
              </div>
              <p className="text-blue-500 font-bold">Agendar llamada gratis de 30 min</p>
            </div>
          </div>
        ),
      },
      {
        id: "wa", icon: MessageSquare, label: "WhatsApp Vendedor", sublabel: "Andrea — mensaje personal",
        color: "text-green-500", bg: "bg-green-50", border: "border-green-200",
        outputType: "whatsapp",
        output: () => (
          <div className="bg-[#075e54]/5 rounded-xl p-3 border border-[#075e54]/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-[#25d366] flex items-center justify-center"><MessageSquare className="w-3 h-3 text-white" /></div>
              <div>
                <p className="text-[10px] font-bold text-[#075e54]">Andrea (Vendedora) → Carlos</p>
                <p className="text-[8px] text-[#075e54]/60">WhatsApp Personal</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-slate-100 text-[10px] text-foreground leading-relaxed space-y-1">
              <p>Hola Carlos! Soy Andrea de Impulsala</p>
              <p>Vi que descargaste nuestra Guía SEO — me encantaría saber si tienes dudas.</p>
              <p className="font-mono text-[9px] bg-neon-cyan/5 rounded p-1 text-neon-cyan">calendly.com/impulsala/carlos-techco</p>
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#25d366]/10 text-[#075e54] font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> Leído — Respondió en 2h
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "calendar", icon: CalendarDays, label: "Reunión Agendada", sublabel: "Calendly — confirmación",
        color: "text-neon-purple", bg: "bg-neon-purple/5", border: "border-neon-purple/20",
        outputType: "calendar",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-neon-purple">Reunión de diagnóstico agendada</p>
            <div className="bg-white rounded-lg border border-neon-purple/20 overflow-hidden">
              <div className="bg-neon-purple/5 px-3 py-2 flex items-center gap-2 border-b border-neon-purple/10">
                <CalendarDays className="w-4 h-4 text-neon-purple" />
                <span className="text-[10px] font-bold">Reunión Confirmada</span>
              </div>
              <div className="p-2.5 space-y-1.5 text-[10px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Fecha</span><span className="font-bold">Martes 3 Jul, 2026</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Hora</span><span className="font-bold">10:00 AM — 10:30 AM</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tipo</span><span className="text-neon-cyan font-bold">Llamada de diagnóstico (gratis)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Nota IA</span><span>Lead HOT (89/100)</span></div>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "social",
    name: "Social Media: Contenido Automatizado",
    description: "Crea un artículo y la IA lo convierte en posts para Instagram, Facebook y YouTube con los mejores horarios.",
    tag: "Social Media",
    tagColor: "text-pink-500",
    icon: Instagram,
    impact: "De 4h/semana de gestión social a 15 min de revisión",
    metrics: [
      { label: "Posts/mes", value: "186", detail: "3 redes automáticas" },
      { label: "Engagement", value: "+156%", detail: "IA optimiza horarios" },
      { label: "Gestión", value: "15 min/sem", detail: "Antes: 4 horas" },
      { label: "Seguidores", value: "+2,340/mes", detail: "Crecimiento orgánico" },
    ],
    finalResult: {
      title: "ArtículoPublicado → 3 Redes, 6 Posts, 1 Video — Todo Automático",
      description: "De un solo artículo de blog, la IA generó el copy para cada red, diseñó 3 formatos visuales, optimizó los horarios de publicación, y creó un video Short. Todo publicado y medido sin intervención humana.",
      totalTime: "15 minutos de revisión",
      outcomes: [
        { icon: FileText, label: "Artículo base", value: "Blog — 1,847 palabras publicado", color: "text-amber-500" },
        { icon: Bot, label: "IA Copy generado", value: "3 versiones + 15 hashtags", color: "text-neon-green" },
        { icon: Sparkles, label: "Diseños automáticos", value: "Feed, Story, YT Thumbnail", color: "text-neon-purple" },
        { icon: Instagram, label: "Instagram programado", value: "Lun 7 Jul, 6:00 PM — Max engagement", color: "text-pink-500" },
        { icon: Globe, label: "Facebook programado", value: "Lun 7 Jul, 12:00 PM — 4,823 seguidores", color: "text-blue-600" },
        { icon: Youtube, label: "YouTube Short", value: "Publicado — 58 seg vertical", color: "text-red-500" },
      ],
    },
    nodes: [
      {
        id: "content", icon: FileText, label: "Contenido Nuevo", sublabel: "Blog — artículo publicado",
        color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200",
        outputType: "trigger",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-amber-500">Artículo publicado en el blog</p>
            <div className="bg-white rounded-lg p-2.5 border border-slate-200">
              <p className="text-[11px] font-bold">5 Errores SEO que te están costando clientes en 2026</p>
              <p className="text-[9px] text-muted-foreground mt-1">Autor: Impulsala · 1,847 palabras · 8 min lectura</p>
              <p className="text-[9px] font-mono text-neon-cyan mt-1">blog.impulsala.com/5-errores-seo-2026</p>
            </div>
          </div>
        ),
      },
      {
        id: "ai", icon: Bot, label: "IA Genera Copy", sublabel: "GPT-4 — copy + hashtags",
        color: "text-neon-green", bg: "bg-neon-green/5", border: "border-neon-green/20",
        outputType: "analytics",
        output: () => (
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-neon-green/5 border border-neon-green/15 rounded-lg p-2">
              <Bot className="w-4 h-4 text-neon-green" />
              <span className="text-[10px] font-bold text-neon-green">IA — 3 versiones de copy generadas</span>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-2">
              <div className="bg-slate-50 rounded p-2 border border-slate-100">
                <p className="text-[9px] text-muted-foreground mb-0.5">COPY INSTAGRAM:</p>
                <p className="text-[10px] leading-relaxed">¿Tu web no aparece en Google? Estos 5 errores SEO podrían estar matando tu negocio online. Descubre cómo corregirlos antes de que tu competencia te adelante.</p>
              </div>
              <div className="bg-slate-50 rounded p-2 border border-slate-100">
                <p className="text-[9px] text-muted-foreground mb-0.5">HASHTAGS (15):</p>
                <p className="text-[10px] text-neon-cyan leading-relaxed">#SEO #MarketingDigital #ErroresSEO #Google #TraficoOrganico...</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "design", icon: Sparkles, label: "Diseño Automático", sublabel: "Canva API — 3 formatos",
        color: "text-neon-purple", bg: "bg-neon-purple/5", border: "border-neon-purple/20",
        outputType: "notification",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-neon-purple">3 diseños generados automáticamente</p>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="bg-white rounded-lg border border-slate-200 p-2 text-center">
                <div className="w-full aspect-square rounded bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center mb-1">
                  <Instagram className="w-5 h-5 text-pink-500" />
                </div>
                <p className="text-[8px] font-bold">Instagram Feed</p>
                <p className="text-[8px] text-muted-foreground">1080x1080</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-2 text-center">
                <div className="w-full aspect-[9/16] rounded bg-gradient-to-br from-neon-purple/20 to-neon-green/20 flex items-center justify-center mb-1">
                  <Instagram className="w-4 h-4 text-pink-500" />
                </div>
                <p className="text-[8px] font-bold">Story</p>
                <p className="text-[8px] text-muted-foreground">1080x1920</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-2 text-center">
                <div className="w-full aspect-video rounded bg-gradient-to-br from-red-400/20 to-red-600/20 flex items-center justify-center mb-1">
                  <Youtube className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-[8px] font-bold">YT Thumbnail</p>
                <p className="text-[8px] text-muted-foreground">1280x720</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "ig", icon: Instagram, label: "Instagram Programado", sublabel: "Feed — mejor horario",
        color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-200",
        outputType: "social",
        output: () => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-500" />
              <span className="text-[10px] font-bold">@impulsala.co</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-neon-green/10 text-neon-green font-bold ml-auto">Programado</span>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-2.5 space-y-1">
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Fecha</span><span className="font-bold">Lun 7 Jul, 6:00 PM</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Formato</span><span>Feed post + Story</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">IA Horario optimizado</span><span className="text-neon-green font-bold">6:00 PM COL</span></div>
            </div>
          </div>
        ),
      },
      {
        id: "fb", icon: Globe, label: "Facebook Programado", sublabel: "Página + Grupo",
        color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200",
        outputType: "social",
        output: () => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-bold">Impulsala — Página</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-neon-green/10 text-neon-green font-bold ml-auto">Programado</span>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-2.5 space-y-1">
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Fecha</span><span className="font-bold">Lun 7 Jul, 12:00 PM</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Audiencia</span><span>4,823 seguidores</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Boost IA</span><span className="text-amber-400 font-bold">$15 USD sugerido</span></div>
            </div>
          </div>
        ),
      },
      {
        id: "yt", icon: Youtube, label: "YouTube Short", sublabel: "Video vertical — 60 seg",
        color: "text-red-500", bg: "bg-red-50", border: "border-red-200",
        outputType: "social",
        output: () => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-500" />
              <span className="text-[10px] font-bold">@Impulsala</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-neon-green/10 text-neon-green font-bold ml-auto">Publicado</span>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-2.5 space-y-1">
              <p className="text-[10px] font-bold">5 Errores SEO en 60 Segundos</p>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Formato</span><span>Short (vertical 9:16)</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Duración</span><span>58 segundos</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Thumbnail</span><span className="text-neon-green font-bold">Auto-generado</span></div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "onboarding",
    name: "Onboarding: Cliente Nuevo Automático",
    description: "Cuando un cliente firma, el sistema lo integra automáticamente: bienvenida, documentos, equipo asignado, herramientas y kickoff.",
    tag: "Onboarding",
    tagColor: "text-indigo-500",
    icon: UserPlus,
    impact: "De 3 días de onboarding manual a 2 horas completamente automático",
    metrics: [
      { label: "Clientes/mes", value: "34", detail: "Onboard automático" },
      { label: "Tiempo onboarding", value: "2 horas", detail: "Antes: 3 días" },
      { label: "Satisfacción", value: "96%", detail: "Proceso profesional" },
      { label: "Tareas manuales", value: "0", detail: "Antes: 23 por cliente" },
    ],
    finalResult: {
      title: "TechCo S.A.S — Onboarding Completado en 2 Horas",
      description: "Desde que el cliente firmó el contrato, el sistema envió bienvenida, creó carpetas y canales de comunicación, recolectó datos via formulario, asignó el equipo completo, y agendó la reunión de kickoff. Sin que nadie tocara nada.",
      totalTime: "2 horas (automático)",
      outcomes: [
        { icon: Mail, label: "Email bienvenida", value: "Enviado + formulario de datos adjunto", color: "text-blue-500" },
        { icon: FileText, label: "Google Drive + Slack", value: "Carpeta cliente + #canal-proyecto creados", color: "text-neon-purple" },
        { icon: Users, label: "Equipo asignado", value: "PM: Laura, Dev: Santiago, Diseño: Camila", color: "text-neon-cyan" },
        { icon: CalendarDays, label: "Kickoff agendado", value: "Jue 4 Jul, 9:00 AM — Google Meet", color: "text-indigo-500" },
        { icon: Database, label: "Proyecto en Asana", value: "Board con 12 tareas iniciales creado", color: "text-amber-500" },
        { icon: Bell, label: "Alerta equipo", value: "Slack: 'Nuevo cliente listo para kickoff'", color: "text-neon-green" },
      ],
    },
    nodes: [
      {
        id: "contract", icon: FileText, label: "Contrato Firmado", sublabel: "PandaDoc — webhook",
        color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200",
        outputType: "trigger",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-amber-500">Contrato firmado por el cliente</p>
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 font-mono text-[10px] space-y-0.5">
              <p className="text-muted-foreground">{"{"}</p>
              <p className="text-muted-foreground">  "client": <span className="text-foreground">"TechCo S.A.S"</span>,</p>
              <p className="text-muted-foreground">  "contact": <span className="text-foreground">"Carlos Rodríguez"</span>,</p>
              <p className="text-muted-foreground">  "service": <span className="text-neon-cyan">"SEO + Google Ads"</span>,</p>
              <p className="text-muted-foreground">  "value": <span className="text-neon-green">"$8.5M/mes"</span>,</p>
              <p className="text-muted-foreground">  "status": <span className="text-neon-green">"signed"</span></p>
              <p className="text-muted-foreground">{"}"}</p>
            </div>
          </div>
        ),
      },
      {
        id: "welcome", icon: Mail, label: "Email Bienvenida", sublabel: "Enviar al cliente",
        color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200",
        outputType: "email",
        output: () => (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <div>
                <p className="text-[10px] font-bold">Para: carlos@techco.co</p>
                <p className="text-[9px] text-muted-foreground">Asunto: Bienvenido a Impulsala, Carlos</p>
              </div>
            </div>
            <div className="p-2.5 text-[10px] text-muted-foreground leading-relaxed space-y-1">
              <p className="text-foreground font-bold">Hola Carlos,</p>
              <p>Gracias por confiar en nosotros. Tu proyecto de <span className="text-neon-cyan font-medium">SEO + Google Ads</span> ya está en marcha.</p>
              <p className="text-blue-500 font-bold">Paso 1: Completa este formulario con los datos de tu negocio</p>
              <p className="font-mono text-[9px] bg-neon-cyan/5 rounded p-1 text-neon-cyan">forms.impulsala.com/onboarding-techco</p>
            </div>
          </div>
        ),
      },
      {
        id: "tools", icon: Database, label: "Herramientas Creadas", sublabel: "Drive + Slack + Asana",
        color: "text-neon-purple", bg: "bg-neon-purple/5", border: "border-neon-purple/20",
        outputType: "notification",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-neon-purple">3 herramientas configuradas automáticamente</p>
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5"><FileText className="w-3 h-3 text-blue-500" /> Google Drive</span>
                <span className="text-neon-green font-bold">Carpeta creada</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3 text-purple-500" /> Slack</span>
                <span className="text-neon-green font-bold">#proyecto-techco</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5"><Hash className="w-3 h-3 text-indigo-500" /> Asana</span>
                <span className="text-neon-green font-bold">Board con 12 tareas</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "team", icon: Users, label: "Equipo Asignado", sublabel: "PM + Dev + Diseño",
        color: "text-neon-cyan", bg: "bg-neon-cyan/5", border: "border-neon-cyan/20",
        outputType: "crm",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-neon-cyan">Equipo asignado al proyecto</p>
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-2">
              {[
                { name: "Laura Martínez", role: "Project Manager", color: "text-neon-cyan" },
                { name: "Santiago Pérez", role: "Desarrollador SEO/Ads", color: "text-neon-green" },
                { name: "Camila Ruiz", role: "Diseñadora UX/Contenido", color: "text-neon-purple" },
              ].map(m => (
                <div key={m.name} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center"><span className="text-[8px] font-bold">{m.name.charAt(0)}</span></div>
                    <div><p className="font-bold">{m.name}</p><p className="text-[8px] text-muted-foreground">{m.role}</p></div>
                  </div>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded bg-neon-green/10 ${m.color} font-bold`}>Asignado</span>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "kickoff", icon: CalendarDays, label: "Kickoff Agendado", sublabel: "Google Calendar",
        color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-200",
        outputType: "calendar",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-indigo-500">Reunión de kickoff programada</p>
            <div className="bg-white rounded-lg border border-indigo-200/50 p-2.5 space-y-1.5 text-[10px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Fecha</span><span className="font-bold">Jue 4 Jul, 2026</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Hora</span><span className="font-bold">9:00 AM — 10:00 AM</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Participantes</span><span>Carlos + Laura + Santiago + Camila</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Link</span><span className="font-mono text-neon-cyan text-[9px]">meet.google.com/abc-defg-hij</span></div>
            </div>
          </div>
        ),
      },
      {
        id: "slack", icon: Bell, label: "Alerta al Equipo", sublabel: "Slack — #nuevo-proyecto",
        color: "text-neon-green", bg: "bg-neon-green/5", border: "border-neon-green/20",
        outputType: "notification",
        output: () => (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center"><Bell className="w-3 h-3 text-white" /></div>
              <div>
                <p className="text-[10px] font-bold">#nuevo-proyecto</p>
                <p className="text-[8px] text-muted-foreground">Canal interno — Impulsala</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-slate-100 text-[10px] space-y-1">
              <p><span className="font-bold text-neon-green">Nuevo cliente:</span> TechCo S.A.S</p>
              <p><span className="font-bold text-neon-cyan">Servicio:</span> SEO + Google Ads ($8.5M/mes)</p>
              <p><span className="font-bold text-neon-purple">Equipo:</span> @laura @santiago @camila</p>
              <p><span className="font-bold text-indigo-500">Kickoff:</span> Jue 4 Jul, 9:00 AM</p>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[8px] text-muted-foreground">Reacciones:</span>
              {["Laura", "Santiago", "Camila", "Andrea"].map(n => (
                <span key={n} className="text-[8px] px-1.5 py-0.5 rounded bg-neon-green/10 text-neon-green font-bold">{n}</span>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "reviews",
    name: "Reputación: Reseñas Automáticas",
    description: "Después de entregar un servicio, el sistema solicita reseñas, hace seguimiento, agradece y responde automáticamente.",
    tag: "Reputación",
    tagColor: "text-rose-500",
    icon: Star,
    impact: "De 2% a 38% de clientes dejando reseñas de 5 estrellas",
    metrics: [
      { label: "Reseñas/mes", value: "127", detail: "Antes: 8 manualmente" },
      { label: "Tasa respuesta", value: "5 estrellas 94%", detail: "Promedio 4.8/5" },
      { label: "Tiempo respuesta", value: "< 2 horas", detail: "Antes: 3 días" },
      { label: "Google Rating", value: "4.8 a 4.9", detail: "+0.1 en 2 meses" },
    ],
    finalResult: {
      title: "María López — De Cliente Satisfecho a Reseña 5 Estrellas en Google",
      description: "Después de recibir su pedido, María recibió un email de satisfacción, dejó una reseña de 5 estrellas en Google, recibió un cupón de agradecimiento, y su reseña fue compartida automáticamente en redes sociales. Todo sin intervención humana.",
      totalTime: "48 horas (secuencia automática)",
      outcomes: [
        { icon: Mail, label: "Email satisfacción", value: "Enviado 2h después de entrega confirmada", color: "text-blue-500" },
        { icon: Star, label: "Google Review", value: "5 estrellas publicada — María L.", color: "text-amber-500" },
        { icon: Mail, label: "Email agradecimiento", value: "Cupón GRATIS10 enviado automáticamente", color: "text-neon-purple" },
        { icon: Instagram, label: "Social proof", value: "Reseña compartida en Instagram Stories", color: "text-pink-500" },
        { icon: Database, label: "CRM actualizado", value: "Sentimiento: Positivo — NPS registrado", color: "text-neon-cyan" },
        { icon: Bell, label: "Alerta equipo", value: "Slack: 'Nueva reseña 5 estrellas'", color: "text-neon-green" },
      ],
    },
    nodes: [
      {
        id: "delivery", icon: Truck, label: "Entrega Confirmada", sublabel: "Servientrega — entregado",
        color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200",
        outputType: "trigger",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-amber-500">Paquete entregado al cliente</p>
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-1.5 text-[10px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Orden</span><span className="font-bold">#4521</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Cliente</span><span>María López</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Estado</span><span className="text-neon-green font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Entregado</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Disparador reseña</span><span className="text-amber-500 font-bold">En 2 horas</span></div>
            </div>
          </div>
        ),
      },
      {
        id: "sat_email", icon: Mail, label: "Email Satisfacción", sublabel: "Encuesta + link Google",
        color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200",
        outputType: "email",
        output: () => (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <div>
                <p className="text-[10px] font-bold">Para: maria@email.com</p>
                <p className="text-[9px] text-muted-foreground">Asunto: María, ¿Cómo fue tu experiencia con nosotros?</p>
              </div>
            </div>
            <div className="p-2.5 text-[10px] text-muted-foreground leading-relaxed space-y-1">
              <p className="text-foreground font-bold">Hola María,</p>
              <p>Tu pedido #4521 fue entregado. ¿Te gustaría calificarnos en Google? Solo toma 30 segundos.</p>
              <div className="bg-neon-green/5 rounded p-2 border border-neon-green/10 text-center">
                <p className="text-[10px] font-bold text-neon-green">Deja tu reseña aquí</p>
                <Star className="w-5 h-5 text-amber-400 mx-auto my-1" />
                <p className="text-[9px] text-muted-foreground">g.page/r/impulsala</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "review", icon: Star, label: "Reseña Recibida", sublabel: "Google — 5 estrellas",
        color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200",
        outputType: "notification",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-amber-500">Nueva reseña en Google Business</p>
            <div className="bg-white rounded-lg p-2.5 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center"><span className="text-[9px] font-bold">M</span></div>
                <div>
                  <p className="text-[10px] font-bold">María López</p>
                  <div className="flex gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><Star className="w-3 h-3 text-amber-400 fill-amber-400" /></div>
                </div>
                <span className="text-[8px] text-muted-foreground ml-auto">Hace 1 hora</span>
              </div>
              <p className="text-[10px] text-foreground leading-relaxed">"Increíble experiencia. Compré una camiseta y en menos de 5 días me llegó. El seguimiento por WhatsApp fue excelente. 100% recomendado."</p>
            </div>
          </div>
        ),
      },
      {
        id: "thanks", icon: Mail, label: "Email Agradecimiento", sublabel: "Cupón de descuento",
        color: "text-neon-purple", bg: "bg-neon-purple/5", border: "border-neon-purple/20",
        outputType: "email",
        output: () => (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-neon-purple" />
              <div>
                <p className="text-[10px] font-bold">Para: maria@email.com</p>
                <p className="text-[9px] text-muted-foreground">Asunto: Gracias María! Tienes un regalo especial</p>
              </div>
            </div>
            <div className="p-2.5 text-[10px] text-muted-foreground leading-relaxed space-y-1">
              <p className="text-foreground font-bold">Gracias por tu reseña, María!</p>
              <p>Como agradecimiento, aquí tienes un cupón exclusivo para tu próxima compra:</p>
              <div className="bg-neon-purple/5 rounded-lg p-3 text-center border border-neon-purple/20 border-dashed">
                <p className="text-lg font-extrabold text-neon-purple tracking-wider">GRATIS10</p>
                <p className="text-[9px] text-muted-foreground">10% de descuento — Válido 30 días</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "social_proof", icon: Instagram, label: "Social Proof Post", sublabel: "Instagram — Story automático",
        color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-200",
        outputType: "social",
        output: () => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-500" />
              <span className="text-[10px] font-bold">@impulsala.co — Story</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-neon-green/10 text-neon-green font-bold ml-auto">Publicado</span>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-2.5 space-y-1.5">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 text-center">
                <Star className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <p className="text-[10px] font-bold">"Increíble experiencia. 100% recomendado."</p>
                <p className="text-[8px] text-muted-foreground mt-1">María L. — Cliente verificada</p>
              </div>
              <p className="text-[9px] text-muted-foreground text-center">Story publicada automáticamente — 1,200 visualizaciones</p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "reports",
    name: "Reportes: Informe Mensual Automático",
    description: "Cada mes, el sistema extrae datos de todas las plataformas, analiza tendencias con IA, genera el PDF y lo envía al cliente.",
    tag: "Reportes",
    tagColor: "text-blue-500",
    icon: BarChart3,
    impact: "De 6 horas de reporte manual a cero — generado y enviado automáticamente el día 3",
    metrics: [
      { label: "Reportes/mes", value: "34", detail: "Uno por cliente" },
      { label: "Tiempo creación", value: "0 horas", detail: "Antes: 6 horas c/u" },
      { label: "Fuentes de datos", value: "5 plataformas", detail: "GA4, Ads, Meta, Social, CRM" },
      { label: "Entrega día", value: "3 del mes", detail: "Siempre a tiempo" },
    ],
    finalResult: {
      title: "Reporte Junio 2026 — TechCo S.A.S — Generado y Enviado Automáticamente",
      description: "El sistema extrajo datos de Google Analytics, Google Ads y Meta Ads, la IA identificó tendencias y generó insights, creó el PDF con gráficas, lo envió por email al cliente y un resumen al equipo interno. Nadie tocó nada.",
      totalTime: "0 minutos humanos (todo automático)",
      outcomes: [
        { icon: Globe, label: "Google Analytics", value: "Tráfico: 5.2K (+23%), Conversiones: 89", color: "text-amber-500" },
        { icon: TrendingUp, label: "Google Ads", value: "Gasto: $3.2M, Leads: 47, ROI: 340%", color: "text-neon-cyan" },
        { icon: Users, label: "Meta Ads", value: "Gasto: $1.8M, Leads: 34, ROI: 480%", color: "text-neon-purple" },
        { icon: Bot, label: "IA Insights", value: "3 recomendaciones de optimización generadas", color: "text-neon-green" },
        { icon: Receipt, label: "PDF generado", value: "12 páginas con gráficas profesionales", color: "text-indigo-500" },
        { icon: Mail, label: "Email enviado", value: "Cliente + equipo interno — Día 3 del mes", color: "text-blue-500" },
      ],
    },
    nodes: [
      {
        id: "trigger", icon: Clock, label: "Día 1 del Mes", sublabel: "Programador — trigger",
        color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200",
        outputType: "trigger",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-amber-500">Trigger programado ejecutado</p>
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-1.5 text-[10px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Programación</span><span className="font-bold">Cada día 1, 6:00 AM</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Período</span><span>Junio 2026</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Clientes activos</span><span className="font-bold">34</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Acción</span><span className="text-amber-500 font-bold">Iniciar recolección de datos</span></div>
            </div>
          </div>
        ),
      },
      {
        id: "ga4", icon: Globe, label: "Datos Google Analytics", sublabel: "GA4 API — tráfico y conversiones",
        color: "text-neon-cyan", bg: "bg-neon-cyan/5", border: "border-neon-cyan/20",
        outputType: "analytics",
        output: () => (
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-neon-cyan/5 border border-neon-cyan/15 rounded-lg p-2">
              <Globe className="w-4 h-4 text-neon-cyan" />
              <span className="text-[10px] font-bold text-neon-cyan">Google Analytics 4 — Datos extraídos</span>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-1">
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Sesiones</span><span className="font-bold">5,234</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Usuarios únicos</span><span className="font-bold">3,847</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Conversiones</span><span className="font-bold text-neon-green">89</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">vs. mes anterior</span><span className="font-bold text-neon-green">+23%</span></div>
            </div>
          </div>
        ),
      },
      {
        id: "ads", icon: TrendingUp, label: "Datos de Ads", sublabel: "Google + Meta — inversión y ROI",
        color: "text-neon-purple", bg: "bg-neon-purple/5", border: "border-neon-purple/20",
        outputType: "analytics",
        output: () => (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-white rounded-lg p-2 border border-slate-200">
                <p className="text-[8px] text-muted-foreground">Google Ads</p>
                <p className="text-[10px] font-bold">Gasto: $3.2M</p>
                <p className="text-[9px] text-neon-green font-bold">ROI: 340%</p>
                <p className="text-[8px] text-muted-foreground">47 leads</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-slate-200">
                <p className="text-[8px] text-muted-foreground">Meta Ads</p>
                <p className="text-[10px] font-bold">Gasto: $1.8M</p>
                <p className="text-[9px] text-neon-green font-bold">ROI: 480%</p>
                <p className="text-[8px] text-muted-foreground">34 leads</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "ai_insights", icon: Bot, label: "IA Genera Insights", sublabel: "GPT-4 — análisis + recomendaciones",
        color: "text-neon-green", bg: "bg-neon-green/5", border: "border-neon-green/20",
        outputType: "analytics",
        output: () => (
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-neon-green/5 border border-neon-green/15 rounded-lg p-2">
              <Bot className="w-4 h-4 text-neon-green" />
              <span className="text-[10px] font-bold text-neon-green">IA — 3 insights generados</span>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-2">
              <div className="bg-red-50 rounded p-2 border border-red-100">
                <p className="text-[9px] font-bold text-red-500">ALERTA</p>
                <p className="text-[10px]">El CTR de Google Ads bajó 12%. Recomendación: actualizar copy de anuncios y probar nuevas audiencias.</p>
              </div>
              <div className="bg-neon-green/5 rounded p-2 border border-neon-green/10">
                <p className="text-[9px] font-bold text-neon-green">OPORTUNIDAD</p>
                <p className="text-[10px]">La página de servicios tiene 67% de bounce. Recomendación: rediseñar landing con CTA más claro.</p>
              </div>
              <div className="bg-neon-cyan/5 rounded p-2 border border-neon-cyan/10">
                <p className="text-[9px] font-bold text-neon-cyan">TENDENCIA</p>
                <p className="text-[10px]">El tráfico orgánico crece 8% mensual. El SEO está funcionando — mantener estrategia actual.</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "pdf", icon: Receipt, label: "PDF Generado", sublabel: "12 páginas — diseño profesional",
        color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-200",
        outputType: "invoice",
        output: () => (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-indigo-500">Reporte PDF generado automáticamente</p>
            <div className="bg-white rounded-lg border border-indigo-200/50 overflow-hidden">
              <div className="bg-indigo-50 px-3 py-2 flex items-center justify-between border-b border-indigo-100">
                <span className="text-[10px] font-bold">REPORTE MENSUAL — JUNIO 2026</span>
                <span className="text-[9px] text-muted-foreground">12 páginas</span>
              </div>
              <div className="p-2.5 space-y-1 text-[10px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Cliente</span><span>TechCo S.A.S</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Páginas</span><span>12 (resumen + detalle por canal)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Gráficas</span><span>8 (tráfico, conversión, ROI, ads)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Insights IA</span><span className="text-neon-green font-bold">3 recomendaciones</span></div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "send", icon: Send, label: "Email al Cliente", sublabel: "Reporte adjunto + resumen Slack",
        color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200",
        outputType: "email",
        output: () => (
          <div className="space-y-2">
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <div>
                  <p className="text-[10px] font-bold">Para: carlos@techco.co</p>
                  <p className="text-[9px] text-muted-foreground">Asunto: Tu reporte de Junio 2026 — Impulsala</p>
                </div>
              </div>
              <div className="p-2.5 text-[10px] text-muted-foreground leading-relaxed space-y-1">
                <p className="text-foreground font-bold">Hola Carlos,</p>
                <p>Adjunto encontrarás el reporte completo de junio. Destacados:</p>
                <div className="bg-slate-50 rounded p-2 border border-slate-100 space-y-0.5">
                  <p className="text-[9px]">Tráfico: <span className="font-bold text-neon-green">+23%</span> · Leads: <span className="font-bold">81</span> · ROI combinado: <span className="font-bold text-neon-green">390%</span></p>
                </div>
                <p className="text-blue-500 font-bold">Ver 3 recomendaciones de la IA en el reporte</p>
              </div>
              <div className="bg-slate-50 px-3 py-1.5 border-t border-slate-200">
                <span className="flex items-center gap-1 text-[9px] text-neon-green"><CheckCircle2 className="w-2.5 h-2.5" /> Entregado — Abierto en 45 min</span>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
];

/* ===== Main Component ===== */
export default function AutomationDemo() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  // Lazy-loaded outputs: cache of {automationId-stepIndex: ReactNode}
  // Only renders output JSX when a step is expanded (or active during playback)
  const [loadedOutputs, setLoadedOutputs] = useState<Record<string, React.ReactNode>>({});
  // Loading state for skeleton (100ms artificial delay to show skeleton)
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const playRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const current = automations.find(a => a.id === activeId);

  // Get output key for caching: "automationId-stepIndex"
  const getOutputKey = (autoId: string, stepIdx: number) => `${autoId}-${stepIdx}`;

  // Lazy-load an output with skeleton (100ms)
  const loadOutput = (autoId: string, stepIdx: number, node: FlowNode) => {
    const key = getOutputKey(autoId, stepIdx);
    if (loadedOutputs[key] !== undefined) return; // already loaded

    setLoadingStep(key);
    setTimeout(() => {
      setLoadedOutputs(prev => ({ ...prev, [key]: node.output() }));
      setLoadingStep(null);
    }, 100);
  };

  const playFlow = () => {
    if (!current) return;
    stopFlow();
    setIsPlaying(true);
    setActiveStep(-1);
    setCompletedSteps(new Set());
    setExpandedStep(null);
    setShowFinalResult(false);

    current.nodes.forEach((_, i) => {
      const t = setTimeout(() => {
        setActiveStep(i);
        setCompletedSteps(prev => new Set(prev).add(i));
        setExpandedStep(i);
        // Lazy-load the output for this step during playback
        loadOutput(current.id, i, current.nodes[i]);
      }, i * 280 + 100);
      playRef.current.push(t);
    });

    const finishT = setTimeout(() => {
      setIsPlaying(false);
      setActiveStep(-1);
      setShowFinalResult(true);
    }, current.nodes.length * 280 + 300);
    playRef.current.push(finishT);
  };

  const stopFlow = () => {
    playRef.current.forEach(t => clearTimeout(t));
    playRef.current = [];
    setIsPlaying(false);
    setActiveStep(-1);
  };

  const resetFlow = () => {
    stopFlow();
    setCompletedSteps(new Set());
    setExpandedStep(null);
    setShowFinalResult(false);
  };

  const selectAutomation = (id: string) => {
    stopFlow();
    setActiveId(id);
    setCompletedSteps(new Set());
    setActiveStep(-1);
    setExpandedStep(null);
    setShowFinalResult(false);
  };

  // Handle step click — expand and lazy-load
  const handleStepClick = (autoId: string, stepIdx: number, node: FlowNode, isDone: boolean, isActive: boolean, isExpanded: boolean) => {
    if (!isDone && !isActive) return;
    if (isExpanded) {
      setExpandedStep(null);
    } else {
      setExpandedStep(stepIdx);
      loadOutput(autoId, stepIdx, node);
    }
  };

  /* ===== TEMPLATE SELECTOR ===== */
  if (!activeId) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-400/10 border border-amber-400/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Automatizaciones</h3>
            <p className="text-[10px] text-muted-foreground">Ejecuta un flujo y ve cómo trabaja solo</p>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Selecciona un flujo y pulsa "Ejecutar" para ver la simulación: emails, WhatsApp, facturas y registros generados automáticamente en tiempo real.
        </p>

        <div className="space-y-3">
          {automations.map((auto, i) => (
            <motion.div key={auto.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card
                className="glass-card group rounded-xl p-0 cursor-pointer hover:scale-[1.005] transition-all duration-300 overflow-hidden"
                onClick={() => selectAutomation(auto.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl ${auto.nodes[0].bg} border ${auto.nodes[0].border} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <auto.icon className={`w-5 h-5 ${auto.nodes[0].color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold">{auto.name}</h3>
                        <span className={`text-[9px] font-bold ${auto.tagColor} bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md`}>{auto.tag}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">{auto.description}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <p className="text-[10px] font-bold text-amber-600">{auto.impact}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {auto.metrics.map((m, j) => (
                          <span key={j} className="text-[9px] px-2 py-0.5 rounded bg-slate-50 border border-slate-100 font-medium">
                            {m.label}: <span className="font-bold">{m.value}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  /* ===== ACTIVE FLOW — VISUAL DIAGRAM ===== */
  if (!current) return null;

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <button onClick={() => { stopFlow(); setActiveId(null); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-all">←</span>
          <span className="font-medium hidden sm:inline">Volver</span>
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <div className="flex items-center gap-2 min-w-0">
          <current.icon className={`w-4 h-4 ${current.tagColor}`} />
          <h3 className="text-sm font-bold truncate">{current.name}</h3>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {automations.filter(a => a.id !== activeId).map(a => (
            <button key={a.id} onClick={() => selectAutomation(a.id)}
              className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-all" title={a.name}>
              <a.icon className={`w-3.5 h-3.5 ${a.tagColor}`} />
            </button>
          ))}
        </div>
      </div>

      {/* ===== SECTION 1: VISUAL FLOW DIAGRAM ===== */}
      <Card className="glass-card rounded-xl p-0 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold">Diagrama de Flujo</p>
                <p className="text-[9px] text-muted-foreground">{current.nodes.length} pasos automatizados</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={isPlaying ? stopFlow : playFlow}
                size="sm"
                className={`text-[10px] px-3 h-7 rounded-lg font-bold ${isPlaying ? "bg-red-50 text-red-400 border border-red-200" : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 shadow-md shadow-amber-500/20"}`}
              >
                {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                {isPlaying ? "Pausar" : "Ejecutar Flujo"}
              </Button>
              <Button onClick={resetFlow} variant="outline" size="sm" className="text-[10px] px-2.5 h-7 border-slate-200">
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Visual Flow — Horizontal scrollable */}
          <div className="overflow-x-auto pb-3 -mx-1 px-1">
            <div className="flex items-start gap-0 min-w-max">
              {/* Start indicator */}
              <div className="flex flex-col items-center shrink-0 mr-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  completedSteps.size > 0 ? "bg-neon-green text-white" : "bg-slate-200 text-slate-400"
                } transition-all duration-500`}>
                  <Zap className="w-4 h-4" />
                </div>
                <p className="text-[8px] font-bold text-muted-foreground mt-1">INICIO</p>
              </div>

              {current.nodes.map((node, i) => (
                <div key={node.id} className="flex items-start gap-0 shrink-0">
                  {/* Connector */}
                  <div className="w-10 flex items-center justify-center pt-5">
                    <div className={`w-full h-0.5 rounded-full transition-colors duration-700 relative ${
                      completedSteps.has(i) ? "bg-neon-green" : "bg-slate-200"
                    }`}>
                      {activeStep === i && (
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-lg shadow-amber-400/60 -ml-1"
                          initial={{ left: "0%" }}
                          animate={{ left: "100%" }}
                          transition={{ duration: 1.2, ease: "easeInOut" }}
                        />
                      )}
                    </div>
                  </div>
                  {/* Node */}
                  <div className="flex flex-col items-center shrink-0" style={{ width: 72 }}>
                    <motion.div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        completedSteps.has(i)
                          ? "bg-gradient-to-br from-neon-green to-emerald-500 text-white shadow-lg shadow-neon-green/25"
                          : activeStep === i
                          ? `${node.bg} border-2 ${node.border} shadow-lg scale-110`
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}
                      animate={
                        activeStep === i
                          ? { boxShadow: [`0 0 0 0 rgba(245,158,11,0.3)`, `0 0 0 14px rgba(245,158,11,0)`] }
                          : {}
                      }
                      transition={{ duration: 1, repeat: activeStep === i ? Infinity : 0 }}
                    >
                      {completedSteps.has(i) ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <node.icon className={`w-5 h-5 ${activeStep === i ? node.color : ""}`} />
                      )}
                      {activeStep === i && (
                        <motion.div
                          className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400"
                          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                    <p className={`text-[8px] font-bold text-center mt-1.5 leading-tight transition-colors ${
                      completedSteps.has(i) ? "text-neon-green" : activeStep === i ? node.color : "text-muted-foreground"
                    }`}>{node.label}</p>
                  </div>
                </div>
              ))}

              {/* End indicator */}
              <div className="flex items-start shrink-0 ml-2">
                <div className="w-10 flex items-center justify-center pt-5">
                  <div className={`w-full h-0.5 rounded-full transition-colors duration-700 ${
                    showFinalResult ? "bg-neon-green" : "bg-slate-200"
                  }`} />
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    showFinalResult
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-400/30"
                      : "bg-slate-200 text-slate-400"
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-[8px] font-bold text-muted-foreground mt-1">FIN</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-neon-green to-emerald-400"
                initial={{ width: "0%" }}
                animate={{ width: `${(completedSteps.size / current.nodes.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-[9px] font-bold text-muted-foreground shrink-0">
              {completedSteps.size}/{current.nodes.length} pasos
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ===== SECTION 2: STEP DETAILS ===== */}
      <div className="space-y-2">
        {current.nodes.map((node, i) => {
          const isActive = activeStep === i;
          const isDone = completedSteps.has(i);
          const isPending = !isActive && !isDone;
          const isExpanded = expandedStep === i;
          const showOutput = isExpanded || isActive;
          const outputKey = getOutputKey(current.id, i);
          const cachedOutput = loadedOutputs[outputKey];
          const isLoadingThis = loadingStep === outputKey;

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              <Card
                className={`rounded-xl p-0 transition-all duration-500 overflow-hidden cursor-pointer ${
                  isExpanded ? "border-slate-300 bg-white shadow-md" :
                  isActive ? `${node.bg} border-2 ${node.border} shadow-lg` :
                  isDone ? "border-slate-200 bg-white hover:border-slate-300" :
                  "border-slate-200/80 bg-slate-50/50 opacity-50"
                }`}
                onClick={() => handleStepClick(current.id, i, node, isDone, isActive, !!isExpanded)}
              >
                <CardContent className="p-3.5">
                  {/* Step header — clickable to expand */}
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isDone ? "bg-gradient-to-br from-neon-green to-emerald-500 text-white" :
                      isActive ? `${node.bg} border ${node.border}` :
                      "bg-slate-100 text-slate-400"
                    }`}>
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <node.icon className={`w-3.5 h-3.5 ${isActive ? node.color : ""}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-muted-foreground font-mono shrink-0">Paso {i + 1}</span>
                        <p className={`text-[11px] font-bold ${isDone ? "text-neon-green" : isActive ? node.color : "text-muted-foreground"}`}>
                          {node.label}
                        </p>
                        {i === 0 && <span className="text-[7px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-500 font-bold">TRIGGER</span>}
                        {isActive && (
                          <motion.div className="flex gap-0.5" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }}>
                            <span className={`w-1 h-1 rounded-full ${node.color}`} />
                            <span className={`w-1 h-1 rounded-full ${node.color}`} />
                            <span className={`w-1 h-1 rounded-full ${node.color}`} />
                          </motion.div>
                        )}
                      </div>
                      <p className="text-[9px] text-muted-foreground">{node.sublabel}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold ${
                        isDone ? "bg-neon-green/10 text-neon-green" :
                        isActive ? `${node.bg} ${node.color}` :
                        "bg-slate-100 text-muted-foreground"
                      }`}>
                        {isDone ? "Completado" : isActive ? "Ejecutando..." : "Pendiente"}
                      </span>
                      {(isDone || isActive) && (
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </div>

                  {/* Output — lazy-loaded with scaleY animation (NO height/max-height) */}
                  {showOutput && (
                    <div
                      className="overflow-hidden automation-step-output"
                      style={{
                        transformOrigin: "top",
                        transform: "scaleY(1)",
                        opacity: 1,
                        transition: "transform 0.3s ease, opacity 0.3s ease",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={`mt-3 rounded-xl p-3 border ${
                        node.outputType === "whatsapp" ? "bg-[#075e54]/5 border-[#075e54]/20" :
                        node.outputType === "email" ? "bg-blue-50/50 border-blue-200/50" :
                        node.outputType === "invoice" ? "bg-neon-purple/5 border-neon-purple/20" :
                        node.outputType === "analytics" ? "bg-indigo-50/50 border-indigo-200/50" :
                        "bg-slate-50 border-slate-200"
                      }`}>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-wider font-bold mb-2 flex items-center gap-1">
                          <ArrowRight className="w-2.5 h-2.5" />
                          Resultado de este paso
                        </p>
                        {/* Skeleton while loading (100ms) */}
                        {isLoadingThis && cachedOutput === undefined && (
                          <div className="space-y-2 animate-pulse">
                            <div className="h-3 w-3/4 bg-slate-200 rounded"></div>
                            <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
                          </div>
                        )}
                        {/* Cached/lazy-loaded output */}
                        {!isLoadingThis && cachedOutput !== undefined && cachedOutput}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ===== SECTION 3: RESULTADO FINAL ===== */}
      <AnimatePresence>
        {showFinalResult && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", damping: 20 }}
          >
            <Card className="rounded-2xl p-0 overflow-hidden border-2 border-amber-400/30 bg-card shadow-xl shadow-amber-400/10">
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-400/30"
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Zap className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-100">Resultado Final</h3>
                      <span className="text-[8px] px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green font-bold">COMPLETADO</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{current.finalResult.title}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] text-muted-foreground">Tiempo total</p>
                    <p className="text-xs font-bold text-amber-500">{current.finalResult.totalTime}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                  {current.finalResult.description}
                </p>

                {/* Outcome cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {current.finalResult.outcomes.map((outcome, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-start gap-2.5 bg-card rounded-lg p-2.5 border border-border/60"
                    >
                      <div className="w-7 h-7 rounded-lg bg-secondary border border-border/60 flex items-center justify-center shrink-0">
                        <outcome.icon className={`w-3.5 h-3.5 ${outcome.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold">{outcome.label}</p>
                        <p className="text-[9px] text-muted-foreground">{outcome.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex gap-2">
                  <Button onClick={resetFlow} variant="outline" className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-xl">
                    <RotateCcw className="w-4 h-4 mr-2" /> Ver de nuevo
                  </Button>
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent("open-ai-chat", { detail: { diagnostic: true } }));
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-sky-600 text-white font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-violet-500/20"
                  >
                    Quiero esto para mi negocio
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
