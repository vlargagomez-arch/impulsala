import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Total leads y leads por estado
  const [totalLeads, newLeads, contactedLeads, scheduledLeads, convertedLeads, lostLeads] =
    await Promise.all([
      db.bookingLead.count(),
      db.bookingLead.count({ where: { status: "new" } }),
      db.bookingLead.count({ where: { status: "contacted" } }),
      db.bookingLead.count({ where: { status: "scheduled" } }),
      db.bookingLead.count({ where: { status: "converted" } }),
      db.bookingLead.count({ where: { status: "lost" } }),
    ]);

  // Leads de hoy y de esta semana
  const [leadsToday, leadsThisWeek, leadsThisMonth] = await Promise.all([
    db.bookingLead.count({ where: { createdAt: { gte: todayStart } } }),
    db.bookingLead.count({ where: { createdAt: { gte: weekStart } } }),
    db.bookingLead.count({ where: { createdAt: { gte: monthStart } } }),
  ]);

  // Citas
  const [totalAppointments, upcomingAppointments, completedAppointments, cancelledAppointments] =
    await Promise.all([
      db.appointment.count(),
      db.appointment.count({ where: { status: "confirmed", scheduledAt: { gte: now } } }),
      db.appointment.count({ where: { status: "completed" } }),
      db.appointment.count({ where: { status: "cancelled" } }),
    ]);

  // Newsletter
  const [totalSubscribers, activeSubscribers, subscribersThisMonth] = await Promise.all([
    db.newsletter.count(),
    db.newsletter.count({ where: { status: "active" } }),
    db.newsletter.count({ where: { createdAt: { gte: monthStart } } }),
  ]);

  // Valor del pipeline (suma de estimatedValue de leads activos)
  const pipelineValue = await db.bookingLead.aggregate({
    _sum: { estimatedValue: true },
    where: { status: { in: ["new", "contacted", "scheduled"] } },
  });

  // Ingresos estimados (converted leads)
  const wonValue = await db.bookingLead.aggregate({
    _sum: { estimatedValue: true },
    where: { status: "converted" },
  });

  // Follow-ups pendientes
  const pendingFollowUps = await db.followUp.count({
    where: { completed: false, scheduledAt: { lte: now } },
  });

  // Leads por día (últimos 14 días)
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const recentLeads = await db.bookingLead.findMany({
    where: { createdAt: { gte: fourteenDaysAgo } },
    select: { createdAt: true, status: true },
  });

  const leadsByDay: { date: string; total: number; converted: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const dayLeads = recentLeads.filter(
      (l) => l.createdAt >= dayStart && l.createdAt < dayEnd
    );
    leadsByDay.push({
      date: dayStart.toISOString().slice(0, 10),
      total: dayLeads.length,
      converted: dayLeads.filter((l) => l.status === "converted").length,
    });
  }

  // Conversión: converted / total
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  return NextResponse.json({
    leads: {
      total: totalLeads,
      byStatus: {
        new: newLeads,
        contacted: contactedLeads,
        scheduled: scheduledLeads,
        converted: convertedLeads,
        lost: lostLeads,
      },
      today: leadsToday,
      thisWeek: leadsThisWeek,
      thisMonth: leadsThisMonth,
      byDay: leadsByDay,
    },
    appointments: {
      total: totalAppointments,
      upcoming: upcomingAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
    },
    newsletter: {
      total: totalSubscribers,
      active: activeSubscribers,
      thisMonth: subscribersThisMonth,
    },
    pipeline: {
      value: pipelineValue._sum.estimatedValue || 0,
      wonValue: wonValue._sum.estimatedValue || 0,
      pendingFollowUps,
    },
    conversionRate,
  });
}
