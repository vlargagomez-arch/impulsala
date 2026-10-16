import { headers } from "next/headers";
import { CrmApp } from "@/components/crm/app";
import { CrmLogin } from "@/components/crm/login";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "CRM | Impulsala",
  robots: { index: false, follow: false },
};

export default async function CrmPage(req: NextRequest) {
  let userEmail: string | null = null;

  // Solo leer cookie nexus-admin-session (simple, sin NextAuth ni BD)
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";
    const match = cookieHeader.match(/nexus-admin-session=([^;]+)/);
    if (match) {
      const cookieValue = decodeURIComponent(match[1]);
      const decoded = Buffer.from(cookieValue, "base64").toString();
      const [email] = decoded.split(":");
      if (email === "admin@impulsala.com") {
        userEmail = email;
      }
    }
  } catch (e) {
    // ignore
  }

  // Fallback: req.cookies
  if (!userEmail && req?.cookies) {
    const simpleSession = req.cookies.get("nexus-admin-session");
    if (simpleSession) {
      try {
        const decoded = Buffer.from(simpleSession.value, "base64").toString();
        const [email] = decoded.split(":");
        if (email === "admin@impulsala.com") {
          userEmail = email;
        }
      } catch {
        // ignore
      }
    }
  }

  if (!userEmail) {
    return <CrmLogin />;
  }

  return <CrmApp userEmail={userEmail} />;
}
