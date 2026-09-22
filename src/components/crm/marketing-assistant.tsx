"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  Loader2,
  Lightbulb,
  Video,
  Megaphone,
  Mail,
  Search,
} from "lucide-react";

type Message = {
  role: "user" | "bot";
  content: string;
};

const QUICK_PROMPTS = [
  { icon: Video, label: "Guion para video", text: "Generá un guion para video de TikTok sobre desarrollo web para restaurantes" },
  { icon: Megaphone, label: "Copy Instagram", text: "Escribí un copy para Instagram sobre SEO para PYMES en Bogotá" },
  { icon: Mail, label: "Email prospección", text: "Redactá un cold email para una inmobiliaria que no tiene web" },
  { icon: Search, label: "Estrategia SEO", text: "Dame una estrategia SEO completa para un abogado en Bogotá" },
  { icon: Lightbulb, label: "Estrategia de marketing", text: "Soy Hermes, el productor audiovisual. Dame una estrategia de marketing para Impulsala este mes" },
];

export function CrmMarketingAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: `¡Hola Hermes! 👋 Soy **ImpulsalaBot Marketing**, tu asistente experto en marketing digital.

Puedo ayudarte con:

1. **Guiones para videos** — TikTok, Reels, YouTube Shorts (hook + desarrollo + CTA)
2. **Copy para redes sociales** — Instagram, Facebook, LinkedIn, TikTok
3. **Anuncios** — Google Ads, Meta Ads (con título, descripción, CTA)
4. **Email marketing** — cold emails, newsletters, secuencias
5. **Estrategias SEO** — keywords, contenido, linkbuilding
6. **Estrategias de IA** — chatbots, automatización de procesos

¿En qué te puedo ayudar hoy? Decime qué necesitás y te lo genero.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text?: string) => {
    const message = (text || input).trim();
    if (!message || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    try {
      const res = await fetch("/api/marketing-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error");
      }

      setMessages((prev) => [...prev, { role: "bot", content: data.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `❌ Error: ${err instanceof Error ? err.message : "Error desconocido"}. Probá de nuevo.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Render markdown básico (negritas y listas)
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h4 key={i} className="text-sm font-bold text-foreground mt-3 mb-1">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={i} className="text-base font-bold text-foreground mt-3 mb-1">
            {line.replace("## ", "")}
          </h3>
        );
      }
      // List items
      if (line.match(/^\d+\.\s/)) {
        return (
          <div key={i} className="text-sm text-foreground/90 ml-4 my-0.5">
            {renderBold(line)}
          </div>
        );
      }
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return (
          <div key={i} className="text-sm text-foreground/90 ml-4 my-0.5 flex gap-1.5">
            <span className="text-muted-foreground">•</span>
            <span>{renderBold(line.replace(/^[-•]\s/, ""))}</span>
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={i} className="h-2" />;
      }
      // Regular paragraph
      return (
        <p key={i} className="text-sm text-foreground/90 leading-relaxed my-0.5">
          {renderBold(line)}
        </p>
      );
    });
  };

  const renderBold = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border border-violet-500/30 relative">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-card" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              ImpulsalaBot Marketing
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Online
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Tu experto en marketing digital. Generá guiones, copy, anuncios y estrategias.
            </p>
          </div>
        </div>
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt.label}
              onClick={() => send(prompt.text)}
              disabled={loading}
              className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card/40 hover:border-violet-500/40 hover:bg-card/60 transition-all text-left disabled:opacity-50"
            >
              <div className="p-1.5 rounded-lg bg-violet-500/15">
                <prompt.icon className="w-4 h-4 text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">{prompt.label}</p>
                <p className="text-[10px] text-muted-foreground truncate">{prompt.text}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Chat */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl overflow-hidden flex flex-col" style={{ height: "600px" }}>
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  m.role === "user"
                    ? "bg-secondary text-foreground"
                    : "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white"
                }`}
              >
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div
                className={`group relative max-w-[85%] rounded-2xl p-3 ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white"
                    : "bg-secondary/60 text-foreground border border-border/40"
                }`}
              >
                <div className="space-y-1">
                  {m.role === "bot" ? renderContent(m.content) : <p className="text-sm leading-relaxed">{m.content}</p>}
                </div>

                {/* Copy button for bot messages */}
                {m.role === "bot" && (
                  <button
                    onClick={() => copyMessage(m.content, i)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/40 hover:bg-background/60 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copiar respuesta"
                  >
                    {copiedIdx === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-secondary/60 rounded-2xl p-3 border border-border/40">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                  <span className="text-xs text-muted-foreground">Pensando respuesta profesional...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border/40 p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hacé tu consulta de marketing..."
              disabled={loading}
              className="flex-1 px-3 py-2.5 bg-background/60 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
