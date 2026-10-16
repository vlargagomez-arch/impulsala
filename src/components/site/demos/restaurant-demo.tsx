"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils, Clock, MapPin, Phone, Star, ShoppingBag, X, Plus,
  Heart, Flame, Leaf, ChevronRight, Award, Users, Calendar, Check,
} from "lucide-react";

type Dish = {
  id: number;
  name: string;
  desc: string;
  price: number;
  category: string;
  color: string;
  popular?: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
};

const DISHES: Dish[] = [
  { id: 1, name: "Bandeja Paisa", desc: "Frijoles, arroz, carne molida, chicharrón, huevo, plátano, arepa y aguacate", price: 28000, category: "Platos fuertes", color: "from-amber-400 to-orange-500", popular: true },
  { id: 2, name: "Ajiaco Santafereño", desc: "Sopa tradicional con pollo, tres papas, guascas, crema y alcaparras", price: 25000, category: "Sopas", color: "from-yellow-400 to-amber-500", popular: true },
  { id: 3, name: "Sancocho Trifásico", desc: "Sopa con res, cerdo y gallina, yuca, plátano, aguacate y arroz", price: 30000, category: "Sopas", color: "from-orange-400 to-red-500" },
  { id: 4, name: "Tacos al Pastor", desc: "3 tacos de cerdo marinado, piña, cilantro, cebolla y salsa de chile", price: 22000, category: "Platos fuertes", color: "from-red-400 to-rose-500", spicy: true },
  { id: 5, name: "Ensalada César", desc: "Lechuga romana, pollo grillé, crutones, parmesano y aderezo césar", price: 18000, category: "Entradas", color: "from-green-400 to-emerald-500", vegetarian: true },
  { id: 6, name: "Arepa Rellena", desc: "Arepa con queso costeño, carne desmechada y aguacate", price: 15000, category: "Entradas", color: "from-yellow-400 to-amber-400", popular: true },
  { id: 7, name: "Limonada de Coco", desc: "Bebida fría con coco fresco, limón natural y hielo", price: 8000, category: "Bebidas", color: "from-cyan-400 to-blue-500", vegetarian: true },
  { id: 8, name: "Postre Tres Leches", desc: "Bizcocho bañado en tres leches, crema y coronado con cereza", price: 12000, category: "Postres", color: "from-pink-400 to-rose-500", vegetarian: true },
];

const CATEGORIES = ["Todos", "Platos fuertes", "Sopas", "Entradas", "Bebidas", "Postres"];

export function RestaurantDemo() {
  const [activeCat, setActiveCat] = useState("Todos");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [reservation, setReservation] = useState(false);
  const [resConfirmed, setResConfirmed] = useState(false);

  const filtered = activeCat === "Todos" ? DISHES : DISHES.filter((d) => d.category === activeCat);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const d = DISHES.find((di) => di.id === Number(id));
    return sum + (d?.price ?? 0) * qty;
  }, 0);

  const fmt = (n: number) => `$${n.toLocaleString("es-CO")}`;

  return (
    <div className="bg-white text-slate-900 min-h-[600px] relative">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <Utensils className="size-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight">Sabor Medellín</span>
              <p className="text-[9px] text-slate-400">Comida colombiana tradicional</p>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-4 text-[11px] font-medium text-slate-600">
            <a className="hover:text-orange-600 cursor-pointer">Inicio</a>
            <a className="hover:text-orange-600 cursor-pointer">Menú</a>
            <a className="hover:text-orange-600 cursor-pointer">Reservas</a>
            <a className="hover:text-orange-600 cursor-pointer">Contacto</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCart(true)}
              className="relative flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] text-white"
            >
              <ShoppingBag className="size-3.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setReservation(true)}
              className="rounded-full bg-orange-500 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-orange-600"
            >
              Reservar
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-44 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-500 to-amber-600" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 70%, white 2px, transparent 2px)", backgroundSize: "25px 25px" }} />
        <div className="relative flex h-full flex-col items-center justify-center text-white text-center px-4">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold backdrop-blur-sm">⭐ 4.8 · #1 en comida colombiana</span>
          <h1 className="mt-2 text-2xl font-bold">Sabores que enamoran</h1>
          <p className="text-xs text-orange-50/90">Auténtica comida colombiana en el corazón de Bogotá</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => document.getElementById("menu-demo")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold text-orange-600 hover:bg-orange-50"
            >
              Ver menú
            </button>
            <button
              onClick={() => setReservation(true)}
              className="rounded-full border border-white/30 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-white/10"
            >
              Reservar mesa
            </button>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-around border-b border-slate-100 px-4 py-2.5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1"><Clock className="size-3 text-orange-500" /> 11am-10pm</span>
        <span className="flex items-center gap-1"><MapPin className="size-3 text-orange-500" /> Cra 15 #93-47</span>
        <span className="flex items-center gap-1"><Phone className="size-3 text-orange-500" /> 319 635 4992</span>
        <span className="hidden sm:flex items-center gap-1"><Users className="size-3 text-orange-500" /> Cap. 80 personas</span>
      </div>

      {/* Features */}
      <div className="px-4 py-4 grid grid-cols-3 gap-2">
        {[
          { icon: Award, title: "Premio 2024", sub: "Mejor restaurante" },
          { icon: Leaf, title: "Ingredientes", sub: "100% frescos" },
          { icon: Flame, title: "Recetas", sub: "Tradicionales" },
        ].map((f) => (
          <div key={f.title} className="flex flex-col items-center rounded-xl border border-slate-100 py-2.5">
            <f.icon className="size-5 text-orange-500" />
            <p className="mt-1 text-[10px] font-semibold">{f.title}</p>
            <p className="text-[8px] text-slate-400">{f.sub}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div id="menu-demo" className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold">Nuestro menú</h2>
          <span className="text-[10px] text-slate-400">{filtered.length} platos</span>
        </div>

        {/* Categories */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                activeCat === cat ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dishes */}
        <div className="space-y-2">
          {filtered.map((dish) => (
            <motion.div
              key={dish.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5 hover:border-orange-300 hover:shadow-sm transition-all"
            >
              {/* Visual */}
              <div className={`relative flex size-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${dish.color}`}>
                <span className="text-2xl">🍽️</span>
                {dish.popular && (
                  <span className="absolute -top-1 -left-1 rounded-full bg-orange-500 px-1.5 py-0.5 text-[7px] font-bold text-white">TOP</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold">{dish.name}</h4>
                  {dish.vegetarian && <Leaf className="size-3 text-green-500" />}
                  {dish.spicy && <Flame className="size-3 text-red-500" />}
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1">{dish.desc}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-bold">{fmt(dish.price)}</span>
                  <span className="text-[9px] text-slate-400">{dish.category}</span>
                </div>
              </div>

              {/* Add button */}
              <button
                onClick={() => setCart((c) => ({ ...c, [dish.id]: (c[dish.id] ?? 0) + 1 }))}
                className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white hover:bg-orange-600"
              >
                <Plus className="size-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gallery section */}
      <div className="px-4 py-4 bg-slate-50">
        <h2 className="text-base font-bold mb-3">Galería</h2>
        <div className="grid grid-cols-3 gap-2">
          {["🍽️", "🥘", "🌮", "🥗", "🍰", "🥤"].map((emoji, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-orange-200 to-amber-300 flex items-center justify-center text-3xl">
              {emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-orange-500 flex items-center justify-center">
              <Utensils className="size-4 text-white" />
            </div>
            <span className="font-bold text-sm">Sabor Medellín</span>
          </div>
          <div className="text-[10px] text-slate-400 space-y-0.5 text-right">
            <p className="flex items-center gap-1 justify-end"><MapPin className="size-3" /> Cra 15 #93-47, Bogotá</p>
            <p className="flex items-center gap-1 justify-end"><Phone className="size-3" /> 319 635 4992</p>
            <p className="flex items-center gap-1 justify-end"><Clock className="size-3" /> Lun-Dom 11am-10pm</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800 text-[9px] text-slate-500 text-center">
          © 2025 Sabor Medellín · Hecho con ❤️ por Impulsala
        </div>
      </footer>

      {/* Cart */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 bg-black/40" onClick={() => setShowCart(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 z-40 rounded-t-2xl bg-white max-h-[70%] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <h3 className="text-sm font-bold">Tu pedido ({cartCount})</h3>
                <button onClick={() => setShowCart(false)} className="size-7 flex items-center justify-center rounded-full bg-slate-100">
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {Object.entries(cart).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <ShoppingBag className="size-10 text-slate-200" />
                    <p className="mt-2 text-xs text-slate-400">Tu pedido está vacío</p>
                  </div>
                ) : (
                  Object.entries(cart).map(([id, qty]) => {
                    const d = DISHES.find((di) => di.id === Number(id));
                    if (!d) return null;
                    return (
                      <div key={id} className="flex items-center gap-2 rounded-lg border border-slate-100 p-2">
                        <div className={`flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${d.color}`}>
                          <span className="text-lg">🍽️</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-semibold">{d.name}</p>
                          <p className="text-[10px] text-slate-400">{fmt(d.price)} · x{qty}</p>
                        </div>
                        <span className="text-xs font-bold">{fmt(d.price * qty)}</span>
                      </div>
                    );
                  })
                )}
              </div>
              {cartCount > 0 && (
                <div className="border-t border-slate-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">Total</span>
                    <span className="text-lg font-bold">{fmt(cartTotal)}</span>
                  </div>
                  <button className="w-full rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
                    Pedir por WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reservation */}
      <AnimatePresence>
        {reservation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
            onClick={() => { setReservation(false); setResConfirmed(false); }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-full max-w-sm rounded-2xl bg-white p-5"
              onClick={(e) => e.stopPropagation()}
            >
              {resConfirmed ? (
                <div className="text-center py-4">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-green-100">
                    <Check className="size-7 text-green-600" />
                  </div>
                  <h3 className="mt-3 text-base font-bold">¡Reserva confirmada!</h3>
                  <p className="mt-1 text-xs text-slate-500">Te enviaremos los detalles por WhatsApp</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold">Reservar mesa</h3>
                    <button onClick={() => setReservation(false)} className="size-7 flex items-center justify-center rounded-full bg-slate-100">
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input placeholder="Nombre completo" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-orange-400" />
                    <input placeholder="Teléfono" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-orange-400" />
                    <div className="flex gap-2">
                      <input type="date" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-orange-400" />
                      <select className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs">
                        <option>2 personas</option>
                        <option>4 personas</option>
                        <option>6 personas</option>
                        <option>8+ personas</option>
                      </select>
                    </div>
                    <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs">
                      <option>12:00 pm</option>
                      <option>1:00 pm</option>
                      <option>2:00 pm</option>
                      <option>7:00 pm</option>
                      <option>8:00 pm</option>
                      <option>9:00 pm</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setResConfirmed(true)}
                    className="mt-4 w-full rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                  >
                    Confirmar reserva
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
