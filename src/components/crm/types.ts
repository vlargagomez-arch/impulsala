"use client";

import { useCallback, useEffect, useState } from "react";

export type LeadStatus = "new" | "contacted" | "scheduled" | "converted" | "lost";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  hasBusiness: string;
  source: string;
  status: LeadStatus;
  estimatedValue: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { leadNotes: number; followUps: number };
  followUps?: {
    id: string;
    scheduledAt: string;
    completed: boolean;
    type: string;
  }[];
}

export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  scheduledAt: string;
  completed: boolean;
  completedAt: string | null;
  type: string;
  notes: string | null;
  createdAt: string;
}

export interface LeadWithRelations extends Lead {
  leadNotes: LeadNote[];
  followUps: FollowUp[];
}

export interface Appointment {
  id: string;
  name: string;
  business: string;
  hasWebsite: string;
  email: string;
  phone: string;
  scheduledAt: string;
  durationMin: number;
  status: string;
  notes: string | null;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  source: string;
  status: string;
  createdAt: string;
}

export interface Stats {
  leads: {
    total: number;
    byStatus: Record<LeadStatus, number>;
    today: number;
    thisWeek: number;
    thisMonth: number;
    byDay: { date: string; total: number; converted: number }[];
  };
  appointments: {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
  newsletter: {
    total: number;
    active: number;
    thisMonth: number;
  };
  pipeline: {
    value: number;
    wonValue: number;
    pendingFollowUps: number;
  };
  conversionRate: number;
}

export const STATUS_META: Record<
  LeadStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  new: {
    label: "Nuevo",
    color: "text-sky-300",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    dot: "bg-sky-400",
  },
  contacted: {
    label: "Contactado",
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
  },
  scheduled: {
    label: "Agendado",
    color: "text-violet-300",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    dot: "bg-violet-400",
  },
  converted: {
    label: "Convertido",
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  lost: {
    label: "Perdido",
    color: "text-rose-300",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    dot: "bg-rose-400",
  },
};

export const STATUS_ORDER: LeadStatus[] = [
  "new",
  "contacted",
  "scheduled",
  "converted",
  "lost",
];

export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  if (hours < 24) return `hace ${hours}h`;
  if (days < 7) return `hace ${days}d`;
  return formatDate(iso);
}

export function useFetch<T>(url: string, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { credentials: "same-origin" });
      if (res.status === 401) {
        setLoading(false);
        setError("Sesión expirada. Recarga e inicia sesión de nuevo.");
        return;
      }
      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
          const body = await res.json();
          if (body?.error) detail = body.error;
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(detail);
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch, setData };
}
