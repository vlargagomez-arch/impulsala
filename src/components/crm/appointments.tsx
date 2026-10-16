"use client";
import { formatPhoneForWhatsApp } from "@/lib/whatsapp";

import { useState, useMemo } from "react";
import {
  Clock,
  Mail,
  Phone,
  MessageCircle,
  Download,
  Loader2,
  Search,
  CheckCircle2,
  XCircle,
  CalendarClock,
  Building2,
  ChevronLeft,
  ChevronRight,
  Bell,
  AlertTriangle,
  Send,
  Eye,
  X,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { type Appointment, useFetch } from "./types";

interface AppointmentsResponse {
  appointments: Appointment[];
}

interface EmailStatus {
  configured: boolean;
  provider: string;
  providerLabel: string;
  needsConfig: string | null;
}

const STATUS_BADGE: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  confirmed: {
    label: "Confirmada",
    color: "text-sky-300",
    bg: "bg-sky-500/15",
    border: "border-sky-500/30",
  },
  completed: {
    label: "Completada",
    color: "text-emerald-300",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
  },
  cancelled: {
    label: "Cancelada",
    color: "text-rose-300",
    bg: "bg-rose-500/15",
    border: "border-rose-500/30",
  },
};

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function getDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// === Banner de Google Calendar ===
interface GoogleCalendarState {
  configured: boolean;
  connected: boolean;
  authUrl: string | null;
  userInfo: { email?: string; name?: string } | null;
}

function GoogleCalendarBanner() {
  const [state, setState] = useState<GoogleCalendarState | null>(null);
  const [loading, setLoading] = useState(true);
  const [justConnected, setJustConnected] = useState(false);

  const checkStatus = async () => {
    try {
      const res = await fetch("/api/google-calendar/status");
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  // Verificar parámetros de URL al montar (sin reload)
  useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("google_connected") === "1") {
        setJustConnected(true);
        // Limpiar URL sin reload
        window.history.replaceState({}, "", "/crm");
      } else if (params.get("google_error")) {
        // Limpiar URL sin reload
        window.history.replaceState({}, "", "/crm");
      }
    }
  });

  useMemo(() => {
    checkStatus();
  }, []);

  // Si acaba de conectar, mostrar éxito inmediatamente
  if (justConnected) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-emerald-300">
            ✅ Google Calendar conectado
          </p>
          <p className="text-[11px] text-emerald-200/80 mt-0.5">
            vlargagomez@gmail.com — cada cita se creará en tu calendario con Google Meet.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return null;
  }

  if (!state) return null;

  // Mostrar siempre como activo (el sistema usa token de BD o .env)
  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs font-semibold text-emerald-300">
          Google Calendar activo
        </p>
        <p className="text-[11px] text-emerald-200/80 mt-0.5">
          vlargagomez@gmail.com — cada cita se creará en tu calendario con Google Meet.
        </p>
      </div>
      {!state.connected && (
        <a
          href={state.authUrl || "/api/google-calendar/auth"}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-xs font-bold transition"
        >
          Activar
        </a>
      )}
    </div>
  );
}

export function CrmAppointments() {
  const { data, loading, refetch } = useFetch<AppointmentsResponse>(
    "/api/crm/appointments?status=all"
  );
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  // Estado del calendario
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // Estado del modal de WhatsApp
  const [waModal, setWaModal] = useState<{
    open: boolean;
    appointment: Appointment | null;
    link: string;
    message: string;
  }>({ open: false, appointment: null, link: "", message: "" });

  // Estado del modal de email preview
  const [emailModal, setEmailModal] = useState<{
    open: boolean;
    html: string;
    subject: string;
    appointment: Appointment | null;
    sending: boolean;
    sent: boolean;
    error: string | null;
  }>({
    open: false,
    html: "",
    subject: "",
    appointment: null,
    sending: false,
    sent: false,
    error: null,
  });

  // Estado del email status
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [showEmailSetup, setShowEmailSetup] = useState(false);

  // Cargar estado del email
  const loadEmailStatus = async () => {
    try {
      const res = await fetch("/api/crm/reminders?range=24h");
      if (res.ok) {
        const data = await res.json();
        if (data.emailStatus) {
          setEmailStatus(data.emailStatus);
          if (!data.emailStatus.configured) setShowEmailSetup(true);
        }
      }
    } catch (e) {
      console.error("Error cargando email status:", e);
    }
  };

  // Cargar al montar
  useMemo(() => {
    loadEmailStatus();
  }, []);

  const all = data?.appointments || [];

  // Filtrar citas
  const filtered = all.filter((a) => {
    if (filter !== "all" && a.status !== filter) return false;
    if (
      search &&
      !a.name.toLowerCase().includes(search.toLowerCase()) &&
      !a.email.toLowerCase().includes(search.toLowerCase()) &&
      !a.business.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  // Agrupar por día
  const appointmentsByDay = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    filtered.forEach((a) => {
      const key = getDateKey(new Date(a.scheduledAt));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    });
    map.forEach((list) => {
      list.sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      );
    });
    return map;
  }, [filtered]);

  // Días del calendario
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();
    const days: { date: Date | null; key: string | null }[] = [];
    for (let i = 0; i < startOffset; i++) days.push({ date: null, key: null });
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(currentYear, currentMonth, d);
      days.push({ date, key: getDateKey(date) });
    }
    return days;
  }, [currentMonth, currentYear]);

  // Citas del día seleccionado
  const selectedDayKey = getDateKey(selectedDate);
  const selectedDayAppointments = appointmentsByDay.get(selectedDayKey) || [];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };
  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(today);
  };

  const changeStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch("/api/crm/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setUpdating(null);
    refetch();
  };

  // === WHATSAPP: prepara el link y muestra modal de confirmación ===
  const prepareWhatsApp = async (appointment: Appointment) => {
    setUpdating(appointment.id);
    try {
      const res = await fetch("/api/crm/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointment.id,
          method: "whatsapp",
        }),
      });
      const data = await res.json();
      if (res.ok && data.link) {
        // Extraer el mensaje del link (decodificar)
        const url = new URL(data.link);
        const message = decodeURIComponent(url.searchParams.get("text") || "");
        setWaModal({
          open: true,
          appointment,
          link: data.link,
          message,
        });
      } else {
        alert(`❌ ${data.error || "No se pudo preparar el WhatsApp"}`);
      }
    } catch (e) {
      console.error(e);
      alert("❌ Error de conexión");
    }
    setUpdating(null);
  };

  // === EMAIL: obtener preview ===
  const prepareEmail = async (appointment: Appointment) => {
    setUpdating(appointment.id);
    try {
      const res = await fetch("/api/crm/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointment.id,
          method: "email-preview",
        }),
      });
      const data = await res.json();
      if (res.ok && data.html) {
        setEmailModal({
          open: true,
          html: data.html,
          subject: data.subject,
          appointment,
          sending: false,
          sent: false,
          error: null,
        });
      } else {
        alert(`❌ ${data.error || "No se pudo generar el preview"}`);
      }
    } catch (e) {
      console.error(e);
      alert("❌ Error de conexión");
    }
    setUpdating(null);
  };

  // === EMAIL: enviar ===
  const sendEmailNow = async () => {
    if (!emailModal.appointment) return;
    setEmailModal((m) => ({ ...m, sending: true, error: null }));
    try {
      const res = await fetch("/api/crm/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: emailModal.appointment.id,
          method: "email",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailModal((m) => ({
          ...m,
          sending: false,
          sent: true,
          error: null,
        }));
        loadEmailStatus();
      } else {
        setEmailModal((m) => ({
          ...m,
          sending: false,
          error: data.error || "Error al enviar",
        }));
      }
    } catch (e: any) {
      setEmailModal((m) => ({
        ...m,
        sending: false,
        error: e.message || "Error de conexión",
      }));
    }
  };

  const exportCsv = () =>
    window.open("/api/crm/export?type=appointments", "_blank");

  // Próximas citas
  const upcomingAppointments = filtered
    .filter((a) => new Date(a.scheduledAt) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* === Banner de estado del sistema de email === */}
      {emailStatus && (
        <div
          className={`rounded-xl border p-3 flex items-start gap-3 ${
            emailStatus.configured
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-amber-500/30 bg-amber-500/10"
          }`}
        >
          {emailStatus.configured ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p
              className={`text-xs font-semibold ${
                emailStatus.configured ? "text-emerald-300" : "text-amber-300"
              }`}
            >
              {emailStatus.configured
                ? `Email activo — ${emailStatus.providerLabel}`
                : "Email NO configurado — los correos no se enviarán"}
            </p>
            {!emailStatus.configured && emailStatus.needsConfig && (
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                {emailStatus.needsConfig}
              </p>
            )}
            <button
              onClick={() => setShowEmailSetup(!showEmailSetup)}
              className="text-[11px] text-amber-300 hover:text-amber-200 underline mt-1"
            >
              {showEmailSetup ? "Ocultar guía" : "Ver guía de configuración"}
            </button>
          </div>
        </div>
      )}

      {/* === Guía de configuración de email (colapsable) === */}
      {showEmailSetup && !emailStatus?.configured && (
        <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
          <h4 className="text-sm font-bold text-foreground">
            Configurar Gmail — 3 pasos
          </h4>

          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-3">
            <p className="text-xs font-semibold text-foreground mb-2">
              Gmail con App Password (gratis)
            </p>
            <ol className="text-[11px] text-muted-foreground space-y-2 list-decimal list-inside">
              <li>
                Activa verificación en 2 pasos en tu cuenta Google:{" "}
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 underline"
                >
                  myaccount.google.com/security
                </a>
              </li>
              <li>
                Genera una contraseña de aplicación:{" "}
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 underline"
                >
                  myaccount.google.com/apppasswords
                </a>
                <br />
                <span className="text-[10px] text-muted-foreground">
                  Selecciona "Mail" → "Generar" → te dará 16 caracteres
                </span>
              </li>
              <li>
                En{" "}
                <code className="px-1 py-0.5 rounded bg-muted text-foreground">
                  .env
                </code>{" "}
                agrega:
              </li>
            </ol>
            <pre className="mt-2 p-2 rounded bg-slate-900 text-sky-300 text-[10px] overflow-x-auto">
{`EMAIL_USER=tu-correo@gmail.com
EMAIL_PASS=abcd-efgh-ijkl-mnop`}
            </pre>
            <p className="text-[10px] text-muted-foreground mt-2">
              💡 EMAIL_PASS es el App Password de 16 caracteres, NO tu contraseña normal de Gmail.
            </p>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Después de configurar, reinicia el servidor:{" "}
            <code className="px-1 py-0.5 rounded bg-muted text-foreground">
              bash scripts/start-prod.sh
            </code>
          </p>
        </div>
      )}

      {/* === ADVERTENCIA ANTI-SPAM WHATSAPP === */}
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-rose-300">
            WhatsApp — Uso manual y controlado
          </p>
          <p className="text-[11px] text-rose-200/80 mt-0.5">
            Los mensajes se abren en WhatsApp para que los revises antes de
            enviar. <strong>No envíes más de 5-10 por hora</strong> desde el
            mismo número, o WhatsApp puede bloquearlo por 7 días.
          </p>
        </div>
      </div>

      {/* === BANNER GOOGLE CALENDAR === */}
      <GoogleCalendarBanner />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["all", "confirmed", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                filter === s
                  ? "bg-violet-500/20 text-violet-300 border-violet-500/40"
                  : "bg-card/40 text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              {s === "all" ? "Todas" : STATUS_BADGE[s]?.label || s}
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
              placeholder="Buscar..."
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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : (
        <>
          {/* === CALENDARIO === */}
          <div className="rounded-2xl border border-border/50 bg-card/60 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">
                {MONTHS[currentMonth]} {currentYear}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
                  aria-label="Mes anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToToday}
                  className="px-3 py-1 rounded-lg text-xs font-medium border border-border bg-secondary/30 text-foreground hover:bg-secondary/60 transition"
                >
                  Hoy
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
                  aria-label="Mes siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="max-w-sm">
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="text-center text-[9px] font-semibold uppercase text-muted-foreground py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {calendarDays.map((day, i) => {
                  if (!day.date) return <div key={i} className="h-8" />;
                  const dayAppts = appointmentsByDay.get(day.key!) || [];
                  const hasAppts = dayAppts.length > 0;
                  const isToday = isSameDay(day.date, today);
                  const isSelected = isSameDay(day.date, selectedDate);

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(day.date!)}
                      className={`relative h-8 flex items-center justify-center rounded text-xs transition-all
                        ${
                          isSelected
                            ? "bg-violet-500 text-white font-bold"
                            : isToday
                              ? "bg-violet-500/20 text-violet-300 font-bold border border-violet-500/50"
                              : hasAppts
                                ? "bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 font-medium"
                                : "text-muted-foreground hover:bg-muted/60"
                        }`}
                    >
                      {day.date.getDate()}
                      {hasAppts && !isSelected && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-sky-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                Confirmada
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Completada
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                Cancelada
              </span>
            </div>
          </div>

          {/* === DETALLE DEL DÍA === */}
          <div className="rounded-2xl border border-border/50 bg-card/60 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground capitalize">
                  {selectedDate.toLocaleDateString("es-CO", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedDayAppointments.length === 0
                    ? "Sin citas programadas"
                    : `${selectedDayAppointments.length} ${
                        selectedDayAppointments.length === 1
                          ? "cita"
                          : "citas"
                      } este día`}
                </p>
              </div>
              {isSameDay(selectedDate, today) && (
                <span className="px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold">
                  HOY
                </span>
              )}
            </div>

            {selectedDayAppointments.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <CalendarClock className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No hay citas este día</p>
                <p className="text-[10px] mt-1">
                  Selecciona otro día en el calendario
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDayAppointments.map((a) => {
                  const badge =
                    STATUS_BADGE[a.status] || STATUS_BADGE.confirmed;
                  const time = new Date(a.scheduledAt).toLocaleTimeString(
                    "es-CO",
                    { hour: "2-digit", minute: "2-digit" }
                  );
                  return (
                    <div
                      key={a.id}
                      className={`rounded-xl border ${badge.border} bg-card/60 p-3 transition hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-violet-400" />
                          <span className="text-sm font-bold text-foreground">
                            {time}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${badge.bg} ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {a.name}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {a.business}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {a.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {a.email}
                        </span>
                      </div>

                      {/* Acciones principales */}
                      <div className="mt-2 flex gap-1">
                        <a
                          href={`https://wa.me/${formatPhoneForWhatsApp(a.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[10px] font-medium transition"
                        >
                          <MessageCircle className="w-3 h-3" />
                          WhatsApp directo
                        </a>
                        {a.status === "confirmed" && (
                          <>
                            <button
                              onClick={() => changeStatus(a.id, "completed")}
                              disabled={updating === a.id}
                              className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 transition disabled:opacity-50"
                              title="Marcar completada"
                            >
                              {updating === a.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              onClick={() => changeStatus(a.id, "cancelled")}
                              disabled={updating === a.id}
                              className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 transition disabled:opacity-50"
                              title="Cancelar cita"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Recordatorios profesionales */}
                      {a.status === "confirmed" && (
                        <div className="mt-2 flex gap-1 border-t border-border/30 pt-2">
                          <button
                            onClick={() => prepareWhatsApp(a)}
                            disabled={updating === a.id}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 text-violet-400 text-[10px] font-medium transition disabled:opacity-50"
                            title="Preparar mensaje de WhatsApp para revisar"
                          >
                            {updating === a.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Bell className="w-3 h-3" />
                            )}
                            Recordar WhatsApp
                          </button>
                          <button
                            onClick={() => prepareEmail(a)}
                            disabled={updating === a.id}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 text-[10px] font-medium transition disabled:opacity-50"
                            title="Ver y enviar email"
                          >
                            {updating === a.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Mail className="w-3 h-3" />
                            )}
                            Recordar Email
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* === PRÓXIMAS CITAS === */}
          {upcomingAppointments.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-card/60 p-4">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-violet-400" />
                Próximas citas
              </h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {upcomingAppointments.map((a) => {
                  const date = new Date(a.scheduledAt);
                  return (
                    <button
                      key={a.id}
                      onClick={() => {
                        setSelectedDate(date);
                        setCurrentMonth(date.getMonth());
                        setCurrentYear(date.getFullYear());
                      }}
                      className="flex-shrink-0 w-48 text-left rounded-xl border border-border/60 bg-card/60 p-3 hover:border-primary/40 hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-muted-foreground">
                          {date.toLocaleDateString("es-CO", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        <span className="text-[10px] font-bold text-violet-400">
                          {date.toLocaleTimeString("es-CO", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-foreground truncate">
                        {a.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {a.business}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* === MODAL WHATSAPP === */}
      {waModal.open && waModal.appointment && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setWaModal({ ...waModal, open: false })}
        >
          <div
            className="bg-card border border-border rounded-2xl max-w-lg w-full p-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  Recordatorio por WhatsApp
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Para: {waModal.appointment.name} ·{" "}
                  {waModal.appointment.phone}
                </p>
              </div>
              <button
                onClick={() => setWaModal({ ...waModal, open: false })}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Advertencia anti-spam */}
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 mb-4 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-200">
                <strong>Importante:</strong> No envíes más de 5-10 mensajes
                parecidos por hora. WhatsApp puede bloquear tu número 7 días por
                spam.
              </p>
            </div>

            {/* Preview del mensaje */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-foreground mb-2">
                Vista previa del mensaje:
              </p>
              <div className="rounded-lg bg-[#e5ddd5] dark:bg-[#1f2c33] p-3 border border-border">
                <pre className="text-xs text-foreground whitespace-pre-wrap font-sans">
                  {waModal.message}
                </pre>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <button
                onClick={() => setWaModal({ ...waModal, open: false })}
                className="flex-1 py-2.5 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition"
              >
                Cancelar
              </button>
              <a
                href={waModal.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setWaModal({ ...waModal, open: false })}
                className="flex-1 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                Abrir WhatsApp
              </a>
            </div>

            <p className="text-[10px] text-muted-foreground mt-3 text-center">
              Se abrirá WhatsApp con el mensaje pre-cargado. Revísalo y
              modifícalo si quieres antes de enviar.
            </p>
          </div>
        </div>
      )}

      {/* === MODAL EMAIL === */}
      {emailModal.open && emailModal.appointment && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() =>
            !emailModal.sending &&
            setEmailModal({ ...emailModal, open: false, sent: false, error: null })
          }
        >
          <div
            className="bg-card border border-border rounded-2xl max-w-2xl w-full p-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Mail className="w-5 h-5 text-sky-400" />
                  Recordatorio por Email
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Para: {emailModal.appointment.email}
                </p>
              </div>
              <button
                onClick={() =>
                  !emailModal.sending &&
                  setEmailModal({
                    ...emailModal,
                    open: false,
                    sent: false,
                    error: null,
                  })
                }
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Asunto */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-foreground mb-1">
                Asunto:
              </p>
              <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                {emailModal.subject}
              </p>
            </div>

            {/* Preview del HTML en iframe */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-foreground mb-1">
                Vista previa:
              </p>
              <div className="rounded-lg border border-border overflow-hidden bg-white">
                <iframe
                  srcDoc={emailModal.html}
                  className="w-full h-[400px] bg-white"
                  title="Email preview"
                />
              </div>
            </div>

            {/* Error */}
            {emailModal.error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 mb-3">
                <p className="text-xs text-rose-300">
                  <strong>Error:</strong> {emailModal.error}
                </p>
              </div>
            )}

            {/* Éxito */}
            {emailModal.sent && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 mb-3 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-emerald-300">
                    ¡Email enviado!
                  </p>
                  <p className="text-[11px] text-emerald-200/80">
                    El correo fue enviado a {emailModal.appointment.email}
                  </p>
                </div>
              </div>
            )}

            {/* Botones */}
            {!emailModal.sent && (
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setEmailModal({
                      ...emailModal,
                      open: false,
                      error: null,
                    })
                  }
                  disabled={emailModal.sending}
                  className="flex-1 py-2.5 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={sendEmailNow}
                  disabled={emailModal.sending || !emailStatus?.configured}
                  className="flex-1 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {emailModal.sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : !emailStatus?.configured ? (
                    "Email no configurado"
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Email
                    </>
                  )}
                </button>
              </div>
            )}

            {emailModal.sent && (
              <button
                onClick={() =>
                  setEmailModal({
                    open: false,
                    html: "",
                    subject: "",
                    appointment: null,
                    sending: false,
                    sent: false,
                    error: null,
                  })
                }
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
