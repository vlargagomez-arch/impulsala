"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Mail,
  Phone,
  Globe,
  Sparkles,
  Target,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { useFetch } from "./types";

type Prospect = {
  businessName: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  recommendedService: "web" | "seo" | "ads" | "ia";
  potentialScore: number;
  subject: string;
  proposal: string;
  sourceUrl: string;
  sourceDomain: string;
};

type ProspecionResponse = {
  prospects: Prospect[];
  total: number;
  query: string;
  location: string;
  message?: string;
};

const SERVICE_LABELS = {
  web: "Desarrollo Web",
  seo: "SEO",
  ads: "Campañas Ads",
  ia: "Automatización IA",
};

const SERVICE_COLORS = {
  web: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  seo: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  ads: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  ia: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
};

export function CrmProspeccion() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Bogotá, Colombia");
  const [limit, setLimit] = useState(5);
  const [focusFlaws, setFocusFlaws] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);
    setErrorType(null);
    setProspects([]);

    try {
      const res = await fetch("/api/prospeccion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), location, limit, focusFlaws }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errorType) setErrorType(data.errorType);
        throw new Error(data.error || "Error en la búsqueda");
      }

      setProspects(data.prospects || []);

      if (data.message) {
        setError(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const copyProposal = (prospect: Prospect, idx: number) => {
    const text = `Subject: ${prospect.subject}\n\n${prospect.proposal}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Sugerencias rápidas de búsqueda
  const QUICK_SEARCHES = [
    "restaurantes",
    "inmobiliarias",
    "gimnasios",
    "clínicas dentales",
    "abogados",
    "peluquerías",
    "tiendas de ropa",
    "veterinarias",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-violet-500/30">
            <Target className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Prospección con IA</h2>
            <p className="text-xs text-muted-foreground">
              Buscá negocios en Google, extraé sus contactos y generá propuestas personalizadas con IA.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Search className="w-3.5 h-3.5 text-violet-400" />
            Búsqueda automática
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            IA genera propuestas
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            Listo para enviar
          </span>
        </div>
      </div>

      {/* Formulario de búsqueda */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Tipo de negocio a buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: restaurantes, gimnasios, inmobiliarias..."
                className="w-full pl-10 pr-3 py-2.5 bg-card/60 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Ubicación
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bogotá, Colombia"
                className="w-full pl-10 pr-3 py-2.5 bg-card/60 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">Cantidad:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="px-3 py-2 bg-card/60 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              disabled={loading}
            >
              <option value={3}>3 prospectos</option>
              <option value={5}>5 prospectos</option>
              <option value={10}>10 prospectos</option>
              <option value={15}>15 prospectos</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Buscando y generando propuestas...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Buscar prospectos
              </>
            )}
          </button>
        </div>

        {/* Quick searches */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground">Búsquedas rápidas:</span>
          {QUICK_SEARCHES.map((qs) => (
            <button
              key={qs}
              type="button"
              onClick={() => setQuery(qs)}
              disabled={loading}
              className="text-xs px-2.5 py-1 rounded-full border border-border/60 bg-card/40 text-muted-foreground hover:border-violet-500/40 hover:text-violet-300 transition-colors disabled:opacity-50"
            >
              {qs}
            </button>
          ))}
        </div>

        {/* Checkbox: focus on flaws */}
        <label className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 cursor-pointer hover:bg-violet-500/15 transition-colors">
          <input
            type="checkbox"
            checked={focusFlaws}
            onChange={(e) => setFocusFlaws(e.target.checked)}
            disabled={loading}
            className="w-4 h-4 rounded border-violet-500/40 bg-background text-violet-500 focus:ring-violet-500/50 cursor-pointer"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-violet-400" />
              Buscar negocios con falencias digitales
            </span>
            <span className="text-[11px] text-muted-foreground block mt-0.5">
              Prioriza negocios sin web, sin email, no aparecen en Google, o con problemas digitales. Son los que más necesitan tus servicios.
            </span>
          </div>
        </label>
      </form>

      {/* Error */}
      {error && (
        <div className={`rounded-xl border p-4 flex items-start gap-3 ${
          errorType === "ZAI_CONFIG_MISSING"
            ? "bg-violet-500/10 border-violet-500/30"
            : "bg-amber-500/10 border-amber-500/30"
        }`}>
          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            errorType === "ZAI_CONFIG_MISSING" ? "text-violet-400" : "text-amber-400"
          }`} />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{error}</p>
            {errorType === "ZAI_CONFIG_MISSING" ? (
              <div className="text-xs text-muted-foreground mt-2 space-y-1">
                <p>Esta función usa IA de Z.ai que solo está disponible en este entorno de desarrollo.</p>
                <p>Para usar la prospección IA, ejecutá el proyecto localmente con <code className="px-1 py-0.5 bg-muted rounded text-foreground">npm run dev</code> en tu computadora con el SDK configurado, o usá los guiones de Marketing que ya están listos.</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                Probá con otra búsqueda o reducí la cantidad de prospectos.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
          <p className="text-sm text-muted-foreground">Buscando negocios y generando propuestas...</p>
          <p className="text-xs text-muted-foreground/70">Esto puede tardar 30-60 segundos según la cantidad.</p>
        </div>
      )}

      {/* Resultados */}
      {!loading && prospects.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {prospects.length} prospectos encontrados
            </h3>
            <p className="text-xs text-muted-foreground">
              Score promedio: {(prospects.reduce((s, p) => s + p.potentialScore, 0) / prospects.length).toFixed(1)}/10
            </p>
          </div>

          {prospects.map((prospect, idx) => {
            const isExpanded = expandedIdx === idx;
            const isCopied = copiedIdx === idx;
            return (
              <div
                key={idx}
                className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl overflow-hidden transition-all hover:border-violet-500/40"
              >
                {/* Header del prospecto */}
                <div className="p-4 cursor-pointer" onClick={() => setExpandedIdx(isExpanded ? null : idx)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="text-sm font-bold text-foreground truncate">
                          {prospect.businessName}
                        </h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${SERVICE_COLORS[prospect.recommendedService]}`}>
                          {SERVICE_LABELS[prospect.recommendedService]}
                        </span>
                      </div>

                      {/* Contacto */}
                      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                        {prospect.email && (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Mail className="w-3 h-3" />
                            {prospect.email}
                          </span>
                        )}
                        {prospect.phone && (
                          <span className="flex items-center gap-1 text-sky-400">
                            <Phone className="w-3 h-3" />
                            {prospect.phone}
                          </span>
                        )}
                        {prospect.website && (
                          <a
                            href={prospect.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-violet-400 hover:underline"
                          >
                            <Globe className="w-3 h-3" />
                            {prospect.sourceDomain}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex-shrink-0 text-center">
                      <div className={`text-2xl font-bold ${
                        prospect.potentialScore >= 8 ? "text-emerald-400" :
                        prospect.potentialScore >= 5 ? "text-amber-400" :
                        "text-rose-400"
                      }`}>
                        {prospect.potentialScore}
                      </div>
                      <div className="text-[9px] text-muted-foreground uppercase">score</div>
                    </div>
                  </div>

                  {/* Subject preview */}
                  <div className="mt-3 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Mail className="w-3 h-3 text-violet-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                        Asunto del email
                      </span>
                    </div>
                    <p className="text-xs text-foreground/90 font-medium">{prospect.subject}</p>
                  </div>
                </div>

                {/* Detalle expandible */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-border/40 pt-3">
                    <div>
                      <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                        Propuesta personalizada generada con IA
                      </h4>
                      <div className="rounded-lg bg-background/40 border border-border/40 p-3 space-y-3">
                        {prospect.proposal.split("\n").map((line, i) => (
                          <p key={i} className="text-xs text-foreground/90 leading-relaxed">
                            {line || "\u00A0"}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyProposal(prospect, idx);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4" />
                            ¡Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copiar propuesta
                          </>
                        )}
                      </button>

                      {prospect.email && (
                        <a
                          href={`mailto:${prospect.email}?subject=${encodeURIComponent(prospect.subject)}&body=${encodeURIComponent(prospect.proposal)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all"
                        >
                          <Mail className="w-4 h-4" />
                          Enviar email
                        </a>
                      )}

                      {prospect.phone && (
                        <a
                          href={`https://wa.me/${prospect.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(prospect.proposal)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all"
                        >
                          <Phone className="w-4 h-4" />
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && prospects.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
            <Target className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-sm font-bold text-foreground mb-1">Listo para prospectar</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Escribí el tipo de negocio que querés buscar (ej: "restaurantes", "gimnasios", "abogados") y la IA va a:
          </p>
          <ul className="text-xs text-muted-foreground mt-3 space-y-1 text-left max-w-md mx-auto list-decimal list-inside">
            <li>Buscar negocios en Google</li>
            <li>Extraer nombre, email, teléfono y web</li>
            <li>Analizar qué servicio de Impulsala les conviene</li>
            <li>Generar propuesta personalizada en español</li>
            <li>Calificar el prospecto con score 1-10</li>
          </ul>
        </div>
      )}
    </div>
  );
}
