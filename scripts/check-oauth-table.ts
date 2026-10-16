import { db } from "../src/lib/db";

async function main() {
  try {
    const count = await db.oAuthToken.count();
    console.log("✅ Tabla OAuthToken existe, registros:", count);
  } catch (e: any) {
    console.log("❌ Tabla OAuthToken NO existe:", e.message);
  }
}

main().finally(() => process.exit(0));
