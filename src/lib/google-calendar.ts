// Re-exporta todo desde google-auth.ts (sin googleapis, solo fetch)
export {
  createCalendarEvent,
  cancelCalendarEvent,
  getUserInfo,
  getOAuthStatus as getCalendarStatus,
  isOAuthConfigured as isConfigured,
  hasStoredToken,
  getAuthUrl,
} from "./google-auth";

export type { CreateEventParams, CreateEventResult } from "./google-auth";
