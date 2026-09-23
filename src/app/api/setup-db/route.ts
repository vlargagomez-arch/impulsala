import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/setup-db
 *
 * Crea todas las tablas en Supabase y inserta datos de demo.
 * Visitar esta URL UNA SOLA VEZ después de deployar en Vercel.
 * No requiere autenticación para que puedas correrlo fácilmente.
 */

export async function GET(req: NextRequest) {
  // Protegido: este endpoint inserta datos de demo, así que NO puede quedar público.
  const secret = process.env.CRON_SECRET;
  const provided = req.nextUrl.searchParams.get("secret") || "";
  const auth = req.headers.get("authorization") || "";
  if (!secret || (provided !== secret && auth !== `Bearer ${secret}`)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const results: string[] = [];

    // 1. Verificar conexión
    const testLead = await db.bookingLead.count().catch(() => -1);
    
    if (testLead === -1) {
      // Las tablas no existen, necesitamos crearlas
      // En Vercel, Prisma debería crearlas automáticamente con prisma generate
      // Pero si no, devolvemos error
      return NextResponse.json({
        error: "Las tablas no existen en Supabase. Necesitás correr 'npx prisma db push' con la DATABASE_URL configurada.",
        solution: "Opción 1: Corré 'npx prisma db push' desde tu compu. Opción 2: En Supabase Dashboard > SQL Editor, pegá el SQL del archivo prisma/migration.sql",
      }, { status: 500 });
    }

    // 2. Si ya hay datos, no insertar más
    if (testLead > 0) {
      return NextResponse.json({
        success: true,
        message: "La base de datos ya está configurada con datos",
        stats: {
          leads: testLead,
          appointments: await db.appointment.count(),
          newsletter: await db.newsletter.count(),
        },
      });
    }

    // 3. Insertar datos de demo
    results.push("Insertando datos de demo...");

    // Leads
    await db.bookingLead.createMany({
      data: [
        { name: "Carlos Méndez", email: "carlos@techsolutions.mx", phone: "+573111234567", hasBusiness: "Sí, tengo un negocio", source: "ai-chat", status: "new", estimatedValue: 4500000, notes: "Interesado en rediseño web + SEO" },
        { name: "Andrea López", email: "andrea@fitpro.co", phone: "+573128765432", hasBusiness: "Sí, tengo un negocio", source: "form", status: "contacted", estimatedValue: 3200000, notes: "Quiere chatbot para su gimnasio" },
        { name: "Javier Rodríguez", email: "javier@constructora.co", phone: "+573154567890", hasBusiness: "Trabajo en una empresa", source: "whatsapp", status: "scheduled", estimatedValue: 8500000, notes: "Reunión agendada para discutir Google Ads" },
        { name: "María González", email: "maria@boutique.co", phone: "+573207891234", hasBusiness: "Soy emprendedora", source: "ai-chat", status: "scheduled", estimatedValue: 2800000, notes: "Tienda online, necesita e-commerce" },
        { name: "Roberto Castro", email: "roberto@importadora.co", phone: "+573118901234", hasBusiness: "Trabajo en una empresa", source: "whatsapp", status: "contacted", estimatedValue: 7800000, notes: "Importadora, requiere sistema de inventario" },
        { name: "Laura Sánchez", email: "laura@clinicadental.co", phone: "+573198765432", hasBusiness: "Sí, tengo un negocio", source: "ai-chat", status: "converted", estimatedValue: 9200000, notes: "Cliente cerrado: web + CRM + automatización" },
        { name: "Pedro Ramírez", email: "pedro@restaurante.co", phone: "+573114321098", hasBusiness: "Sí, tengo un negocio", source: "form", status: "converted", estimatedValue: 6800000, notes: "Cliente cerrado: web + gestión de reservas" },
        { name: "Camila Ruiz", email: "camila@spa.co", phone: "+573152345678", hasBusiness: "Sí, tengo un negocio", source: "ai-chat", status: "new", estimatedValue: 2200000, notes: "Spa, quiere reservas online" },
        { name: "Diego Torres", email: "diego@startup.io", phone: "+573136789012", hasBusiness: "Soy emprendedor", source: "form", status: "lost", estimatedValue: 1500000, notes: "Presupuesto muy bajo, no cierra" },
        { name: "Sofía Vargas", email: "sofia@abogados.co", phone: "+573172345678", hasBusiness: "Sí, tengo un negocio", source: "ai-chat", status: "new", estimatedValue: 5500000, notes: "Bufete de abogados, necesita posicionamiento" },
      ],
    });
    results.push("✅ 10 leads insertados");

    // Citas
    await db.appointment.createMany({
      data: [
        { name: "Carlos Méndez", business: "Tech Solutions", hasWebsite: "Sí", email: "carlos@techsolutions.mx", phone: "+573111234567", scheduledAt: new Date(Date.now() + 86400000), durationMin: 30, status: "scheduled" },
        { name: "Andrea López", business: "FitPro", hasWebsite: "No", email: "andrea@fitpro.co", phone: "+573128765432", scheduledAt: new Date(Date.now() + 172800000), durationMin: 30, status: "scheduled" },
        { name: "Javier Rodríguez", business: "Constructora", hasWebsite: "Sí", email: "javier@constructora.co", phone: "+573154567890", scheduledAt: new Date(Date.now() + 259200000), durationMin: 30, status: "scheduled" },
        { name: "Laura Sánchez", business: "Clínica Dental", hasWebsite: "Sí", email: "laura@clinicadental.co", phone: "+573198765432", scheduledAt: new Date(Date.now() - 86400000), durationMin: 30, status: "completed" },
      ],
    });
    results.push("✅ 4 citas insertadas");

    // Newsletter
    await db.newsletter.createMany({
      data: [
        { email: "juan@gmail.com", source: "footer", status: "active" },
        { email: "maria@hotmail.com", source: "footer", status: "active" },
        { email: "carlos@yahoo.com", source: "blog", status: "active" },
        { email: "ana@outlook.com", source: "footer", status: "active" },
        { email: "pedro@gmail.com", source: "blog", status: "active" },
      ],
    });
    results.push("✅ 5 suscriptores insertados");

    return NextResponse.json({
      success: true,
      message: "Base de datos configurada correctamente con datos de demo",
      results,
      stats: {
        leads: await db.bookingLead.count(),
        appointments: await db.appointment.count(),
        newsletter: await db.newsletter.count(),
      },
    });
  } catch (error: any) {
    console.error("❌ [SETUP-DB] Error:", error?.message);
    return NextResponse.json(
      { 
        error: error?.message || "Error configurando DB",
        hint: "Si las tablas no existen, andá a Supabase > SQL Editor y corré el schema manualmente",
      },
      { status: 500 }
    );
  }
}
