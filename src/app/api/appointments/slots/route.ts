import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/appointments/slots?days=14
 *
 * Returns available 30-min slots for the next N days (default 14).
 * A slot is "available" if:
 *   - It's in the future (at least 2 hours from now)
 *   - It falls on a weekday (Mon-Fri), between 8am and 6pm COT
 *   - No existing appointment overlaps it
 *
 * This mimics what a real Google Calendar integration would expose via
 * the FreeBusy API. To connect Google Calendar for real, you would:
 *   1. Implement OAuth2 (googleapis npm package)
 *   2. Call calendar.freebusy.query for the agent's primary calendar
 *   3. Subtract those busy times from the candidate slots below
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const daysParam = Number(searchParams.get("days") ?? "14");
  const days = Math.min(30, Math.max(1, daysParam));

  // COT timezone offset = UTC-5
  const COT_OFFSET_MS = -5 * 60 * 60 * 1000;
  const now = new Date();
  // Convert "now" to COT equivalent
  const nowCot = new Date(now.getTime() + COT_OFFSET_MS);

  // Build candidate slots for the next N days
  const candidates: { start: Date; end: Date }[] = [];
  for (let d = 0; d < days; d++) {
    const day = new Date(nowCot);
    day.setUTCDate(day.getUTCDate() + d);
    day.setUTCHours(0, 0, 0, 0);

    // weekday: getUTCDay returns 0..6 (Sun..Sat). We want 1..5 (Mon..Fri)
    const weekday = day.getUTCDay();
    if (weekday === 0 || weekday === 6) continue;

    // Build slots from 8:00 to 17:30 (last slot starts at 17:30 → ends 18:00)
    for (let h = 8; h < 18; h++) {
      for (const m of [0, 30]) {
        if (h === 17 && m === 30) {
          // last slot 17:30 → ends 18:00, OK
        }
        const start = new Date(day);
        start.setUTCHours(h, m, 0, 0);
        const end = new Date(start.getTime() + 30 * 60 * 1000);

        // Skip past slots (at least 2 hours from now in COT)
        const minStart = new Date(nowCot.getTime() + 2 * 60 * 60 * 1000);
        if (start.getTime() < minStart.getTime()) continue;

        candidates.push({ start, end });
      }
    }
  }

  // Convert candidate times back to UTC for DB comparison
  const candidatesUtc = candidates.map((c) => ({
    start: new Date(c.start.getTime() - COT_OFFSET_MS),
    end: new Date(c.end.getTime() - COT_OFFSET_MS),
  }));

  // Find existing appointments in the date range
  const rangeStart = candidatesUtc[0]?.start ?? now;
  const rangeEnd = candidatesUtc[candidatesUtc.length - 1]?.end ?? now;
  const existing = await db.appointment.findMany({
    where: {
      status: "confirmed",
      scheduledAt: {
        gte: rangeStart,
        lte: rangeEnd,
      },
    },
    select: { scheduledAt: true },
  });

  const bookedMs = new Set(existing.map((a) => a.scheduledAt.getTime()));

  // Group available slots by date for the UI
  const groupedByDate = new Map<string, { start: Date; end: Date }[]>();

  for (let i = 0; i < candidates.length; i++) {
    const cand = candidates[i];
    const candUtc = candidatesUtc[i];
    if (bookedMs.has(candUtc.start.getTime())) continue;

    const dateKey = cand.start.toISOString().slice(0, 10); // YYYY-MM-DD (COT)
    if (!groupedByDate.has(dateKey)) groupedByDate.set(dateKey, []);
    groupedByDate.get(dateKey)!.push(cand);
  }

  // Build response with friendly labels
  const dateLabels = new Map<string, { label: string; weekday: string }>();
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const monthNames = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
  ];
  for (const key of groupedByDate.keys()) {
    const d = new Date(key + "T00:00:00");
    dateLabels.set(key, {
      label: `${dayNames[d.getUTCDay()]} ${d.getUTCDate()} ${monthNames[d.getUTCMonth()]}`,
      weekday: dayNames[d.getUTCDay()],
    });
  }

  const result = Array.from(groupedByDate.entries())
    .map(([date, slots]) => ({
      date,
      label: dateLabels.get(date)!.label,
      weekday: dateLabels.get(date)!.weekday,
      slots: slots
        .map((s) => ({
          startUtc: new Date(s.start.getTime() - COT_OFFSET_MS).toISOString(),
          startCot: s.start.toISOString(),
          // s.start is already in COT-local time baked into UTC fields.
          // Format it directly without timezone conversion.
          label: formatCotTime(s.start),
        }))
        .sort((a, b) => a.startCot.localeCompare(b.startCot)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json({ dates: result });
}

/**
 * Format a Date (whose UTC fields are COT-local) as "08:00 a. m." / "05:30 p. m.".
 */
function formatCotTime(d: Date): string {
  const h24 = d.getUTCHours();
  const m = d.getUTCMinutes();
  const period = h24 < 12 ? "a. m." : "p. m.";
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}
