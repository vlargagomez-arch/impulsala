"use client";

import { useCallback, useEffect, useState } from "react";
import { Bot, Power, RefreshCw, AlertTriangle } from "lucide-react";

type AgenteSwitch = { agent: string; nombre: string; enabled: boolean; updatedAt: string | null };

/**
 * Interruptores de los agentes: el dueño decide cuándo trabaja cada uno.
 * Apagado = no corre ni por cron ni a mano (queda registrado como "apagado" en el historial).
 */
export function CrmAgentesControl() {
  const [agentes, setAgentes] = useState<AgenteSwitch[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cambiando, setCambiando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const res = await fetch("/api/agents/switch", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No pude leer los interruptores");
      setAgentes(json.agentes || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(cargar, 0);
    return () => clearTimeout(t);
  }, [cargar]);

  const alternar = useCallback(
    async (agent: string, enabled: boolean) => {
      setCambiando(agent);
      setAviso(null);
      try {
        const res = await fetch("/api/agents/switch", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ agent, enabled }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "No pude cambiar el interruptor");
        setAviso(json.mensaje || "Listo");
        if (json.agentes) setAgentes(json.agentes);
      } catch (err) {
        setAviso(err instanceof Error ? err.message : "Error");
      } finally {
        setCambiando(null);
      }
    },
    [],
  );

  if (cargando && !agentes.length) {
    return <div className="text-sm text-muted-foreground">Cargando interruptores…</div>;
  }
  if (error && !agentes.length) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" /> {error}
      </div>
    );
  }

  const encendidos = agentes.filter((a) => a.enabled).length;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-foreground">Interruptores de los agentes</p>
              <p className="text-xs text-muted-foreground">
                Tú decides cuándo trabaja cada uno · {encendidos} de {agentes.length} encendidos
              </p>
            </div>
          </div>
          <button
            onClick={cargar}
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cargando ? "animate-spin" : ""}`} /> Actualizar
          </button>
        </div>

        {aviso && (
          <div className="mt-4 rounded-xl border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-xs text-violet-200">{aviso}</div>
        )}

        <div className="mt-4 space-y-2">
          {agentes.map((a) => (
            <div
              key={a.agent}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{a.nombre}</p>
                <p className="text-[11px] text-muted-foreground">
                  {a.enabled ? "Trabajando · responde al cron y a las ejecuciones manuales" : "Apagado · no trabaja hasta que lo enciendas"}
                  {a.updatedAt ? ` · desde ${new Date(a.updatedAt).toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}` : ""}
                </p>
              </div>
              <button
                onClick={() => alternar(a.agent, !a.enabled)}
                disabled={cambiando === a.agent}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition disabled:opacity-50 ${
                  a.enabled
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                {cambiando === a.agent ? "…" : a.enabled ? "ENCENDIDO · apagar" : "APAGADO · encender"}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground">
          Ojo: apagar el chat de la web hace que el widget responda con el WhatsApp del equipo en vez de con IA, y apagar el resumen
          diario detiene el correo de las 7:00 p.m.
        </p>
      </div>
    </div>
  );
}
