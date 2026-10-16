const sharp = require('sharp');
const fs = require('fs');

const BLOG_IMAGES = [
  { file: 'agentes-ia-venden.webp', title: 'Agentes IA que Venden', subtitle: 'Automatización 24/7', colors: ['#6366f1', '#d946ef'], icon: '🤖' },
  { file: 'seo-con-ia.webp', title: 'SEO con IA', subtitle: 'Posicionamiento Inteligente', colors: ['#06b6d4', '#3b82f6'], icon: '🔍' },
  { file: 'automatizacion-ventas.webp', title: 'Automatización de Ventas', subtitle: 'Procesos Automáticos', colors: ['#10b981', '#06b6d4'], icon: '⚙️' },
  { file: 'pagina-web-vende.webp', title: 'Página Web que Vende', subtitle: 'Diseño que Convierte', colors: ['#8b5cf6', '#ec4899'], icon: '💻' },
  { file: 'google-ads-ia.webp', title: 'Google Ads con IA', subtitle: 'ROI Optimizado', colors: ['#f59e0b', '#ef4444'], icon: '📢' },
  { file: 'chatbot-vs-agente.webp', title: 'Chatbot vs Agente IA', subtitle: 'La Revolución', colors: ['#6366f1', '#8b5cf6'], icon: '🤖' },
  { file: 'crm-piensa-por-ti.webp', title: 'CRM que Piensa por Ti', subtitle: 'Inteligencia Automática', colors: ['#d946ef', '#8b5cf6'], icon: '🧠' },
  { file: 'marketing-predictivo.webp', title: 'Marketing Predictivo', subtitle: 'Datos que Venden', colors: ['#06b6d4', '#6366f1'], icon: '📊' },
  { file: 'ecommerce-autonomo.webp', title: 'E-commerce Autónomo', subtitle: 'Tiendas que se Gestionan Solas', colors: ['#10b981', '#84cc16'], icon: '🛒' },
  { file: 'contenido-rankea.webp', title: 'Contenido que Rankea', subtitle: 'SEO + IA', colors: ['#3b82f6', '#06b6d4'], icon: '📝' },
  { file: 'whatsapp-business-ia.webp', title: 'WhatsApp Business + IA', subtitle: 'Ventas Automáticas', colors: ['#22c55e', '#10b981'], icon: '💬' },
  { file: 'transformacion-digital.webp', title: 'Transformación Digital', subtitle: 'PYMES 2026', colors: ['#8b5cf6', '#6366f1'], icon: '🚀' },
  { file: 'landing-conversion.webp', title: 'Landing de Conversión', subtitle: 'Diseño que Vende', colors: ['#ec4899', '#f59e0b'], icon: '🎯' },
  { file: 'email-marketing-ia.webp', title: 'Email Marketing con IA', subtitle: 'Secuencias Automáticas', colors: ['#f59e0b', '#8b5cf6'], icon: '📧' },
  { file: 'google-my-business.webp', title: 'Google My Business', subtitle: 'SEO Local', colors: ['#3b82f6', '#10b981'], icon: '📍' },
  { file: 'tiktok-ads.webp', title: 'TikTok Ads', subtitle: 'Viralidad Pagada', colors: ['#000000', '#ec4899'], icon: '🎵' },
  { file: 'web-lenta.webp', title: '¿Tu Web es Lenta?', subtitle: 'Optimización de Velocidad', colors: ['#ef4444', '#f59e0b'], icon: '⚡' },
  { file: 'ia-contenido.webp', title: 'IA para Contenido', subtitle: 'Creación Automática', colors: ['#6366f1', '#06b6d4'], icon: '✍️' },
  { file: 'instagram-ads.webp', title: 'Instagram Ads', subtitle: 'Visual que Convierte', colors: ['#ec4899', '#8b5cf6'], icon: '📸' },
  { file: 'whatsapp-bot.webp', title: 'Bot de WhatsApp', subtitle: 'Atención 24/7', colors: ['#22c55e', '#06b6d4'], icon: '💬' },
  { file: 'errores-seo.webp', title: 'Errores de SEO', subtitle: 'Lo que Debes Evitar', colors: ['#ef4444', '#ec4899'], icon: '⚠️' },
  { file: 'crm-pymes.webp', title: 'CRM para PYMES', subtitle: 'Gestión Simplificada', colors: ['#8b5cf6', '#d946ef'], icon: '📊' },
  { file: 'web-errores-diseno.webp', title: 'Errores de Diseño Web', subtitle: 'Evita Perder Clientes', colors: ['#f59e0b', '#ef4444'], icon: '🎨' },
  { file: 'default.webp', title: 'Blog Impulsala', subtitle: 'Marketing Digital e IA', colors: ['#6366f1', '#d946ef'], icon: '✨' },
];

function generateSVG(img) {
  const [c1, c2] = img.colors;
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.6"/>
    </linearGradient>
  </defs>

  <!-- Background gradient -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Dark overlay for text readability -->
  <rect width="1200" height="630" fill="url(#overlay)"/>

  <!-- Decorative circles -->
  <circle cx="950" cy="120" r="180" fill="#ffffff" opacity="0.05"/>
  <circle cx="1050" cy="500" r="120" fill="#ffffff" opacity="0.05"/>
  <circle cx="150" cy="550" r="100" fill="#ffffff" opacity="0.05"/>

  <!-- Logo Impulsala top left -->
  <text x="60" y="70" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="#ffffff" opacity="0.8">IMPULSALA</text>
  <text x="60" y="90" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#ffffff" opacity="0.5">Agencia Digital · Bogotá</text>

  <!-- Icon -->
  <text x="60" y="280" font-family="system-ui, -apple-system, sans-serif" font-size="80" fill="#ffffff" opacity="0.9">${img.icon}</text>

  <!-- Title -->
  <text x="60" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="800" fill="#ffffff">${img.title}</text>

  <!-- Subtitle -->
  <text x="60" y="430" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="400" fill="#ffffff" opacity="0.8">${img.subtitle}</text>

  <!-- Bottom bar -->
  <rect x="0" y="590" width="1200" height="40" fill="#000000" opacity="0.4"/>
  <text x="60" y="616" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#ffffff" opacity="0.6">impulsala.com · Desarrollo Web · SEO · Ads · IA</text>

  <!-- Decorative line -->
  <rect x="60" y="320" width="80" height="4" rx="2" fill="#ffffff" opacity="0.9"/>
</svg>`;
}

async function generateAll() {
  const dir = 'public/blog/';
  for (const img of BLOG_IMAGES) {
    const svg = generateSVG(img);
    const outPath = dir + img.file;
    await sharp(Buffer.from(svg))
      .resize(1200, 630)
      .webp({ quality: 85 })
      .toFile(outPath);
    const size = (fs.statSync(outPath).size / 1024).toFixed(1);
    console.log(`✅ ${img.file} (${size}KB) - ${img.title}`);
  }
  console.log(`\n${BLOG_IMAGES.length} imágenes generadas`);
}

generateAll().catch(console.error);
