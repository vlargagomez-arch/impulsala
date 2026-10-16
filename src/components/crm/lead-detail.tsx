"use client";
import { formatPhoneForWhatsApp } from "@/lib/whatsapp";

import { useEffect, useState } from "react";
import {
  X,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  Calendar,
  DollarSign,
  StickyNote,
  Bell,
  Plus,
  Check,
  Trash2,
  Loader2,
  Clock,
  Send,
} from "lucide-react";
import {
  type LeadWithRelations,
  type LeadStatus,
  STATUS_META,
  STATUS_ORDER,
  formatCOP,
  formatDateTime,
  relativeTime,
  useFetch,
} from "./types";

interface LeadDetailProps {
  leadId: string;
  onClose: () => void;
  onStatusChange?: (leadId: string, status: LeadStatus) => void;
}

export function LeadDetail({ leadId, onClose, onStatusChange }: LeadDetailProps) {
  const { data, loading, error, refetch } = useFetch<{ lead: LeadWithRelations }>(
    `/api/crm/leads/${leadId}`
  );
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [showFollowup, setShowFollowup] = useState(false);
  const [followupDate, setFollowupDate] = useState("");
  const [followupType, setFollowupType] = useState("call");
  const [followupNotes, setFollowupNotes] = useState("");
  const [addingFollowup, setAddingFollowup] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const lead = data?.lead;

  const changeStatus = async (status: LeadStatus) => {
    setUpdatingStatus(true);
    await fetch("/api/crm/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: leadId, status }),
    });
    setUpdatingStatus(false);
    onStatusChange?.(leadId, status);
    refetch();
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);
    await fetch(`/api/crm/leads/${leadId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newNote }),
    });
    setNewNote("");
    setAddingNote(false);
    refetch();
  };

  const addFollowup = async () => {
    if (!followupDate) return;
    setAddingFollowup(true);
    await fetch(`/api/crm/leads/${leadId}/followups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scheduledAt: new Date(followupDate).toISOString(),
        type: followupType,
        notes: followupNotes,
      }),
    });
    setFollowupDate("");
    setFollowupNotes("");
    setShowFollowup(false);
    setAddingFollowup(false);
    refetch();
  };

  const toggleFollowup = async (followUpId: string, completed: boolean) => {
    await fetch(`/api/crm/leads/${leadId}/followups`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followUpId, completed: !completed }),
    });
    refetch();
  };

  const whatsappUrl = lead
    ? `https://wa.me/${formatPhoneForWhatsApp(lead.phone)}?text=${encodeURIComponent(
        `Hola ${lead.name}, te contacto de Impulsala.`
      )}`
    : "#";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-violet-500/10 to-sky-500/10">
          <div>
            <h2 className="text-xl font-bold text-foreground">{lead?.name || "Cargando..."}</h2>
            <p className="text-sm text-muted-foreground">
              {lead?.email} · {lead?.phone}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading || (!lead && !error) ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <p className="text-sm text-muted-foreground">Cargando lead...</p>
          </div>
        ) : error || !lead ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-sm text-rose-400 font-medium">Error al cargar lead</p>
            <p className="text-xs text-muted-foreground max-w-md text-center">
              {error || "Lead no encontrado"}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto p-5 space-y-5">
            {/* Info grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <InfoCard
                icon={<Building2 className="w-4 h-4" />}
                label="Negocio"
                value={lead.hasBusiness}
              />
              <InfoCard
                icon={<DollarSign className="w-4 h-4" />}
                label="Valor estimado"
                value={formatCOP(lead.estimatedValue)}
                editable
                onEdit={async (v) => {
                  const num = parseInt(v.replace(/[^0-9]/g, "")) || 0;
                  await fetch("/api/crm/leads", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: leadId, estimatedValue: num }),
                  });
                  refetch();
                }}
              />
              <InfoCard
                icon={<Calendar className="w-4 h-4" />}
                label="Creado"
                value={relativeTime(lead.createdAt)}
              />
              <InfoCard
                icon={<Send className="w-4 h-4" />}
                label="Fuente"
                value={lead.source}
              />
            </div>

            {/* Botones de contacto */}
            <div className="flex flex-wrap gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-xl text-sm font-medium border border-emerald-500/30 transition"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href={`mailto:${lead.email}?subject=Seguimiento Impulsala&body=Hola ${lead.name},`}
                className="flex items-center gap-2 px-4 py-2 bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 rounded-xl text-sm font-medium border border-sky-500/30 transition"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-violet-500/15 hover:bg-violet-500/25 text-violet-400 rounded-xl text-sm font-medium border border-violet-500/30 transition"
              >
                <Phone className="w-4 h-4" />
                Llamar
              </a>
            </div>

            {/* Cambiar estado */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${STATUS_META[lead.status as LeadStatus].dot}`}
                />
                Estado actual:{" "}
                <span className={STATUS_META[lead.status as LeadStatus].color}>
                  {STATUS_META[lead.status as LeadStatus].label}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {STATUS_ORDER.map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(s)}
                    disabled={updatingStatus}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      lead.status === s
                        ? `${STATUS_META[s].bg} ${STATUS_META[s].color} ${STATUS_META[s].border}`
                        : "bg-muted/30 text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {STATUS_META[s].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Follow-ups */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  Seguimientos ({lead.followUps.length})
                </h3>
                <button
                  onClick={() => setShowFollowup(!showFollowup)}
                  className="text-xs flex items-center gap-1 text-violet-400 hover:text-violet-300 transition"
                >
                  <Plus className="w-3 h-3" />
                  Programar
                </button>
              </div>

              {showFollowup && (
                <div className="mb-3 p-3 bg-muted/30 rounded-xl border border-border space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="datetime-local"
                      value={followupDate}
                      onChange={(e) => setFollowupDate(e.target.value)}
                      className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm"
                    />
                    <select
                      value={followupType}
                      onChange={(e) => setFollowupType(e.target.value)}
                      className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm"
                    >
                      <option value="call">Llamada</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                      <option value="meeting">Reunión</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={followupNotes}
                    onChange={(e) => setFollowupNotes(e.target.value)}
                    placeholder="Notas (opcional)"
                    className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm"
                  />
                  <button
                    onClick={addFollowup}
                    disabled={addingFollowup || !followupDate}
                    className="w-full py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {addingFollowup && <Loader2 className="w-3 h-3 animate-spin" />}
                    Programar seguimiento
                  </button>
                </div>
              )}

              {lead.followUps.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Sin seguimientos programados</p>
              ) : (
                <div className="space-y-2">
                  {lead.followUps.map((fu) => {
                    const isOverdue = !fu.completed && new Date(fu.scheduledAt) < new Date();
                    return (
                      <div
                        key={fu.id}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border ${
                          fu.completed
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : isOverdue
                              ? "bg-rose-500/10 border-rose-500/30"
                              : "bg-muted/30 border-border"
                        }`}
                      >
                        <button
                          onClick={() => toggleFollowup(fu.id, fu.completed)}
                          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                            fu.completed
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-muted-foreground hover:border-emerald-500"
                          }`}
                        >
                          {fu.completed && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {formatDateTime(fu.scheduledAt)}
                            <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                              {fu.type}
                            </span>
                            {isOverdue && (
                              <span className="text-xs px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded">
                                vencido
                              </span>
                            )}
                          </p>
                          {fu.notes && (
                            <p className="text-xs text-muted-foreground mt-0.5">{fu.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notas */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-amber-400" />
                Notas ({lead.leadNotes.length})
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNote()}
                  placeholder="Agregar nota sobre este lead..."
                  className="flex-1 px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  onClick={addNote}
                  disabled={addingNote || !newNote.trim()}
                  className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {addingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : "Agregar"}
                </button>
              </div>
              {lead.leadNotes.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Sin notas aún</p>
              ) : (
                <div className="space-y-2">
                  {lead.leadNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 bg-muted/30 rounded-lg border border-border"
                    >
                      <p className="text-sm text-foreground">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {note.author} · {relativeTime(note.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  editable?: boolean;
  onEdit?: (value: string) => void;
}

function InfoCard({ icon, label, value, editable, onEdit }: InfoCardProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  return (
    <div className="p-3 bg-muted/30 rounded-xl border border-border">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
        {icon}
        {label}
      </div>
      {editing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => {
            setEditing(false);
            onEdit?.(editValue);
          }}
          onKeyDown={(e) => e.key === "Enter" && (setEditing(false), onEdit?.(editValue))}
          autoFocus
          className="w-full px-1.5 py-0.5 bg-background border border-violet-500 rounded text-sm text-foreground"
        />
      ) : (
        <p
          className={`text-sm font-medium text-foreground ${editable ? "cursor-pointer hover:text-violet-400" : ""}`}
          onClick={() => editable && (setEditValue(value), setEditing(true))}
        >
          {value}
        </p>
      )}
    </div>
  );
}
