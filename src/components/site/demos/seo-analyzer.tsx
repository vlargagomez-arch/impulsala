"use client";

import { useState, useCallback } from "react";
import {
  Search, Loader2, Shield, Gauge, Smartphone, Globe2, FileSearch, Link2,
  ArrowUpRight, RefreshCw, ChevronDown, ChevronUp, AlertTriangle,
  Wifi, FileCode, Zap, CheckCircle2, XCircle, AlertCircle, ExternalLink,
  Clock, Server, Globe, Lock, Image, Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

/* ===== Types ===== */
interface SubMetric {
  name: string;
  value: string;
  status: "good" | "warning" | "critical";
}

interface CategoryResult {
  label: string;
  score: number;
  status: "good" | "warning" | "critical";
  detail: string;
  recommendation: string;
  icon: string;
  subMetrics: SubMetric[];
}

interface Issue {
  url: string;
  issue: string;
  severity: "high" | "medium" | "low";
  category: string;
}

interface ActionItem {
  priority: number;
  action: string;
  impact: string;
  effort: string;
  category: string;
}

interface APIResponse {
  success: boolean;
  report?: {
    url: string;
    domain: string;
    overallScore: number;
    grade: string;
    categories: CategoryResult[];
    issues: Issue[];
    actions: ActionItem[];
    technologies: { name: string; category: string }[];
    serverInfo: {
      statusCode: number;
      ssl: boolean;
      server: string;
      contentType: string;
      responseTime: number;
      contentLength: string;
    };
    pageContent: {
      title: string | null;
      metaDescription: string | null;
      h1Count: number;
      h1Text: string[];
      h2Count: number;
      h3Count: number;
      imgCount: number;
      imgWithAlt: number;
      linkCount: number;
      externalLinks: number;
      internalLinks: number;
      wordCount: number;
    };
    summary: { good: number; warning: number; critical: number };
  };
  error?: string;
  partialReport?: { url: string; domain: string; statusCode: number; responseTime: number };
}

type Phase = "input" | "loading" | "results" | "error";

const iconMap: Record<string, React.ElementType> = {
  FileSearch, Smartphone, Shield, Gauge, FileCode, Wifi,
};

const statusColors = {
  good: { bg: "bg-neon-green/10", text: "text-neon-green", border: "border-neon-green/20", dot: "bg-neon-green" },
  warning: { bg: "bg-amber-400/10", text: "text-amber-500", border: "border-amber-400/20", dot: "bg-amber-400" },
  critical: { bg: "bg-red-400/10", text: "text-red-400", border: "border-red-400/20", dot: "bg-red-400" },
};

const severityLabels = { high: "Alta", medium: "Media", low: "Baja" };

/* ===== Main Component ===== */
export default function SeoAnalyzerDemo() {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [loadingLog, setLoadingLog] = useState<string[]>([]);
  const [report, setReport] = useState<APIResponse["report"]>();
  const [errorMsg, setErrorMsg] = useState("");
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [showIssues, setShowIssues] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const analyze = useCallback(async () => {
    if (!url.trim()) return;

    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) targetUrl = "https://" + targetUrl;

    setPhase("loading");
    setLoadingLog([]);
    setErrorMsg("");
    setReport(undefined);
    setExpandedCat(null);
    setShowIssues(false);
    setShowActions(false);

    const logs = [
      `Conectando con ${targetUrl}...`,
      "Descargando HTML de la pagina...",
      "Analizando estructura del documento...",
      "Evaluando SEO on-page...",
      "Verificando seguridad y headers...",
      "Detectando tecnologias...",
      "Calculando puntuaciones...",
      "Generando recomendaciones...",
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise(r => setTimeout(r, 40));
      setLoadingLog(prev => [...prev, logs[i]]);
    }

    try {
      const res = await fetch("/api/seo-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data: APIResponse = await res.json();

      if (data.success && data.report) {
        setReport(data.report);
        setPhase("results");
      } else {
        setErrorMsg(data.error || "No se pudo completar el analisis.");
        setPhase("error");
      }
    } catch {
      setErrorMsg("Error de conexion. Intenta de nuevo.");
      setPhase("error");
    }
  }, [url]);

  const reset = () => {
    setPhase("input");
    setUrl("");
    setLoadingLog([]);
    setReport(undefined);
    setErrorMsg("");
    setExpandedCat(null);
    setShowIssues(false);
    setShowActions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") analyze();
  };

  const gradeColor = report
    ? report.overallScore >= 75 ? "text-neon-green" : report.overallScore >= 50 ? "text-amber-500" : "text-red-400"
    : "";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-cyan/5 border border-neon-cyan/20 flex items-center justify-center">
          <Search className="w-5 h-5 text-neon-cyan" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Analizador SEO</h3>
          <p className="text-[10px] text-muted-foreground">Analiza el SEO de cualquier web en segundos</p>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Vamos a analizar el SEO de tu web: title, meta tags, headings, imágenes, SSL y velocidad. Te mostramos las falencias y cómo corregirlas.
      </p>

      {phase === "input" && (
        <Card className="glass-card rounded-2xl p-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/15 to-neon-purple/15 border border-slate-200 flex items-center justify-center">
                <Globe className="w-5 h-5 text-neon-cyan" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Ejemplo: google.com, amazon.com, tu-sitio.com</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
              <div className="flex-1 relative">
                <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="google.com"
                  className="h-11 bg-slate-50 border-slate-200 rounded-xl text-sm pl-10 pr-4 w-full"
                />
              </div>
              <Button
                onClick={analyze}
                disabled={!url.trim()}
                className="glow-button bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-sm px-6 rounded-xl h-11 hover:opacity-90 disabled:opacity-40 transition-all w-full sm:w-auto"
              >
                <Search className="w-4 h-4 mr-2" />
                Analizar
              </Button>
            </div>

            <div className="mt-4 bg-neon-cyan/5 rounded-xl p-3 border border-neon-cyan/10">
              <p className="text-[10px] text-neon-cyan font-semibold flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" />
                Este analizador lee el HTML real de la pagina web y genera un reporte basado en datos verdaderos.
                No inventa datos.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "loading" && (
        <Card className="glass-card rounded-2xl p-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <Loader2 className="w-5 h-5 text-neon-cyan animate-spin" />
              <div>
                <h3 className="text-sm font-bold">Analizando...</h3>
                <p className="text-[10px] text-muted-foreground">Conectando con {url}</p>
              </div>
            </div>

            <div className="bg-[#0a0d14] rounded-xl p-4 font-mono text-[11px] space-y-1 max-h-64 overflow-y-auto">
              {loadingLog.map((log, i) => (
                <div
                  key={i}
                  className={`seo-log-fade-in flex items-center gap-2 ${i === loadingLog.length - 1 ? "text-neon-green" : "text-slate-400"}`}
                >
                  <span className="text-slate-600">{(i + 1).toString().padStart(2, "0")}</span>
                  <span className={i === loadingLog.length - 1 ? "animate-pulse" : ""}>
                    {i === loadingLog.length - 1 ? "→" : "✓"}
                  </span>
                  <span>{log}</span>
                </div>
              ))}
              {loadingLog.length > 0 && (
                <span className="text-neon-cyan animate-pulse inline-block mt-1">▊</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "error" && (
        <Card className="glass-card rounded-2xl p-0 border-red-400/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-400">No se pudo analizar</h3>
                <p className="text-[11px] text-muted-foreground">{errorMsg}</p>
              </div>
            </div>
            <Button onClick={reset} variant="outline" className="border-slate-200 text-sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Intentar con otra URL
            </Button>
          </CardContent>
        </Card>
      )}

      {phase === "results" && report && (
        <div className="space-y-4">
          {/* Score Header */}
          <Card className="glass-card rounded-2xl p-0 border-neon-cyan/20">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Score ring */}
                <div className="relative w-28 h-28 shrink-0">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-100" />
                    <circle
                      cx="50" cy="50" r="42" fill="none" strokeWidth="6" strokeLinecap="round"
                      className={`${report.overallScore >= 75 ? "text-neon-green" : report.overallScore >= 50 ? "text-amber-400" : "text-red-400"}`}
                      stroke="currentColor"
                      strokeDasharray={`${(report.overallScore / 100) * 264} 264`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-extrabold ${gradeColor}`}>{report.overallScore}</span>
                    <span className={`text-sm font-bold ${gradeColor}`}>{report.grade}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h3 className="text-base font-bold">{report.domain}</h3>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">{report.url}</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold ${statusColors.good.bg} ${statusColors.good.text}`}>
                      {report.summary.good} bien
                    </span>
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold ${statusColors.warning.bg} ${statusColors.warning.text}`}>
                      {report.summary.warning} mejorar
                    </span>
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold ${statusColors.critical.bg} ${statusColors.critical.text}`}>
                      {report.summary.critical} critico
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2.5 justify-center sm:justify-start text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Server className="w-3 h-3" />
                      {report.serverInfo.server}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {report.serverInfo.responseTime}ms
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock className={`w-3 h-3 ${report.serverInfo.ssl ? "text-neon-green" : "text-red-400"}`} />
                      {report.serverInfo.ssl ? "SSL Activo" : "Sin SSL"}
                    </span>
                    <span className="flex items-center gap-1">
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      <Image className="w-3 h-3" />
                      {report.serverInfo.contentLength}
                    </span>
                  </div>
                </div>

                <Button onClick={reset} variant="outline" size="sm" className="shrink-0 border-slate-200">
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Page Content Detected */}
          <Card className="glass-card rounded-xl p-0">
            <CardContent className="p-4">
              <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-neon-cyan" />
                Contenido Detectado de la Pagina
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <p className="text-[8px] text-muted-foreground uppercase mb-0.5">Title Tag</p>
                  <p className="text-[11px] font-bold truncate">{report.pageContent.title || "Sin title"}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <p className="text-[8px] text-muted-foreground uppercase mb-0.5">Meta Description</p>
                  <p className="text-[11px] font-bold truncate">{report.pageContent.metaDescription ? `${report.pageContent.metaDescription.substring(0, 60)}...` : "Sin meta desc."}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <p className="text-[8px] text-muted-foreground uppercase mb-0.5">Headings</p>
                  <p className="text-[11px] font-bold">H1:{report.pageContent.h1Count} H2:{report.pageContent.h2Count} H3:{report.pageContent.h3Count}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <p className="text-[8px] text-muted-foreground uppercase mb-0.5">Contenido</p>
                  <p className="text-[11px] font-bold">~{report.pageContent.wordCount} palabras</p>
                </div>
              </div>
              {report.pageContent.h1Text.length > 0 && (
                <div className="mt-2 bg-neon-cyan/5 rounded-lg p-2 border border-neon-cyan/10">
                  <p className="text-[10px] text-neon-cyan font-semibold">H1 encontrado: &quot;{report.pageContent.h1Text[0]}&quot;</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Technologies */}
          {report.technologies.length > 0 && (
            <Card className="glass-card rounded-xl p-0">
              <CardContent className="p-4">
                <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-neon-purple" />
                  Tecnologias Detectadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.technologies.map((t, i) => (
                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 font-medium">
                      {t.name}
                      <span className="text-muted-foreground ml-1">({t.category})</span>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categories */}
          {report.categories.map((cat) => {
            const isExpanded = expandedCat === cat.label;
            const IconComp = iconMap[cat.icon] || Gauge;
            const sc = statusColors[cat.status];

            return (
              <Card key={cat.label} className={`rounded-xl p-0 transition-all ${sc.border}`}>
                <CardContent className="p-4">
                  <button
                    onClick={() => setExpandedCat(isExpanded ? null : cat.label)}
                    className="w-full flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-xl ${sc.bg} flex items-center justify-center shrink-0`}>
                      <IconComp className={`w-5 h-5 ${sc.text}`} />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">{cat.label}</p>
                        <span className={`w-8 h-8 rounded-lg ${sc.bg} ${sc.text} flex items-center justify-center text-sm font-extrabold`}>
                          {cat.score}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{cat.detail}</p>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${sc.bg} ${sc.text} shrink-0`}>
                      {cat.status === "good" ? "Bien" : cat.status === "warning" ? "Mejorar" : "Critico"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  {isExpanded && (
                    <div
                      className="overflow-hidden"
                      style={{
                        transformOrigin: "top",
                        transform: "scaleY(1)",
                        opacity: 1,
                        transition: "transform 0.25s ease, opacity 0.25s ease",
                      }}
                    >
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                        {/* Sub metrics */}
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Metricos Analizados</p>
                          {cat.subMetrics.map((sm, i) => {
                            const smc = statusColors[sm.status];
                            return (
                              <div key={i} className="flex items-center gap-2.5 py-1">
                                <div className={`w-2 h-2 rounded-full ${smc.dot}`} />
                                <span className="text-[11px] font-medium w-28 shrink-0">{sm.name}</span>
                                <span className="text-[10px] text-muted-foreground flex-1 truncate">{sm.value}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${smc.bg} ${smc.text}`}>
                                  {sm.status === "good" ? "OK" : sm.status === "warning" ? "!" : "X"}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Recommendation */}
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Recomendacion</p>
                          <p className="text-[11px] text-foreground leading-relaxed">{cat.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Issues toggle */}
          {report.issues.length > 0 && (
            <Card className="glass-card rounded-xl p-0">
              <CardContent className="p-4">
                <button
                  onClick={() => setShowIssues(!showIssues)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold">Problemas Encontrados ({report.issues.length})</h3>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showIssues ? "rotate-180" : ""}`} />
                </button>
                {showIssues && (
                  <div
                    className="overflow-hidden"
                    style={{
                      transformOrigin: "top",
                      transform: "scaleY(1)",
                      opacity: 1,
                      transition: "transform 0.25s ease, opacity 0.25s ease",
                    }}
                  >
                    <div className="mt-3 space-y-1.5">
                      {report.issues.map((issue, i) => {
                        const sevColor = issue.severity === "high" ? statusColors.critical : issue.severity === "medium" ? statusColors.warning : statusColors.good;
                        return (
                          <div key={i} className="flex items-start gap-2 py-1.5 border-b border-slate-50 last:border-0">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 mt-0.5 ${sevColor.bg} ${sevColor.text}`}>
                              {severityLabels[issue.severity]}
                            </span>
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium">{issue.issue}</p>
                              <p className="text-[9px] text-muted-foreground">{issue.category}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions toggle */}
          {report.actions.length > 0 && (
            <Card className="glass-card rounded-xl p-0">
              <CardContent className="p-4">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-neon-purple" />
                    <h3 className="text-xs font-bold">Plan de Accion ({report.actions.length} pasos)</h3>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showActions ? "rotate-180" : ""}`} />
                </button>
                {showActions && (
                  <div
                    className="overflow-hidden"
                    style={{
                      transformOrigin: "top",
                      transform: "scaleY(1)",
                      opacity: 1,
                      transition: "transform 0.25s ease, opacity 0.25s ease",
                    }}
                  >
                    <div className="mt-3 space-y-2">
                      {report.actions.map((action, i) => (
                        <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                          <span className="w-6 h-6 rounded-lg bg-neon-purple/10 text-neon-purple flex items-center justify-center text-[10px] font-bold shrink-0">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold">{action.action}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-[9px] text-neon-green font-bold">Impacto: {action.impact}</span>
                              <span className="text-[9px] text-muted-foreground">Esfuerzo: {action.effort}</span>
                              <span className="text-[9px] text-neon-cyan font-bold">{action.category}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* CTA */}
          <Card className="rounded-xl p-0 overflow-hidden border-neon-cyan/20 bg-gradient-to-r from-neon-cyan/5 to-neon-purple/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">Analisis basado en datos reales</p>
                  <p className="text-[10px] text-muted-foreground">
                    Se analizo el HTML real de {report.domain} — no se invento ningun dato
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                Este reporte fue generado analizando el codigo fuente HTML real de la pagina, verificando
                meta tags, headers HTTP, estructura de contenido y mas. Impulsala puede implementar
                todas estas mejoras para tu sitio web con resultados reales medibles.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={reset} variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" /> Analizar otra URL
                </Button>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("open-ai-chat", { detail: { diagnostic: true } }));
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-sky-600 text-white font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-violet-500/20 px-4 py-2"
                >
                  Quiero mejorar mi SEO
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <style jsx>{`
        @keyframes seo-log-fade-in {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .seo-log-fade-in {
          animation: seo-log-fade-in 0.2s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .seo-log-fade-in { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
