"use client";

import { useState } from "react";
import {
  Mail,
  Send,
  Loader2,
  Trash2,
  Plus,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  X,
} from "lucide-react";
import { useFetch } from "./types";

interface Campaign {
  id: string;
  subject: string;
  content: string;
  status: string;
  sentTo: number;
  createdAt: string;
  sentAt: string | null;
}

interface CampaignsResponse {
  campaigns: Campaign[];
  activeSubs: number;
}

export function CrmCampaigns() {
  const { data, loading, refetch } = useFetch<CampaignsResponse>("/api/crm/campaigns");
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const campaigns = data?.campaigns || [];
  const activeSubs = data?.activeSubs || 0;

  const createCampaign = async (sendNow: boolean) => {
    if (!subject.trim() || !content.trim()) return;
    setSending(true);
    setSuccess(null);
    try {
      const res = await fetch("/api/crm/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content, send: sendNow }),
      });
      const result = await res.json();
      if (res.ok) {
        setSubject("");
        setContent("");
        setShowForm(false);
        setSuccess(
          sendNow
            ? `✅ Campaña enviada a ${result.recipients} suscriptores`
            : "✅ Campaña guardada como borrador"
        );
        refetch();
        setTimeout(() => setSuccess(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const sendCampaign = async (id: string) => {
    if (!confirm("¿Enviar esta campaña a todos los suscriptores activos?")) return;
    setSending(true);
    try {
      const res = await fetch(`/api/crm/campaigns/${id}`, { method: "PATCH" });
      const result = await res.json();
      if (res.ok) {
        setSuccess(`✅ ${result.message}`);
        refetch();
        setTimeout(() => setSuccess(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm("¿Eliminar esta campaña?")) return;
    await fetch(`/api/crm/campaigns/${id}`, { method: "DELETE" });
    refetch();
  };

  return (
    <div className="space-y-5">
      {/* Header con stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs">Suscriptores activos</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{activeSubs}</p>
        </div>
        <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Mail className="w-4 h-4" />
            <span className="text-xs">Campañas enviadas</span>
          </div>
          <p className="text-2xl font-bold text-sky-400">
            {campaigns.filter((c) => c.status === "sent").length}
          </p>
        </div>
        <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileText className="w-4 h-4" />
            <span className="text-xs">Borradores</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">
            {campaigns.filter((c) => c.status === "draft").length}
          </p>
        </div>
      </div>

      {/* Mensaje de éxito */}
      {success && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Botón nueva campaña */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-sky-600 text-white rounded-xl text-sm font-semibold transition-all hover:brightness-110"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancelar" : "Nueva campaña"}
        </button>
      </div>

      {/* Formulario nueva campaña */}
      {showForm && (
        <div className="rounded-2xl border border-border/50 bg-card/60 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Redactar newsletter</h3>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Asunto del email</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ej: 🚀 Nuevas estrategias de marketing digital para tu PYME"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Contenido del mensaje</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe aquí el contenido de tu newsletter...&#10;&#10;Ej: Hola! Esta semana te traemos 3 tips para mejorar tu SEO en Google...&#10;&#10;Saludos,&#10;Equipo Impulsala"
              rows={8}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-y"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Se enviará a <strong className="text-foreground">{activeSubs}</strong> suscriptores activos
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => createCampaign(true)}
              disabled={sending || !subject.trim() || !content.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Enviar ahora a {activeSubs} suscriptores
            </button>
            <button
              onClick={() => createCampaign(false)}
              disabled={sending || !subject.trim() || !content.trim()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border bg-secondary/30 text-foreground rounded-xl text-sm font-semibold transition-colors hover:bg-secondary/60 disabled:opacity-50"
            >
              Guardar borrador
            </button>
          </div>
        </div>
      )}

      {/* Lista de campañas */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aún no has creado campañas</p>
          <p className="text-xs mt-1">Haz clic en "Nueva campaña" para enviar tu primer newsletter</p>
        </div>
      ) : (
        <div className="space-y-2">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-border/50 bg-card/60 p-4 hover:border-border transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-foreground truncate">{c.subject}</h4>
                    {c.status === "sent" ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-medium flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        Enviada
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-medium flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        Borrador
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{c.content}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    {c.status === "sent" ? (
                      <>
                        <span className="flex items-center gap-1">
                          <Send className="w-3 h-3" />
                          Enviada a {c.sentTo} suscriptores
                        </span>
                        {c.sentAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(c.sentAt).toLocaleString("es-CO", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Creada {new Date(c.createdAt).toLocaleDateString("es-CO")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {c.status === "draft" && (
                    <button
                      onClick={() => sendCampaign(c.id)}
                      disabled={sending}
                      className="p-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-lg transition disabled:opacity-50"
                      title="Enviar ahora"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteCampaign(c.id)}
                    className="p-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 rounded-lg transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
