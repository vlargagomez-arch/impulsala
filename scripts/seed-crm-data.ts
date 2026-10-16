// Seed script: crea leads, citas y suscriptores de ejemplo
import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Sembrando datos de prueba...");

  // 1. Crear admin
  const adminEmail = "admin@impulsala.co";
  const existing = await db.admin.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hash = await bcrypt.hash("nexus2026", 10);
    await db.admin.create({
      data: {
        email: adminEmail,
        name: "Administrador Impulsala",
        passwordHash: hash,
        role: "admin",
      },
    });
    console.log("✅ Admin creado:", adminEmail);
  } else {
    console.log("ℹ️  Admin ya existe");
  }

  // 2. Crear leads (con variedad de estados)
  const leadsData = [
    {
      name: "Carlos Méndez",
      email: "carlos@techsolutions.mx",
      phone: "+573111234567",
      hasBusiness: "Sí, tengo un negocio",
      source: "ai-chat",
      status: "new",
      estimatedValue: 4500000,
      notes: "Interesado en rediseño web + SEO",
    },
    {
      name: "Andrea López",
      email: "andrea@fitpro.co",
      phone: "+573128765432",
      hasBusiness: "Sí, tengo un negocio",
      source: "form",
      status: "contacted",
      estimatedValue: 3200000,
      notes: "Quiere chatbot para su gimnasio",
    },
    {
      name: "Javier Rodríguez",
      email: "javier@constructora.co",
      phone: "+573154567890",
      hasBusiness: "Trabajo en una empresa",
      source: "whatsapp",
      status: "scheduled",
      estimatedValue: 8500000,
      notes: "Reunión agendada para discutir Google Ads",
    },
    {
      name: "María González",
      email: "maria@boutique.co",
      phone: "+573207891234",
      hasBusiness: "Soy emprendedora",
      source: "ai-chat",
      status: "scheduled",
      estimatedValue: 2800000,
      notes: "Tienda online, necesita e-commerce",
    },
    {
      name: "Pedro Ramírez",
      email: "pedro@restaurante.co",
      phone: "+573114321098",
      hasBusiness: "Sí, tengo un negocio",
      source: "form",
      status: "converted",
      estimatedValue: 6800000,
      notes: "Cliente cerrado: web + gestión de reservas",
    },
    {
      name: "Laura Sánchez",
      email: "laura@clinicadental.co",
      phone: "+573198765432",
      hasBusiness: "Sí, tengo un negocio",
      source: "ai-chat",
      status: "converted",
      estimatedValue: 9200000,
      notes: "Cliente cerrado: web + CRM + automatización",
    },
    {
      name: "Diego Torres",
      email: "diego@startup.io",
      phone: "+573136789012",
      hasBusiness: "Soy emprendedor",
      source: "form",
      status: "lost",
      estimatedValue: 1500000,
      notes: "Presupuesto muy bajo, no cierra",
    },
    {
      name: "Sofía Vargas",
      email: "sofia@abogados.co",
      phone: "+573172345678",
      hasBusiness: "Sí, tengo un negocio",
      source: "ai-chat",
      status: "new",
      estimatedValue: 5500000,
      notes: "Bufete de abogados, necesita posicionamiento",
    },
    {
      name: "Roberto Castro",
      email: "roberto@importadora.co",
      phone: "+573118901234",
      hasBusiness: "Trabajo en una empresa",
      source: "whatsapp",
      status: "contacted",
      estimatedValue: 7800000,
      notes: "Importadora, requiere sistema de inventario",
    },
    {
      name: "Camila Ruiz",
      email: "camila@spa.co",
      phone: "+573152345678",
      hasBusiness: "Sí, tengo un negocio",
      source: "ai-chat",
      status: "new",
      estimatedValue: 2200000,
      notes: "Spa, quiere reservas online",
    },
  ];

  for (const lead of leadsData) {
    const created = await db.bookingLead.create({ data: lead });

    // Agregar 1-2 notas a algunos leads
    if (lead.status !== "new") {
      await db.leadNote.create({
        data: {
          leadId: created.id,
          content: `Contacto inicial con ${lead.name}. ${lead.notes}`,
          author: "admin",
        },
      });
    }
    if (lead.status === "scheduled" || lead.status === "converted") {
      await db.leadNote.create({
        data: {
          leadId: created.id,
          content: `Seguimiento: cliente muy interesado, próximos pasos definidos.`,
          author: "admin",
        },
      });
    }

    // Agregar follow-ups
    if (lead.status === "contacted" || lead.status === "scheduled") {
      const fuDate = new Date();
      fuDate.setDate(fuDate.getDate() + 2);
      await db.followUp.create({
        data: {
          leadId: created.id,
          scheduledAt: fuDate,
          type: "call",
          notes: "Llamar para confirmar intereses",
          completed: false,
        },
      });
    }
    if (lead.status === "new") {
      const fuDate = new Date();
      fuDate.setHours(fuDate.getHours() - 2); // Vencido
      await db.followUp.create({
        data: {
          leadId: created.id,
          scheduledAt: fuDate,
          type: "whatsapp",
          notes: "Primer contacto",
          completed: false,
        },
      });
    }
  }
  console.log(`✅ ${leadsData.length} leads creados con notas y seguimientos`);

  // 3. Crear citas
  const now = new Date();
  const appointments = [
    {
      name: "Javier Rodríguez",
      business: "Constructora Bogotá",
      hasWebsite: "Sí, pero necesita mejora",
      email: "javier@constructora.co",
      phone: "+573154567890",
      scheduledAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      status: "confirmed",
      notes: "Diagnóstico Google Ads",
    },
    {
      name: "María González",
      business: "Boutique María",
      hasWebsite: "No tengo web",
      email: "maria@boutique.co",
      phone: "+573207891234",
      scheduledAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      status: "confirmed",
      notes: "E-commerce para tienda",
    },
    {
      name: "Pedro Ramírez",
      business: "Restaurante Sabores",
      hasWebsite: "Sí, pero necesita mejora",
      email: "pedro@restaurante.co",
      phone: "+573114321098",
      scheduledAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      status: "completed",
      notes: "Cierre - web + reservas",
    },
    {
      name: "Laura Sánchez",
      business: "Clínica Dental Sonrisas",
      hasWebsite: "Sí, optimizada",
      email: "laura@clinicadental.co",
      phone: "+573198765432",
      scheduledAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      status: "completed",
      notes: "Cierre - paquete completo",
    },
    {
      name: "Diego Torres",
      business: "Startup Tech",
      hasWebsite: "No tengo web",
      email: "diego@startup.io",
      phone: "+573136789012",
      scheduledAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      status: "cancelled",
      notes: "Canceló - presupuesto insuficiente",
    },
  ];

  for (const a of appointments) {
    await db.appointment.create({ data: a });
  }
  console.log(`✅ ${appointments.length} citas creadas`);

  // 4. Crear suscriptores newsletter
  const subscribers = [
    { email: "usuario1@gmail.com", source: "footer", status: "active" },
    { email: "cliente@empresa.co", source: "blog", status: "active" },
    { email: "newsletter@outlook.com", source: "landing", status: "active" },
    { email: "info@pyme.com", source: "footer", status: "active" },
    { email: "test@yahoo.com", source: "blog", status: "unsubscribed" },
    { email: "admin@consultoria.co", source: "landing", status: "active" },
    { email: "ventas@importadora.co", source: "footer", status: "active" },
    { email: "marketing@agencia.co", source: "blog", status: "active" },
  ];

  // Fechas variadas
  for (let i = 0; i < subscribers.length; i++) {
    const s = subscribers[i];
    const created = new Date();
    created.setDate(created.getDate() - (i * 3 + 1));
    await db.newsletter.create({
      data: {
        email: s.email,
        source: s.source,
        status: s.status,
        createdAt: created,
      },
    });
  }
  console.log(`✅ ${subscribers.length} suscriptores creados`);

  console.log("\n🎉 Datos de prueba creados exitosamente!");
  console.log("\n📋 Para acceder al CRM:");
  console.log("   URL: http://localhost:3000/crm");
  console.log("   Email: admin@impulsala.co");
  console.log("   Password: nexus2026");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
