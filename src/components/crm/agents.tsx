"use client";

import { useCallback, useEffect, useState } from "react";
import { Bot, RefreshCw, Sparkles, Calendar, FileText, Mail, MessageSquare, AlertTriangle } from "lucide-react";

type AgentRun = {
  id: string;
  agent: string;
  status: string;
  summary: string;
  durationMs: number;
  createdAt: string;
};

type Conversacion = {
  conversationId: string;
  updatedAt: string;
  mensajes: number;
  muestra: string;
};

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  hasBusiness: string;
  source: string;
  status: string;
  notes: string | null;
  createdAt: string;
};

type Cita = { id: string; name: string; email: string; scheduledAt: string; status: string };

type Articulo = { title: string; slug: string; createdAt: string };

type Status = {
  estado: {
    motor: string;
    whatsapp: string;
    agentes: { id: string; nombre: string; detalle: string; activo: boolean }[];
  };
  metricas: {
    leads7d: number;
    leadsSinContactar: number;
    conversaciones: number;
    citasAgente: number;
    articulos: number;
  };
  runs: AgentRun[];
  conversaciones: Conversacion[];
  leadsAgente: Lead[];
  citasAgente: Cita[];
  articulos: Articulo[];
};

const AGENT_LABEL: Record<string, string> = {
  chat: "Agente de ventas",
  blog: "Agente SEO",
  followup: "Agente de seguimiento",
  report: "Agente analista",
};

function fmt(date: string) {
  return new Date(date).toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function CrmAgents() {
  const [data, setData] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents/status", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error cargando el estado");
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !data) {
    return <div className="text-sm text-muted-foreground">Cargando el estado de los agentes…</div>;
  }
  if (error && !data) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" /> {error}
      </div>
    );
  }
  if (!data) return null;

  const { estado, metricas, runs, conversaciones, leadsAgente, citasAgente, articulos } = data;

  const cards = [
    { label: "Leads (7 días)", value: metricas.leads7d, icon: <Sparkles className="w-4 h-4" /> },
    { label: "Sin contactar", value: metricas.leadsSinContactar, icon: <AlertTriangle className="w-4 h-4" /> },
    { label: "Conversaciones IA", value: metricas.conversaciones, icon: <MessageSquare className="w-4 h-4" /> },
    { label: "Citas del agente", value: metricas.citasAgente, icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Estado del motor + agentes activos */}
      <div className="rounded-2xl border border-border bg-card/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-foreground">Automatización con agentes IA</p>
              <p className="text-xs text-muted-foreground">
                Motor: {estado.motor} · WhatsApp del equipo: {estado.whatsapp}
              </p>
            </div>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Actualizar
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {estado.agentes.map((a) => (
            <div key={a.id} className="rounded-xl border border-border/60 bg-background/40 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{a.nombre}</p>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    a.activo ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : "border-rose-500/40 text-rose-400 bg-rose-500/10"
                  }`}
                >
                  {a.activo ? "ACTIVO" : "INACTIVO"}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{a.detalle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card/60 p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              {c.icon} {c.label}
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Actividad de los agentes */}
        <div className="rounded-2xl border border-border bg-card/60 p-5">
          <p className="font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" /> Últimas acciones de los agentes
          </p>
          <div className="mt-3 space-y-2 max-h-80 overflow-auto">
            {runs.length === 0 && <p className="text-xs text-muted-foreground">Todavía no hay acciones registradas.</p>}
            {runs.map((r) => (
              <div key={r.id} className="rounded-xl border border-border/60 bg-background/40 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{AGENT_LABEL[r.agent] || r.agent}</span>
                  <span className={r.status === "ok" ? "text-emerald-400" : "text-rose-400"}>{fmt(r.createdAt)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conversaciones del chat */}
        <div className="rounded-2xl border border-border bg-card/60 p-5">
          <p className="font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-sky-400" /> Conversaciones atendidas por el agente
          </p>
          <div className="mt-3 space-y-2 max-h-80 overflow-auto">
            {conversaciones.length === 0 && <p className="text-xs text-muted-foreground">Aún no hay conversaciones.</p>}
            {conversaciones.map((c) => (
              <div key={c.conversationId} className="rounded-xl border border-border/60 bg-background/40 p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{c.mensajes} mensajes</span>
                  <span>{fmt(c.updatedAt)}</span>
                </div>
                <p className="mt-1 text-xs text-foreground/80 line-clamp-2">{c.muestra}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leads capturados por el agente */}
        <div className="rounded-2xl border border-border bg-card/60 p-5">
          <p className="font-semibold text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-400" /> Contactos capturados por el agente
          </p>
          <div className="mt-3 space-y-2 max-h-80 overflow-auto">
            {leadsAgente.length === 0 && <p className="text-xs text-muted-foreground">Todavía no hay contactos del agente.</p>}
            {leadsAgente.map((l) => (
              <div key={l.id} className="rounded-xl border border-border/60 bg-background/40 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{l.name}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-violet-500/40 text-violet-300 bg-violet-500/10">
                    {l.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {l.phone} · {l.email} · {l.hasBusiness}
                </p>
                {l.notes && <p className="mt-1 text-xs text-foreground/70">{l.notes}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Citas y artículos */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Citas agendadas por el agente
            </p>
            <div className="mt-3 space-y-2">
              {citasAgente.length === 0 && <p className="text-xs text-muted-foreground">Sin citas del agente por ahora.</p>}
              {citasAgente.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3 text-xs">
                  <span className="text-foreground">{c.name}</span>
                  <span className="text-muted-foreground">{fmt(c.scheduledAt)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" /> Artículos del agente SEO
            </p>
            <div className="mt-3 space-y-2">
              {articulos.length === 0 && <p className="text-xs text-muted-foreground">Sin artículos todavía.</p>}
              {articulos.map((a) => (
                <a
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-border/60 bg-background/40 p-3 text-xs text-foreground/80 hover:border-violet-500/40"
                >
                  {a.title}
                  <span className="block text-muted-foreground mt-0.5">{fmt(a.createdAt)}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
