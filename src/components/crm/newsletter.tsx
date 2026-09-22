"use client";

import {
  Mail,
  Download,
  Loader2,
  Search,
  Users,
  Calendar,
  Trash2,
} from "lucide-react";
import { type Subscriber, formatDate, useFetch } from "./types";
import { useState } from "react";

interface SubscribersResponse {
  subscribers: Subscriber[];
}

const SOURCE_LABEL: Record<string, string> = {
  footer: "Footer web",
  blog: "Blog",
  landing: "Landing",
  manual: "Manual",
};

export function CrmNewsletter() {
  const { data, loading, refetch } = useFetch<SubscribersResponse>(
    "/api/crm/newsletter?status=all"
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const all = data?.subscribers || [];
  const filtered = all.filter((s) => {
    if (filter !== "all" && s.status !== filter) return false;
    if (search && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este suscriptor?")) return;
    await fetch("/api/crm/newsletter", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    refetch();
  };

  const exportCsv = () => {
    window.open("/api/crm/export?type=newsletter", "_blank");
  };

  const stats = {
    total: all.length,
    active: all.filter((s) => s.status === "active").length,
    unsubscribed: all.filter((s) => s.status === "unsubscribed").length,
  };

  return (
    <div className="space-y-4">
      {/* Mini-stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs">Total</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Mail className="w-4 h-4" />
            <span className="text-xs">Activos</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
        </div>
        <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">Desuscritos</span>
          </div>
          <p className="text-2xl font-bold text-rose-400">{stats.unsubscribed}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex gap-2">
          {["all", "active", "unsubscribed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                filter === s
                  ? "bg-violet-500/20 text-violet-300 border-violet-500/40"
                  : "bg-card/40 text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              {s === "all" ? "Todos" : s === "active" ? "Activos" : "Desuscritos"}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar email..."
              className="w-full pl-10 pr-3 py-2 bg-card/60 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-xl text-sm font-medium border border-emerald-500/30 transition"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No hay suscriptores para mostrar</p>
        </div>
      ) : (
        <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                  Email
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">
                  Fuente
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">
                  Suscrito
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                  Estado
                </th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition"
                >
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{s.email}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                    {SOURCE_LABEL[s.source] || s.source}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                    {formatDate(s.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs ${
                        s.status === "active"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      {s.status === "active" ? "Activo" : "Desuscrito"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove(s.id)}
                      className="p-1.5 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
