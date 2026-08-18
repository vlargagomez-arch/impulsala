import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "CRM Impulsala",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@impulsala.com" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔍 [AUTH] authorize called with:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ [AUTH] Missing email or password");
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        // Fallbacks hardcoded (cuando BD no funciona en producción)
        const defaultEmail = process.env.CRM_ADMIN_EMAIL || "admin@impulsala.com";
        const defaultPassword = process.env.CRM_ADMIN_PASSWORD || "Globe$12$3";

        // Si las credenciales coinciden con las hardcoded, permitir login directo
        // (sin tocar la BD que puede no estar disponible)
        if (email === defaultEmail.toLowerCase() && password === defaultPassword) {
          console.log("✅ [AUTH] Login directo con credenciales hardcoded (BD skip)");
          return {
            id: "admin-fallback",
            email: defaultEmail.toLowerCase(),
            name: "Administrador",
            role: "admin",
          };
        }

        // Intentar con la BD
        try {
          console.log("🔍 [AUTH] Intentando login con BD para:", email);
          let admin = await db.admin.findUnique({
            where: { email },
          });

          console.log("🔍 [AUTH] Admin found:", admin ? "YES" : "NO");

          // Crear admin por defecto si no existe
          if (!admin) {
            const adminCount = await db.admin.count();
            console.log("🔍 [AUTH] Admin count:", adminCount);

            if (adminCount === 0 && email === defaultEmail.toLowerCase()) {
              console.log("🔍 [AUTH] Creating default admin");
              const passwordHash = await bcrypt.hash(defaultPassword, 10);
              admin = await db.admin.create({
                data: {
                  email: defaultEmail.toLowerCase(),
                  name: "Administrador",
                  passwordHash,
                  role: "admin",
                },
              });
              console.log("✅ [AUTH] Default admin created");
            } else {
              console.log("❌ [AUTH] Admin doesn't exist");
              return null;
            }
          }

          const valid = await bcrypt.compare(password, admin.passwordHash);
          console.log("🔍 [AUTH] bcrypt.compare result:", valid);

          if (!valid) {
            console.log("❌ [AUTH] Password mismatch");
            return null;
          }

          console.log("✅ [AUTH] Login successful for:", admin.email);
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
        } catch (dbError: any) {
          console.error("❌ [AUTH] BD Error:", dbError?.message);

          // Último recurso: si la BD falla pero las credenciales son las hardcoded
          if (email === defaultEmail.toLowerCase() && password === defaultPassword) {
            console.log("✅ [AUTH] Login fallback (BD rota pero credenciales OK)");
            return {
              id: "admin-fallback",
              email: defaultEmail.toLowerCase(),
              name: "Administrador",
              role: "admin",
            };
          }

          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, // 7 días
  pages: {
    signIn: "/crm",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  // Secret con fallback hardcoded para producción (cuando .env no se carga)
  secret: process.env.NEXTAUTH_SECRET || "[NEXTAUTH-SECRET-EN-ENV]",
};
// force deploy 1785854295
