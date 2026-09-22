import { db } from "../src/lib/db";
async function main() {
  const token = await db.oAuthToken.findUnique({ where: { id: "google-calendar" } });
  if (token) {
    console.log("✅ Token existe en BD local");
    console.log("Email:", token.userEmail);
    console.log("Access token:", token.accessToken?.substring(0, 30) + "...");
    console.log("Refresh token:", token.refreshToken?.substring(0, 30) + "...");
  } else {
    console.log("❌ No hay token en BD local");
  }
}
main().finally(() => process.exit(0));
