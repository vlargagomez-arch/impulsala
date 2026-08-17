import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

function escapeCsv(value: string): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows: string[][]): string {
  return rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
}

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "leads"; // leads | appointments | newsletter

  let csv = "";
  let filename = "";

  if (type === "leads") {
    const leads = await db.bookingLead.findMany({
      orderBy: { createdAt: "desc" },
    });
    const header = [
      "ID",
      "Nombre",
      "Email",
      "Teléfono",
      "Tipo Negocio",
      "Estado",
      "Valor Estimado (COP)",
      "Fuente",
      "Notas",
      "Creado",
    ];
    const rows = leads.map((l) => [
      l.id,
      l.name,
      l.email,
      l.phone,
      l.hasBusiness,
      l.status,
      String(l.estimatedValue),
      l.source,
      l.notes || "",
      l.createdAt.toISOString(),
    ]);
    csv = toCsv([header, ...rows]);
    filename = `leads-${Date.now()}.csv`;
  } else if (type === "appointments") {
    const appts = await db.appointment.findMany({ orderBy: { scheduledAt: "desc" } });
    const header = [
      "ID",
      "Nombre",
      "Negocio",
      "Email",
      "Teléfono",
      "Tiene Web",
      "Fecha Cita",
      "Duración (min)",
      "Estado",
      "Notas",
      "Creado",
    ];
    const rows = appts.map((a) => [
      a.id,
      a.name,
      a.business,
      a.email,
      a.phone,
      a.hasWebsite,
      a.scheduledAt.toISOString(),
      String(a.durationMin),
      a.status,
      a.notes || "",
      a.createdAt.toISOString(),
    ]);
    csv = toCsv([header, ...rows]);
    filename = `citas-${Date.now()}.csv`;
  } else {
    const subs = await db.newsletter.findMany({ orderBy: { createdAt: "desc" } });
    const header = ["ID", "Email", "Fuente", "Estado", "Creado"];
    const rows = subs.map((s) => [
      s.id,
      s.email,
      s.source,
      s.status,
      s.createdAt.toISOString(),
    ]);
    csv = toCsv([header, ...rows]);
    filename = `newsletter-${Date.now()}.csv`;
  }

  return new NextResponse("\uFEFF" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
