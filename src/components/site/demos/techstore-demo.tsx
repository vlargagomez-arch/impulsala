"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Search, Star, X, Plus, Minus, Menu, ChevronRight,
  Zap, Truck, Shield, CreditCard, Heart, ArrowRight, Check
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  category: string;
  rating: number;
  reviews: number;
  color: string;
  badge?: string;
  specs: string[];
};

const PRODUCTS: Product[] = [
  { id: 1, name: "AirPods Pro 2", brand: "Apple", price: 949000, oldPrice: 1099000, category: "Audio", rating: 4.9, reviews: 3421, color: "from-slate-200 to-slate-300", badge: "-14%", specs: ["ANC", "Spatial Audio", "USB-C"] },
  { id: 2, name: "Galaxy Watch 6", brand: "Samsung", price: 1299000, oldPrice: 1599000, category: "Wearables", rating: 4.7, reviews: 892, color: "from-violet-200 to-violet-300", badge: "-19%", specs: ["AMOLED", "GPS", "ECG"] },
  { id: 3, name: "MX Master 3S", brand: "Logitech", price: 419000, category: "Accesorios", rating: 4.8, reviews: 1543, color: "from-slate-300 to-slate-400", specs: ["8K DPI", "Silent", "USB-C"] },
  { id: 4, name: "Keychron K2", brand: "Keychron", price: 549000, oldPrice: 649000, category: "Accesorios", rating: 4.9, reviews: 678, color: "from-blue-200 to-blue-300", badge: "-15%", specs: ["Hot-swap", "Bluetooth", "RGB"] },
  { id: 5, name: "Sony A7 IV", brand: "Sony", price: 8499000, category: "Cámaras", rating: 5.0, reviews: 234, color: "from-slate-400 to-slate-500", badge: "Pro", specs: ["33MP", "4K 60p", "IBIS"] },
  { id: 6, name: "HomePod mini", brand: "Apple", price: 549000, category: "Audio", rating: 4.6, reviews: 2103, color: "from-slate-200 to-slate-300", specs: ["Siri", "Smart Home", "360°"] },
  { id: 7, name: "iPad Air M2", brand: "Apple", price: 2199000, oldPrice: 2399000, category: "Tablets", rating: 4.9, reviews: 1876, color: "from-blue-200 to-cyan-200", badge: "-8%", specs: ["M2", "11\"", "256GB"] },
  { id: 8, name: "Anker 737 Charger", brand: "Anker", price: 199000, category: "Accesorios", rating: 4.7, reviews: 543, color: "from-slate-300 to-slate-400", specs: ["120W", "GaN", "3 ports"] },
];

const CATEGORIES = [
  { name: "Todos", count: 8 },
  { name: "Audio", count: 2 },
  { name: "Wearables", count: 1 },
  { name: "Accesorios", count: 3 },
  { name: "Cámaras", count: 1 },
  { name: "Tablets", count: 1 },
];

export function TechStoreDemo() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === "Todos" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find((pr) => pr.id === Number(id));
    return sum + (p?.price ?? 0) * qty;
  }, 0);

  const fmt = (n: number) => `$${n.toLocaleString("es-CO")}`;

  return (
    <div className="bg-white text-slate-900 min-h-[600px] relative">
      {/* Announcement bar */}
      <div className="bg-slate-900 text-white text-[10px] py-2 px-4 flex items-center justify-center gap-2">
        <Zap className="size-3 text-cyan-400" />
        <span>Envío GRATIS en pedidos +$200.000 · Entrega same-day en Bogotá · 12 meses sin intereses</span>
      </div>

      {/* Header */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-20">
        <div className="px-4 py-3 flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="size-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Zap className="size-4 text-cyan-400" fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tight">TechStore</span>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600">
            <a className="hover:text-slate-900 cursor-pointer">Tienda</a>
            <a className="hover:text-slate-900 cursor-pointer">Ofertas</a>
            <a className="hover:text-slate-900 cursor-pointer">Marcas</a>
            <a className="hover:text-slate-900 cursor-pointer">Soporte</a>
          </nav>

          <div className="flex-1 relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos o marcas..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs text-white"
          >
            <ShoppingBag className="size-4" />
            <span className="hidden sm:inline font-medium">Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative px-6 py-10 sm:py-14 flex items-center justify-between gap-4">
          <div className="text-white max-w-sm">
            <span className="inline-block rounded-full bg-cyan-500/20 px-3 py-1 text-[10px] font-semibold text-cyan-400 mb-3">BLACK WEEK · HASTA 40% OFF</span>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Tecnología premium al mejor precio</h1>
            <p className="mt-2 text-xs text-slate-300">Apple, Sony, Samsung, Logitech y más. Envío gratis y garantía oficial.</p>
            <button className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cyan-500 px-5 py-2 text-xs font-semibold text-white hover:bg-cyan-400">
              Ver ofertas <ArrowRight className="size-3.5" />
            </button>
          </div>
          <div className="hidden sm:block text-7xl opacity-20">📱</div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-b border-slate-100 px-4 py-3 grid grid-cols-4 gap-2">
        {[
          { icon: Truck, label: "Envío gratis", sub: "+$200k" },
          { icon: Shield, label: "Garantía", sub: "12 meses" },
          { icon: CreditCard, label: "12 cuotas", sub: "sin interés" },
          { icon: Check, label: "100% original", sub: "Apple/Sony" },
        ].map((b) => (
          <div key={b.label} className="flex flex-col items-center text-center">
            <b.icon className="size-4 text-slate-700" />
            <p className="mt-0.5 text-[10px] font-semibold">{b.label}</p>
            <p className="text-[8px] text-slate-400">{b.sub}</p>
          </div>
        ))}
      </div>

      {/* Layout: sidebar + products */}
      <div className="flex gap-4 px-4 py-5">
        {/* Sidebar */}
        <aside className="hidden sm:block w-40 flex-shrink-0">
          <h3 className="text-xs font-bold text-slate-900 mb-2">Categorías</h3>
          <div className="space-y-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] transition-colors ${
                  activeCategory === cat.name
                    ? "bg-slate-900 text-white font-medium"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat.name}
                <span className={`text-[9px] ${activeCategory === cat.name ? "text-slate-300" : "text-slate-400"}`}>{cat.count}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-gradient-to-br from-cyan-50 to-slate-50 border border-cyan-100 p-3">
            <p className="text-[10px] font-bold text-slate-900">¿Necesitas ayuda?</p>
            <p className="text-[9px] text-slate-500 mt-0.5">Chat en vivo disponible</p>
            <button className="mt-2 w-full rounded-lg bg-cyan-500 py-1.5 text-[10px] font-semibold text-white">Chatear</button>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {/* Mobile categories */}
          <div className="sm:hidden flex gap-1.5 overflow-x-auto pb-2 mb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${
                  activeCategory === cat.name ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500">{filtered.length} productos</p>
            <select className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] text-slate-600">
              <option>Más relevantes</option>
              <option>Menor precio</option>
              <option>Mayor precio</option>
              <option>Mejor valorados</option>
            </select>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer"
                onClick={() => setSelected(product)}
              >
                {/* Image area */}
                <div className={`relative h-28 bg-gradient-to-br ${product.color} flex items-center justify-center`}>
                  {product.badge && (
                    <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      product.badge.startsWith("-") ? "bg-red-500 text-white" : "bg-slate-900 text-white"
                    }`}>
                      {product.badge}
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="absolute right-2 top-2 size-6 flex items-center justify-center rounded-full bg-white/80 text-slate-400 hover:text-red-500"
                  >
                    <Heart className="size-3.5" />
                  </button>
                  <span className="text-3xl font-black text-slate-700/30">{product.brand[0]}</span>
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wide">{product.brand}</p>
                  <h4 className="text-xs font-semibold leading-tight mt-0.5 line-clamp-1">{product.name}</h4>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`size-2.5 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                      ))}
                    </div>
                    <span className="text-[9px] text-slate-400">({product.reviews})</span>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-slate-900">{fmt(product.price)}</span>
                    {product.oldPrice && <span className="text-[10px] text-slate-400 line-through">{fmt(product.oldPrice)}</span>}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCart((c) => ({ ...c, [product.id]: (c[product.id] ?? 0) + 1 }));
                    }}
                    className="mt-2 w-full rounded-lg bg-slate-900 py-1.5 text-[10px] font-semibold text-white transition-colors group-hover:bg-cyan-500"
                  >
                    Agregar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 px-4 py-4">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>© 2025 TechStore Colombia</span>
          <div className="flex gap-3">
            <span>Visa</span><span>Mastercard</span><span>Stripe</span><span>Apple Pay</span>
          </div>
        </div>
      </footer>

      {/* Product detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-2xl bg-white overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelected(null)} className="absolute right-3 top-3 z-10 size-7 flex items-center justify-center rounded-full bg-white/90 shadow">
                <X className="size-4" />
              </button>
              <div className={`h-40 bg-gradient-to-br ${selected.color} flex items-center justify-center`}>
                <span className="text-6xl font-black text-slate-700/20">{selected.brand[0]}</span>
              </div>
              <div className="p-5">
                <p className="text-[10px] text-slate-400 uppercase">{selected.brand}</p>
                <h3 className="text-lg font-bold">{selected.name}</h3>
                <div className="mt-1 flex items-center gap-1">
                  <div className="flex">{[1,2,3,4,5].map((s) => <Star key={s} className={`size-3.5 ${s <= Math.round(selected.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />)}</div>
                  <span className="text-xs text-slate-400">{selected.rating} · {selected.reviews} reseñas</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{fmt(selected.price)}</span>
                  {selected.oldPrice && <span className="text-sm text-slate-400 line-through">{fmt(selected.oldPrice)}</span>}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selected.specs.map((s) => (
                    <span key={s} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">{s}</span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                  Producto 100% original con garantía oficial de 12 meses. Envío gratis a todo Colombia. Disponible en inventario.
                </p>
                <button
                  onClick={() => {
                    setCart((c) => ({ ...c, [selected.id]: (c[selected.id] ?? 0) + 1 }));
                    setSelected(null);
                    setShowCart(true);
                  }}
                  className="mt-4 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-cyan-500"
                >
                  Agregar al carrito · {fmt(selected.price)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 bg-black/40" onClick={() => setShowCart(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 z-40 w-full max-w-xs bg-white flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <h3 className="text-sm font-bold">Tu carrito ({cartCount})</h3>
                <button onClick={() => setShowCart(false)} className="size-7 flex items-center justify-center rounded-full bg-slate-100">
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {Object.entries(cart).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="size-10 text-slate-200" />
                    <p className="mt-2 text-xs text-slate-400">Tu carrito está vacío</p>
                  </div>
                ) : (
                  Object.entries(cart).map(([id, qty]) => {
                    const p = PRODUCTS.find((pr) => pr.id === Number(id));
                    if (!p) return null;
                    return (
                      <div key={id} className="flex items-center gap-2 rounded-xl border border-slate-100 p-2.5">
                        <div className={`flex size-12 items-center justify-center rounded-lg bg-gradient-to-br ${p.color}`}>
                          <span className="text-lg font-black text-slate-700/30">{p.brand[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{fmt(p.price)}</p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <button onClick={() => setCart((c) => ({ ...c, [id]: Math.max(0, qty - 1) }))} className="size-5 flex items-center justify-center rounded bg-slate-100">
                              <Minus className="size-3" />
                            </button>
                            <span className="text-xs font-medium">{qty}</span>
                            <button onClick={() => setCart((c) => ({ ...c, [id]: qty + 1 }))} className="size-5 flex items-center justify-center rounded bg-slate-100">
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs font-bold">{fmt(p.price * qty)}</p>
                      </div>
                    );
                  })
                )}
              </div>
              {cartCount > 0 && (
                <div className="border-t border-slate-100 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium">{fmt(cartTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Envío</span>
                    <span className="font-medium text-green-600">GRATIS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="text-lg font-bold">{fmt(cartTotal)}</span>
                  </div>
                  <button className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-cyan-500">
                    Finalizar compra
                  </button>
                  <div className="flex items-center justify-center gap-3 text-[9px] text-slate-400">
                    <Shield className="size-3" /> Pago seguro · <CreditCard className="size-3" /> Stripe · <Check className="size-3" /> Garantía
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
