"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope, Calendar, Clock, Phone, MapPin, Star, Check,
  ChevronRight, Video, User, Award, Heart, Activity, Shield,
} from "lucide-react";

const SERVICES = [
  { name: "Medicina General", icon: Stethoscope, duration: "30 min", price: "$45.000", color: "bg-emerald-500", desc: "Consulta, diagnóstico y tratamiento general" },
  { name: "Cardiología", icon: Heart, duration: "45 min", price: "$80.000", color: "bg-red-500", desc: "Evaluación cardiovascular y electrocardiograma" },
  { name: "Pediatría", icon: User, duration: "30 min", price: "$50.000", color: "bg-blue-500", desc: "Atención especializada para niños" },
  { name: "Dermatología", icon: Shield, duration: "40 min", price: "$70.000", color: "bg-purple-500", desc: "Diagnóstico y tratamiento de piel" },
  { name: "Nutrición", icon: Activity, duration: "60 min", price: "$55.000", color: "bg-amber-500", desc: "Plan nutricional personalizado" },
  { name: "Psicología", icon: Heart, duration: "50 min", price: "$65.000", color: "bg-pink-500", desc: "Terapia y bienestar mental" },
];

const DOCTORS = [
  { name: "Dra. María González", spec: "Medicina General", rating: 4.9, reviews: 234, exp: "12 años", color: "bg-emerald-500" },
  { name: "Dr. Carlos Ruiz", spec: "Cardiología", rating: 4.8, reviews: 189, exp: "15 años", color: "bg-red-500" },
  { name: "Dra. Ana Torres", spec: "Pediatría", rating: 5.0, reviews: 312, exp: "10 años", color: "bg-blue-500" },
  { name: "Dr. Javier Mora", spec: "Dermatología", rating: 4.7, reviews: 156, exp: "8 años", color: "bg-purple-500" },
];

const TESTIMONIALS = [
  { name: "Laura G.", text: "Agendé en 30 segundos y me atendieron el mismo día. Excelente servicio.", rating: 5 },
  { name: "Andrés M.", text: "La videollamada funcionó perfecto. No tuve que salir de casa.", rating: 5 },
  { name: "Patricia R.", text: "Los doctores son muy profesionales. Recomendada 100%.", rating: 5 },
];

const DATES = [
  { day: "Lun", num: 14 },
  { day: "Mar", num: 15 },
  { day: "Mié", num: 16 },
  { day: "Jue", num: 17 },
  { day: "Vie", num: 18 },
];

const SLOTS = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

export function ClinicDemo() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [modality, setModality] = useState<"video" | "presencial">("video");

  const handleBook = () => {
    setBooking(true);
    setTimeout(() => { setBooking(false); setSelectedSlot(null); }, 2500);
  };

  return (
    <div className="bg-white text-slate-900 min-h-[600px] relative">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Stethoscope className="size-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight">Clínica Plus</span>
              <p className="text-[9px] text-slate-400">Salud integral · Bogotá</p>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-4 text-[11px] font-medium text-slate-600">
            <a className="hover:text-emerald-600 cursor-pointer">Inicio</a>
            <a className="hover:text-emerald-600 cursor-pointer">Servicios</a>
            <a className="hover:text-emerald-600 cursor-pointer">Doctores</a>
            <a className="hover:text-emerald-600 cursor-pointer">Contacto</a>
          </nav>
          <div className="flex items-center gap-2">
            <a className="flex items-center gap-1 text-[11px] text-slate-500"><Phone className="size-3" /> 319 635 4992</a>
            <button className="rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-white">Agendar</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 2px, transparent 2px)", backgroundSize: "40px 40px" }} />
        <div className="relative px-6 py-12 sm:py-16 max-w-lg">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold backdrop-blur-sm">+12.000 pacientes atendidos</span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold leading-tight">Tu salud, sin filas ni esperas</h1>
          <p className="mt-2 text-sm text-emerald-50/90">Agenda tu cita médica en línea en menos de 60 segundos. Atención presencial y por videollamada.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => document.getElementById("servicios-demo")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              <Calendar className="size-4" /> Agendar cita
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10">
              <Video className="size-4" /> Videollamada
            </button>
          </div>
          <div className="mt-6 flex gap-5 text-[10px]">
            <div><p className="text-xl font-bold">+210%</p><p className="text-emerald-100">Citas online</p></div>
            <div><p className="text-xl font-bold">-65%</p><p className="text-emerald-100">No-shows</p></div>
            <div><p className="text-xl font-bold">4.9★</p><p className="text-emerald-100">Rating</p></div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div id="servicios-demo" className="px-4 py-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold">Especialidades</h2>
          <span className="text-[10px] text-slate-400">6 servicios disponibles</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {SERVICES.map((s) => (
            <button
              key={s.name}
              onClick={() => setSelectedService(s.name)}
              className={`rounded-xl border p-3 text-left transition-all ${
                selectedService === s.name ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-slate-200 hover:border-emerald-300 hover:shadow-sm"
              }`}
            >
              <div className={`flex size-9 items-center justify-center rounded-lg ${s.color}`}>
                <s.icon className="size-4 text-white" />
              </div>
              <p className="mt-2 text-xs font-semibold">{s.name}</p>
              <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{s.desc}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">{s.duration}</span>
                <span className="text-xs font-bold text-emerald-600">{s.price}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Booking flow */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4"
          >
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">Agendar: {selectedService}</h3>
                <button onClick={() => setSelectedService(null)} className="text-[10px] text-slate-400">Cancelar</button>
              </div>

              {/* Modality */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setModality("video")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-[11px] font-medium transition-all ${
                    modality === "video" ? "border-emerald-500 bg-white text-emerald-600 shadow-sm" : "border-slate-200 bg-white/50 text-slate-500"
                  }`}
                >
                  <Video className="size-3.5" /> Videollamada
                </button>
                <button
                  onClick={() => setModality("presencial")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-[11px] font-medium transition-all ${
                    modality === "presencial" ? "border-emerald-500 bg-white text-emerald-600 shadow-sm" : "border-slate-200 bg-white/50 text-slate-500"
                  }`}
                >
                  <User className="size-3.5" /> Presencial
                </button>
              </div>

              {/* Date */}
              <p className="text-[10px] font-medium text-slate-500 mb-1.5">Selecciona una fecha</p>
              <div className="flex gap-1.5 mb-3">
                {DATES.map((d) => (
                  <button
                    key={d.num}
                    onClick={() => setSelectedDate(d.num)}
                    className={`flex flex-1 flex-col items-center rounded-lg border py-1.5 transition-all ${
                      selectedDate === d.num ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    <span className="text-[9px]">{d.day}</span>
                    <span className="text-sm font-bold">{d.num}</span>
                  </button>
                ))}
              </div>

              {/* Slots */}
              <p className="text-[10px] font-medium text-slate-500 mb-1.5">Horarios disponibles</p>
              <div className="grid grid-cols-4 gap-1.5">
                {SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-lg border py-1.5 text-[11px] font-medium transition-all ${
                      selectedSlot === slot ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              {selectedSlot && (
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleBook}
                  className="mt-3 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
                >
                  Confirmar cita · {selectedService} · {selectedSlot}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Doctors */}
      <div className="px-4 py-6">
        <h2 className="text-base font-bold mb-3">Nuestro equipo médico</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DOCTORS.map((d) => (
            <div key={d.name} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:shadow-sm transition-all">
              <div className={`flex size-12 items-center justify-center rounded-full ${d.color}`}>
                <User className="size-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">{d.name}</p>
                <p className="text-[10px] text-slate-400">{d.spec} · {d.exp} de experiencia</p>
                <div className="mt-0.5 flex items-center gap-1">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-medium">{d.rating}</span>
                  <span className="text-[9px] text-slate-400">({d.reviews})</span>
                </div>
              </div>
              <ChevronRight className="size-4 text-slate-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-4 py-6 bg-slate-50">
        <h2 className="text-base font-bold mb-3">Lo que dicen nuestros pacientes</h2>
        <div className="space-y-2.5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{t.name}</span>
                <div className="flex">{[1,2,3,4,5].map((s) => <Star key={s} className="size-3 fill-amber-400 text-amber-400" />)}</div>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 italic">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Stethoscope className="size-4 text-white" />
            </div>
            <span className="font-bold text-sm">Clínica Plus</span>
          </div>
          <div className="text-[10px] text-slate-400 space-y-0.5 text-right">
            <p className="flex items-center gap-1 justify-end"><MapPin className="size-3" /> Cra 15 #93-47, Bogotá</p>
            <p className="flex items-center gap-1 justify-end"><Phone className="size-3" /> 319 635 4992</p>
            <p className="flex items-center gap-1 justify-end"><Clock className="size-3" /> Lun-Vie 8am-6pm</p>
          </div>
        </div>
      </footer>

      {/* Booking confirmation */}
      <AnimatePresence>
        {booking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="rounded-2xl bg-white p-6 text-center max-w-xs"
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100">
                <Check className="size-7 text-emerald-600" />
              </div>
              <h3 className="mt-3 text-base font-bold">¡Cita confirmada!</h3>
              <p className="mt-1 text-xs text-slate-500">{selectedService}</p>
              <p className="text-xs font-semibold text-emerald-600">{modality === "video" ? "Videollamada" : "Presencial"} · {selectedSlot}</p>
              <div className="mt-3 rounded-lg bg-slate-50 p-2 text-[10px] text-slate-500">
                Recibirás confirmación por WhatsApp con el link de la consulta
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
