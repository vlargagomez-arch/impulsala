"use client";
import { formatPhoneForWhatsApp } from "@/lib/whatsapp";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import {
  Search,
  MessageCircle,
  Mail,
  Clock,
  StickyNote,
  Calendar,
  Loader2,
  Plus,
  AlertTriangle,
} from "lucide-react";
import {
  type Lead,
  type LeadStatus,
  STATUS_META,
  STATUS_ORDER,
  formatCOP,
  relativeTime,
  useFetch,
} from "./types";
import { LeadDetail } from "./lead-detail";

interface LeadsResponse {
  leads: Lead[];
}

function LeadCard({
  lead,
  onOpen,
  isOverlay,
}: {
  lead: Lead;
  onOpen: () => void;
  isOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
  });

  const meta = STATUS_META[lead.status as LeadStatus];
  const nextFollowup = lead.followUps?.[0];
  const isOverdue =
    nextFollowup && !nextFollowup.completed && new Date(nextFollowup.scheduledAt) < new Date();

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        // Solo abrir si no se está arrastrando
        if (!isDragging) {
          e.stopPropagation();
          onOpen();
        }
      }}
      className={`group bg-card border ${meta.border} rounded-xl p-3 cursor-grab active:cursor-grabbing transition hover:shadow-lg hover:scale-[1.02] ${
        isOverlay ? "shadow-2xl rotate-2 scale-105" : ""
      } ${isDragging ? "opacity-30" : ""}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-foreground truncate">{lead.name}</p>
          <p className="text-xs text-muted-foreground truncate">{lead.hasBusiness}</p>
        </div>
        <span className={`flex-shrink-0 w-2 h-2 rounded-full ${meta.dot}`} />
      </div>

      {lead.estimatedValue > 0 && (
        <p className="text-xs font-medium text-emerald-400 mb-2">
          {formatCOP(lead.estimatedValue)}
        </p>
      )}

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {nextFollowup && (
          <span
            className={`flex items-center gap-1 ${isOverdue ? "text-rose-400" : ""}`}
            title={`Seguimiento: ${new Date(nextFollowup.scheduledAt).toLocaleString("es-CO")}`}
          >
            <Clock className="w-3 h-3" />
            {relativeTime(nextFollowup.scheduledAt)}
          </span>
        )}
        {lead._count && lead._count.leadNotes > 0 && (
          <span className="flex items-center gap-1" title={`${lead._count.leadNotes} notas`}>
            <StickyNote className="w-3 h-3" />
            {lead._count.leadNotes}
          </span>
        )}
        {lead._count && lead._count.followUps > 0 && (
          <span className="flex items-center gap-1" title={`${lead._count.followUps} seguimientos`}>
            <Calendar className="w-3 h-3" />
            {lead._count.followUps}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
        <span className="text-[10px] text-muted-foreground">{relativeTime(lead.createdAt)}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <a
            href={`https://wa.me/${formatPhoneForWhatsApp(lead.phone)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 hover:bg-emerald-500/20 rounded text-emerald-400"
            title="WhatsApp"
          >
            <MessageCircle className="w-3 h-3" />
          </a>
          <a
            href={`mailto:${lead.email}`}
            onClick={(e) => e.stopPropagation()}
            className="p-1 hover:bg-sky-500/20 rounded text-sky-400"
            title="Email"
          >
            <Mail className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

function Column({
  status,
  leads,
  onOpenLead,
}: {
  status: LeadStatus;
  leads: Lead[];
  onOpenLead: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const meta = STATUS_META[status];
  const totalValue = leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

  return (
    <div className="flex flex-col min-w-[260px] w-[260px] lg:w-[280px]">
      <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl ${meta.bg} ${meta.border} border`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
          <span className={`text-sm font-semibold ${meta.color}`}>{meta.label}</span>
          <span className="text-xs text-muted-foreground">({leads.length})</span>
        </div>
        {totalValue > 0 && (
          <span className="text-xs text-emerald-400 font-medium">{formatCOP(totalValue)}</span>
        )}
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 p-2 space-y-2 rounded-b-xl border ${meta.border} border-t-0 min-h-[200px] transition ${
          isOver ? "bg-violet-500/10" : "bg-background/30"
        }`}
      >
        {leads.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-xs text-muted-foreground/50 italic">
            Arrastra leads aquí
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onOpen={() => onOpenLead(lead.id)} />
          ))
        )}
      </div>
    </div>
  );
}

export function CrmKanban() {
  const { data, loading, error, refetch } = useFetch<LeadsResponse>("/api/crm/leads?status=all");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const allLeads = data?.leads || [];
  const filteredLeads = search
    ? allLeads.filter(
        (l) =>
          l.name.toLowerCase().includes(search.toLowerCase()) ||
          l.email.toLowerCase().includes(search.toLowerCase()) ||
          l.phone.includes(search)
      )
    : allLeads;

  const leadsByStatus = (status: LeadStatus) =>
    filteredLeads.filter((l) => l.status === status);

  const activeLead = activeId ? allLeads.find((l) => l.id === activeId) : null;

  const onDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

  const onDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const lead = allLeads.find((l) => l.id === active.id);
    const newStatus = over.id as LeadStatus;

    if (!lead || lead.status === newStatus) return;

    setUpdating(true);
    // Optimistic update: mover el lead visualmente
    const res = await fetch("/api/crm/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: active.id, status: newStatus }),
    });

    if (res.ok) {
      refetch();
    }
    setUpdating(false);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono..."
            className="w-full pl-10 pr-3 py-2 bg-card/60 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>
        {updating && (
          <div className="flex items-center gap-2 text-sm text-violet-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Guardando...
          </div>
        )}
      </div>

      {/* Kanban board */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          <p className="text-sm text-muted-foreground">Cargando leads...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <p className="text-sm text-rose-400 font-medium">Error al cargar leads</p>
          <p className="text-xs text-muted-foreground max-w-md text-center">{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <div className="flex gap-3 min-w-max">
              {STATUS_ORDER.map((status) => (
                <Column
                  key={status}
                  status={status}
                  leads={leadsByStatus(status)}
                  onOpenLead={setOpenLeadId}
                />
              ))}
            </div>
            <DragOverlay>
              {activeLead ? (
                <LeadCard lead={activeLead} onOpen={() => {}} isOverlay />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {/* Modal de detalle */}
      {openLeadId && (
        <LeadDetail
          leadId={openLeadId}
          onClose={() => setOpenLeadId(null)}
          onStatusChange={() => refetch()}
        />
      )}
    </div>
  );
}
