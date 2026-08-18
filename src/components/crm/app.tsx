"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Trello,
  Calendar,
  Mail,
  Send,
  FileText,
  LogOut,
  Download,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Video,
  Target,
} from "lucide-react";
import { CrmDashboard } from "./dashboard";
import { CrmKanban } from "./kanban";
import { CrmAppointments } from "./appointments";
import { CrmNewsletter } from "./newsletter";
import { CrmCampaigns } from "./campaigns";
import { CrmBlog } from "./blog";
import { CrmMarketing } from "./marketing";
import { CrmProspeccion } from "./prospeccion";

type Tab = "dashboard" | "leads" | "appointments" | "newsletter" | "campaigns" | "marketing" | "prospeccion" | "blog";

const NAV: { id: Tab; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    description: "Métricas y resumen general",
  },
  {
    id: "leads",
    label: "Leads (Kanban)",
    icon: <Trello className="w-4 h-4" />,
    description: "Gestiona tus leads con drag & drop",
  },
  {
    id: "appointments",
    label: "Citas",
    icon: <Calendar className="w-4 h-4" />,
    description: "Citas agendadas por clientes, organizadas por día",
  },
  {
    id: "newsletter",
    label: "Suscriptores",
    icon: <Mail className="w-4 h-4" />,
    description: "Lista de suscriptores al boletín",
  },
  {
    id: "campaigns",
    label: "Enviar Newsletter",
    icon: <Send className="w-4 h-4" />,
    description: "Crea y envía newsletters a tus suscriptores",
  },
  {
    id: "marketing",
    label: "Marketing / Videos",
    icon: <Video className="w-4 h-4" />,
    description: "Guiones para TikTok, Reels y YouTube Shorts por tipo de negocio",
  },
  {
    id: "prospeccion",
    label: "Prospección IA",
    icon: <Target className="w-4 h-4" />,
    description: "Buscá negocios con IA y generá propuestas automáticas",
  },
  {
    id: "blog",
    label: "Blog",
    icon: <FileText className="w-4 h-4" />,
    description: "Crea y administra artículos del blog",
  },
];

export function CrmApp({ userEmail }: { userEmail: string }) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentTab = NAV.find((n) => n.id === tab)!;

  return (
    <div className="min-h-screen bg-background">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl" />
      </div>

      {/* Sidebar móvil overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-card/80 backdrop-blur-xl border-r border-border transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground leading-tight">Impulsala</p>
              <p className="text-xs text-muted-foreground">CRM Admin</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                tab === item.id
                  ? "bg-gradient-to-r from-violet-500/20 to-sky-500/10 text-violet-300 border border-violet-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border space-y-1">
          <a
            href="/api/crm/export?type=leads"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition"
          >
            <Download className="w-4 h-4" />
            Exportar leads CSV
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
          >
            <ExternalLink className="w-4 h-4" />
            Ver web pública
          </a>
          <button
            onClick={async () => {
              try {
                await fetch("/api/logout", { method: "POST" });
              } catch (e) {
                // ignore
              }
              window.location.href = "/crm?ts=" + Date.now();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <div className="lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/70 border-b border-border px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-muted rounded-lg text-muted-foreground"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-foreground">
                  {currentTab.label}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {currentTab.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center text-white text-xs font-bold">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline">{userEmail}</span>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="p-4 lg:p-8">
          {tab === "dashboard" && <CrmDashboard />}
          {tab === "leads" && <CrmKanban />}
          {tab === "appointments" && <CrmAppointments />}
          {tab === "newsletter" && <CrmNewsletter />}
          {tab === "campaigns" && <CrmCampaigns />}
          {tab === "marketing" && <CrmMarketing />}
          {tab === "prospeccion" && <CrmProspeccion />}
          {tab === "blog" && <CrmBlog />}
        </main>
      </div>
    </div>
  );
}
