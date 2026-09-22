"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Plus,
  AlertCircle,
  User,
  Building2,
  Globe,
  Mail,
  Phone,
} from "lucide-react";

type Slot = {
  startUtc: string;
  startCot: string;
  label: string;
};

type DateGroup = {
  date: string;
  label: string;
  weekday: string;
  slots: Slot[];
};

export type BookingData = {
  name: string;
  business: string;
  hasWebsite: "si" | "no";
  email: string;
  phone: string;
};

export type BookingWizardProps = {
  onComplete: (result: { scheduledAt: string; id: string; data: BookingData }) => void;
  onCancel: () => void;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+()\-.]{7,20}$/;

/**
 * Multi-step booking wizard rendered inside the chat.
 * Steps: 0 name → 1 business → 2 hasWebsite → 3 email → 4 phone → 5 slot → 6 confirm
 */
export function BookingWizard({ onComplete, onCancel }: BookingWizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BookingData>({
    name: "",
    business: "",
    hasWebsite: "no",
    email: "",
    phone: "",
  });

  const [dates, setDates] = useState<DateGroup[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load availability when entering step 5 (slot selection)
  useEffect(() => {
    if (step !== 5 || dates.length > 0) return;
    let cancelled = false;
    fetch("/api/appointments/slots?days=14")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.dates?.length) {
          setDates(res.dates);
          setSelectedDate(res.dates[0].date);
        } else {
          setSlotsError("No hay disponibilidad en los próximos 14 días. Escríbenos a hola@impulsala.co");
        }
      })
      .catch(() => !cancelled && setSlotsError("No pudimos cargar la disponibilidad."))
      .finally(() => !cancelled && setLoadingSlots(false));
    return () => {
      cancelled = true;
    };
  }, [step, dates.length]);

  const currentDateGroup = dates.find((d) => d.date === selectedDate);

  function canContinue(): boolean {
    switch (step) {
      case 0: return data.name.trim().length >= 2;
      case 1: return data.business.trim().length >= 2;
      case 2: return data.hasWebsite === "si" || data.hasWebsite === "no";
      case 3: return EMAIL_RE.test(data.email);
      case 4: return PHONE_RE.test(data.phone);
      case 5: return !!selectedSlot;
      default: return false;
    }
  }

  async function handleConfirm() {
    if (!selectedSlot) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, scheduledAt: selectedSlot.startUtc }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSubmitError(json?.error || "No se pudo agendar. Intenta otro horario.");
        setSubmitting(false);
        return;
      }
      onComplete({ scheduledAt: selectedSlot.startUtc, id: json.id, data });
    } catch {
      setSubmitError("Error de red. Intenta de nuevo.");
      setSubmitting(false);
    }
  }

  const STEPS = ["Nombre", "Negocio", "Web", "Email", "Teléfono", "Horario"];

  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-background/40 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-3">
        <Calendar className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Agendar diagnóstico</span>
        <span className="ml-auto text-[11px] text-muted-foreground">30 min · Videollamada</span>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                  ? "bg-primary/20 text-primary ring-2 ring-primary/30"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-1 h-px flex-1 transition-colors ${
                  i < step ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-[120px]"
        >
          {step === 0 && (
            <StepField
              icon={User}
              label="¿Cuál es tu nombre?"
              placeholder="Ej: Carlos Mendoza"
              value={data.name}
              onChange={(v) => setData((d) => ({ ...d, name: v }))}
              autoFocus
              onSubmit={() => canContinue() && setStep(1)}
            />
          )}

          {step === 1 && (
            <StepField
              icon={Building2}
              label="¿Cuál es el nombre de tu negocio?"
              placeholder="Ej: TechStart S.A.S"
              value={data.business}
              onChange={(v) => setData((d) => ({ ...d, business: v }))}
              autoFocus
              onSubmit={() => canContinue() && setStep(2)}
            />
          )}

          {step === 2 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                <Globe className="h-3 w-3" />
                ¿Tienes página web actualmente?
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "si" as const, label: "Sí, tengo web" },
                  { value: "no" as const, label: "No, aún no" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setData((d) => ({ ...d, hasWebsite: opt.value }));
                      setTimeout(() => setStep(3), 200);
                    }}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      data.hasWebsite === opt.value
                        ? "border-primary bg-primary/15 text-foreground"
                        : "border-border/60 bg-secondary/30 text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <StepField
              icon={Mail}
              label="¿Cuál es tu correo electrónico?"
              placeholder="tu@empresa.com"
              type="email"
              value={data.email}
              onChange={(v) => setData((d) => ({ ...d, email: v }))}
              error={data.email && !EMAIL_RE.test(data.email) ? "Email inválido" : undefined}
              autoFocus
              onSubmit={() => canContinue() && setStep(4)}
            />
          )}

          {step === 4 && (
            <StepField
              icon={Phone}
              label="¿Cuál es tu teléfono / WhatsApp?"
              placeholder="319 635 4992"
              type="tel"
              value={data.phone}
              onChange={(v) => setData((d) => ({ ...d, phone: v }))}
              error={data.phone && !PHONE_RE.test(data.phone) ? "Teléfono inválido" : undefined}
              autoFocus
              onSubmit={() => canContinue() && setStep(5)}
            />
          )}

          {step === 5 && (
            <div className="space-y-3">
              {loadingSlots ? (
                <div className="flex items-center gap-3 py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Cargando disponibilidad…</span>
                </div>
              ) : slotsError ? (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                  <span>{slotsError}</span>
                </div>
              ) : (
                <>
                  {/* Date chips */}
                  <div>
                    <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Fecha</p>
                    <div className="scrollbar-thin flex gap-1.5 overflow-x-auto pb-2">
                      {dates.map((d) => (
                        <button
                          key={d.date}
                          onClick={() => {
                            setSelectedDate(d.date);
                            setSelectedSlot(null);
                          }}
                          className={`flex min-w-[64px] flex-col items-center rounded-xl border px-3 py-2 text-center transition-all ${
                            selectedDate === d.date
                              ? "border-primary bg-primary/15 text-foreground"
                              : "border-border/60 bg-secondary/30 text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          <span className="text-[10px] uppercase tracking-wider">{d.weekday}</span>
                          <span className="mt-0.5 text-base font-bold">{d.label.split(" ")[1]}</span>
                          <span className="text-[10px]">{d.label.split(" ")[2]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Hora (COT)
                    </p>
                    {currentDateGroup && currentDateGroup.slots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                        {currentDateGroup.slots.map((slot) => (
                          <button
                            key={slot.startUtc}
                            onClick={() => setSelectedSlot(slot)}
                            className={`rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                              selectedSlot?.startUtc === slot.startUtc
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border/60 bg-secondary/30 text-foreground/80 hover:border-primary/40 hover:bg-primary/10"
                            }`}
                          >
                            {slot.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Sin horarios disponibles este día.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Summary + navigation */}
      <div className="space-y-2 border-t border-border/40 pt-3">
        {/* Live summary */}
        {step >= 1 && (
          <div className="rounded-xl bg-primary/5 p-2.5 text-xs">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {data.name && <span><strong className="text-foreground">{data.name}</strong></span>}
              {data.business && <span className="text-muted-foreground">· {data.business}</span>}
              {step >= 3 && data.email && <span className="text-muted-foreground">· {data.email}</span>}
              {step >= 4 && data.phone && <span className="text-muted-foreground">· {data.phone}</span>}
              {step >= 6 && selectedSlot && <span className="text-primary">· {selectedSlot.label}</span>}
            </div>
          </div>
        )}

        {submitError && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {step > 0 && step < 6 ? (
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={submitting}
              className="inline-flex items-center gap-1 rounded-xl border border-border/60 bg-secondary/30 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary/60 disabled:opacity-50"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Atrás
            </button>
          ) : (
            <button
              onClick={onCancel}
              disabled={submitting}
              className="inline-flex items-center gap-1 rounded-xl border border-border/60 bg-secondary/30 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary/60 disabled:opacity-50"
            >
              Cancelar
            </button>
          )}

          {step < 5 ? (
            <button
              onClick={() => canContinue() && setStep((s) => s + 1)}
              disabled={!canContinue()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
            >
              Continuar
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : step === 5 ? (
            <button
              onClick={handleConfirm}
              disabled={!canContinue() || submitting}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Agendando…
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Confirmar cita
                </>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StepField({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  type = "text",
  error,
  autoFocus,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  type?: string;
  error?: string;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full rounded-xl border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
          error
            ? "border-destructive/50 focus:ring-destructive/20"
            : "border-border/60 focus:border-primary/50 focus:ring-primary/20"
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
      {onSubmit && (
        <p className="mt-1.5 text-[10px] text-muted-foreground">Presiona Enter para continuar</p>
      )}
    </div>
  );
}

/**
 * Confirmation card shown after a successful booking.
 * Includes a Google Calendar "Add to event" link that pre-fills the event details.
 */
export function BookingConfirmation({
  data,
  scheduledAt,
  id,
  onReset,
}: {
  data: BookingData;
  scheduledAt: string;
  id: string;
  onReset: () => void;
}) {
  const start = new Date(scheduledAt);
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  // Google Calendar event URL (works without OAuth — opens Google Calendar with prefilled form)
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Diagnóstico Impulsala — ${data.business}`,
  )}&dates=${formatGCalDate(start)}/${formatGCalDate(
    end,
  )}&details=${encodeURIComponent(
    `Sesión de diagnóstico gratuita con Impulsala.\n\nCliente: ${data.name}\nNegocio: ${data.business}\n¿Tiene web?: ${data.hasWebsite === "si" ? "Sí" : "No"}\nEmail: ${data.email}\nTel: ${data.phone}\n\nTe contactaremos por correo con el link de la videollamada.`,
  )}&location=${encodeURIComponent("Videollamada (link por email)")}`;

  const formattedDate = start.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Bogota",
  });
  const formattedTime = start.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Bogota",
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/40 to-card/40 p-5"
    >
      {/* Success header */}
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
          <Check className="h-5 w-5 text-primary" />
        </span>
        <div>
          <div className="text-sm font-semibold text-foreground">¡Cita confirmada!</div>
          <div className="text-[11px] text-muted-foreground">ID: {id.slice(-8).toUpperCase()}</div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-background/40 p-3 text-sm">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Fecha</div>
          <div className="font-medium text-foreground capitalize">{formattedDate}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Hora</div>
          <div className="font-medium text-foreground">{formattedTime} · 30 min</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Negocio</div>
          <div className="font-medium text-foreground">{data.business}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Email</div>
          <div className="truncate font-medium text-foreground">{data.email}</div>
        </div>
      </div>

      {/* Google Calendar CTA */}
      <a
        href={googleCalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-secondary/40 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60"
      >
        <Plus className="h-4 w-4 text-primary" />
        Agregar a Google Calendar
      </a>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Te enviaremos un recordatorio por correo. ¿Necesitas cambiar la hora? Escríbenos a
        hola@impulsala.co
      </p>

      <button
        onClick={onReset}
        className="mt-3 w-full text-center text-xs text-primary hover:underline"
      >
        Agendar otra cita
      </button>
    </motion.div>
  );
}

/** Format a Date as YYYYMMDDTHHMMSSZ (Google Calendar date format) */
function formatGCalDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    "00Z"
  );
}
