import { db } from "@/lib/db";

/**
 * OAuth 2.0 para Google Calendar — usando fetch (sin googleapis).
 *
 * Esto evita cargar el paquete googleapis de 208MB que rompe
 * el deploy serverless. Usamos HTTP directo a las APIs de Google.
 */

// Credenciales: SOLO desde variables de entorno (no hardcoded por seguridad)
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
// REDIRECT_URI se detecta dinámicamente según la URL del request
// (localhost para dev, dominio público para producción)
const FALLBACK_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  "http://localhost:3000/api/google-calendar/callback";

function detectRedirectUri(request?: Request): string {
  // 1. PRIORIDAD: Si NEXT_PUBLIC_SITE_URL está configurado, usarlo SIEMPRE
  // Esto evita problemas con hosts internos de Alibaba FC
  const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://d1m686vag521-d.space-z.ai";
  return `${publicSiteUrl.replace(/\/$/, "")}/api/google-calendar/callback`;
}

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

const TOKEN_RECORD_ID = "google-calendar";

export function isOAuthConfigured(): boolean {
  return !!(CLIENT_ID && CLIENT_SECRET);
}

export async function hasStoredToken(): Promise<boolean> {
  // 1. Verificar variables de entorno (refresh token del .env)
  const envRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const envAccessToken = process.env.GOOGLE_ACCESS_TOKEN;
  if (envRefreshToken || envAccessToken) {
    return true;
  }

  // 2. Verificar BD
  try {
    const token = await db.oAuthToken.findUnique({
      where: { id: TOKEN_RECORD_ID },
    });
    return !!(token && token.accessToken);
  } catch {
    return false;
  }
}

export function getAuthUrl(request?: Request): string {
  const redirectUri = detectRedirectUri(request);
  const params = new URLSearchParams({
    access_type: "offline",
    scope: SCOPES.join(" "),
    prompt: "consent",
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    login_hint: "vlargagomez@gmail.com",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  expiry_date?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
}

export async function exchangeCodeForToken(code: string, request?: Request): Promise<{
  success: boolean;
  error?: string;
  refreshToken?: string;
}> {
  try {
    const redirectUri = detectRedirectUri(request);
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens: TokenResponse = await response.json();

    if (!tokens.access_token) {
      throw new Error(
        `Google no devolvió access_token: ${JSON.stringify(tokens)}`
      );
    }

    await db.oAuthToken.upsert({
      where: { id: TOKEN_RECORD_ID },
      create: {
        id: TOKEN_RECORD_ID,
        provider: "google-calendar",
        accessToken: tokens.access_token || null,
        refreshToken: tokens.refresh_token || null,
        expiryDate: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
        tokenType: tokens.token_type || null,
        scope: tokens.scope || null,
        userEmail: "vlargagomez@gmail.com",
      },
      update: {
        accessToken: tokens.access_token || null,
        refreshToken: tokens.refresh_token || null,
        expiryDate: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
        tokenType: tokens.token_type || null,
        scope: tokens.scope || null,
        userEmail: "vlargagomez@gmail.com",
      },
    });

    console.log("✅ [Google OAuth] Token guardado en BD");
    console.log("📋 Refresh token:", tokens.refresh_token?.substring(0, 30) + "...");
    return { success: true, refreshToken: tokens.refresh_token };
  } catch (error: any) {
    console.error("❌ [Google OAuth] Error:", error?.message);
    return { success: false, error: error?.message };
  }
}

async function refreshAccessToken(): Promise<string> {
  // 1. Intentar con refresh token del .env
  const envRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (envRefreshToken) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: envRefreshToken,
        grant_type: "refresh_token",
      }),
    });
    const data = await response.json();
    if (data.access_token) {
      return data.access_token;
    }
    throw new Error(`Error refrescando token del .env: ${JSON.stringify(data)}`);
  }

  // 2. Intentar con BD
  const token = await db.oAuthToken.findUnique({
    where: { id: TOKEN_RECORD_ID },
  });

  if (!token || !token.refreshToken) {
    throw new Error("No hay refresh token. Reautoriza en /api/google-calendar/auth");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: token.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data: TokenResponse = await response.json();

  if (!data.access_token) {
    throw new Error(`Error refrescando token: ${JSON.stringify(data)}`);
  }

  await db.oAuthToken.update({
    where: { id: TOKEN_RECORD_ID },
    data: {
      accessToken: data.access_token,
      expiryDate: data.expiry_date ? BigInt(data.expiry_date) : null,
      tokenType: data.token_type || token.tokenType,
      scope: data.scope || token.scope,
    },
  });

  return data.access_token;
}

async function getValidAccessToken(): Promise<string> {
  // 1. Si hay access token en .env, usarlo
  const envAccessToken = process.env.GOOGLE_ACCESS_TOKEN;
  if (envAccessToken) {
    return envAccessToken;
  }

  // 2. Si hay refresh token en .env, refrescar
  const envRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (envRefreshToken) {
    return await refreshAccessToken();
  }

  // 3. BD
  const token = await db.oAuthToken.findUnique({
    where: { id: TOKEN_RECORD_ID },
  });

  if (!token || !token.accessToken) {
    throw new Error("No hay token guardado. Autoriza en /api/google-calendar/auth");
  }

  const expiryDate = token.expiryDate ? Number(token.expiryDate) : 0;
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (expiryDate - now < fiveMinutes) {
    return await refreshAccessToken();
  }

  return token.accessToken;
}

export interface CreateEventParams {
  appointmentId: string;
  name: string;
  business: string;
  email: string;
  phone: string;
  scheduledAt: Date;
  durationMin: number;
}

export interface CreateEventResult {
  success: boolean;
  eventId?: string;
  meetLink?: string;
  htmlLink?: string;
  error?: string;
}

export async function createCalendarEvent(
  params: CreateEventParams
): Promise<CreateEventResult> {
  if (!isOAuthConfigured()) {
    return {
      success: false,
      error: "OAuth no configurado. Necesitas GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env",
    };
  }

  const hasToken = await hasStoredToken();
  if (!hasToken) {
    return {
      success: false,
      error: "No hay token guardado. Visita /api/google-calendar/auth para autorizar.",
    };
  }

  try {
    const accessToken = await getValidAccessToken();
    const startTime = params.scheduledAt;
    const endTime = new Date(startTime.getTime() + params.durationMin * 60 * 1000);

    const event = {
      summary: `Cita Impulsala — ${params.name} (${params.business})`,
      description: `Cita agendada desde impulsala.co

Cliente: ${params.name}
Negocio: ${params.business}
Email: ${params.email}
Teléfono: ${params.phone}
Duración: ${params.durationMin} minutos

El cliente agendó esta cita desde el asistente IA de la web.`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "America/Bogota",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "America/Bogota",
      },
      attendees: [{ email: params.email, displayName: params.name }],
      conferenceData: {
        createRequest: {
          requestId: params.appointmentId,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 15 },
        ],
      },
      source: {
        title: "Impulsala",
        url: "https://impulsala.co",
      },
    };

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    const createdEvent = await response.json();

    if (!response.ok) {
      throw new Error(`Google Calendar API ${response.status}: ${createdEvent.error?.message || JSON.stringify(createdEvent)}`);
    }

    const meetLink = createdEvent.conferenceData?.entryPoints?.find(
      (ep: any) => ep.entryPointType === "video"
    )?.uri;

    console.log(`📅 [Google Calendar] Evento creado: ${createdEvent.id}`);
    console.log(`📹 [Google Meet] Link: ${meetLink}`);

    return {
      success: true,
      eventId: createdEvent.id,
      meetLink,
      htmlLink: createdEvent.htmlLink,
    };
  } catch (error: any) {
    console.error("❌ [Google Calendar] Error:", error?.message);
    return { success: false, error: error?.message };
  }
}

export async function cancelCalendarEvent(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  const hasToken = await hasStoredToken();
  if (!hasToken) {
    return { success: false, error: "No hay token guardado" };
  }

  try {
    const accessToken = await getValidAccessToken();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?sendUpdates=all`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error?.message || `HTTP ${response.status}`);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}

export async function getUserInfo(): Promise<{
  email?: string;
  name?: string;
} | null> {
  const hasToken = await hasStoredToken();
  if (!hasToken) return null;

  try {
    const accessToken = await getValidAccessToken();

    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) return null;

    const data = await response.json();

    if (data.email) {
      await db.oAuthToken.update({
        where: { id: TOKEN_RECORD_ID },
        data: { userEmail: data.email },
      });
    }

    return { email: data.email, name: data.name };
  } catch {
    return null;
  }
}

export async function getOAuthStatus(request?: Request): Promise<{
  configured: boolean;
  connected: boolean;
  authUrl: string | null;
  userInfo: { email?: string; name?: string } | null;
}> {
  const configured = isOAuthConfigured();
  const connected = await hasStoredToken();

  let userInfo = null;
  if (connected) {
    userInfo = await getUserInfo();
  }

  return {
    configured,
    connected,
    authUrl: configured && !connected ? getAuthUrl(request) : null,
    userInfo,
  };
}
