"use client";

import { useFetch, formatCOP, type Stats } from "./types";
import {
  Users,
  Calendar,
  Mail,
  TrendingUp,
  DollarSign,
  Bell,
  Target,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
  trend?: string;
}

function KpiCard({ title, value, subtitle, icon, gradient, trend }: KpiCardProps) {
  return (
    <div className="relative overflow-hidden backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5 hover:border-border transition group">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition ${gradient}`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-xl ${gradient} shadow-lg`}>{icon}</div>
          {trend && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm font-medium text-muted-foreground mt-1">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground/70 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export function CrmDashboard() {
  const { data, loading, error, refetch } = useFetch<Stats>("/api/crm/stats");

  if (loading || (!data && !error)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
        <p className="text-sm text-muted-foreground">Cargando métricas...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-sm text-rose-400 font-medium">Error al cargar métricas</p>
        <p className="text-xs text-muted-foreground">{error}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const pieData = [
    { name: "Nuevos", value: data.leads.byStatus.new, color: "#38bdf8" },
    { name: "Contactados", value: data.leads.byStatus.contacted, color: "#fbbf24" },
    { name: "Agendados", value: data.leads.byStatus.scheduled, color: "#a78bfa" },
    { name: "Convertidos", value: data.leads.byStatus.converted, color: "#34d399" },
    { name: "Perdidos", value: data.leads.byStatus.lost, color: "#fb7185" },
  ].filter((d) => d.value > 0);

  const chartData = data.leads.byDay.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit" }),
  }));

  return (
    <div className="space-y-6">
      {/* KPIs principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Leads totales"
          value={data.leads.total}
          subtitle={`${data.leads.today} hoy · ${data.leads.thisWeek} esta semana`}
          icon={<Users className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-br from-sky-500 to-blue-600"
          trend={`+${data.leads.thisWeek}`}
        />
        <KpiCard
          title="Citas próximas"
          value={data.appointments.upcoming}
          subtitle={`${data.appointments.total} totales · ${data.appointments.completed} completadas`}
          icon={<Calendar className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-br from-violet-500 to-purple-600"
        />
        <KpiCard
          title="Suscriptores"
          value={data.newsletter.active}
          subtitle={`${data.newsletter.thisMonth} nuevos este mes`}
          icon={<Mail className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          trend={`+${data.newsletter.thisMonth}`}
        />
        <KpiCard
          title="Conversión"
          value={`${data.conversionRate.toFixed(1)}%`}
          subtitle={`${data.leads.byStatus.converted} convertidos`}
          icon={<Target className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        />
      </div>

      {/* Pipeline + Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-foreground">Valor del pipeline</h3>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            {formatCOP(data.pipeline.value)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Suma de leads activos (nuevos, contactados, agendados)
          </p>
          <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Ingresos ganados</p>
              <p className="text-lg font-semibold text-emerald-400">
                {formatCOP(data.pipeline.wonValue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tasa de cierre</p>
              <p className="text-lg font-semibold text-foreground">
                {data.conversionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-foreground">Seguimientos pendientes</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-sm">Vencidos</span>
              </div>
              <span className="text-xl font-bold text-amber-400">
                {data.pipeline.pendingFollowUps}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-sky-500/10 border border-sky-500/30">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span className="text-sm">Citas completadas</span>
              </div>
              <span className="text-xl font-bold text-sky-400">
                {data.appointments.completed}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-400" />
                <span className="text-sm">Citas canceladas</span>
              </div>
              <span className="text-xl font-bold text-rose-400">
                {data.appointments.cancelled}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leads por día */}
        <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-semibold text-foreground mb-4">Leads en los últimos 14 días</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,23,42,0.95)",
                  border: "1px solid rgba(148,163,184,0.2)",
                  borderRadius: "0.75rem",
                  color: "#f1f5f9",
                }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#a78bfa"
                strokeWidth={2}
                fill="url(#totalGrad)"
                name="Leads"
              />
              <Area
                type="monotone"
                dataKey="converted"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#convGrad)"
                name="Convertidos"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por estado */}
        <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Distribución de leads</h3>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-[260px] text-sm text-muted-foreground">
              Sin datos
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(148,163,184,0.2)",
                    borderRadius: "0.75rem",
                    color: "#f1f5f9",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
