const sharp = require('sharp');
const fs = require('fs');

// 27 artículos del CRM con su título → generar imagen única para cada uno
const CRM_ARTICLES = [
  { slug: 'como-conseguir-resenas-en-google-que-traigan-clientes', title: 'Cómo conseguir reseñas en Google', subtitle: 'Que traigan clientes', colors: ['#3b82f6', '#06b6d4'], icon: '⭐' },
  { slug: 'tu-dominio-hosting-y-accesos-estan-a-tu-nombre', title: 'Tu dominio y hosting', subtitle: '¿Están a tu nombre?', colors: ['#8b5cf6', '#6366f1'], icon: '🔑' },
  { slug: 'tu-formulario-de-contacto-pierde-clientes-arreglalo-esta-semana', title: 'Tu formulario pierde clientes', subtitle: 'Arréglalo esta semana', colors: ['#ef4444', '#f59e0b'], icon: '📝' },
  { slug: 'como-subir-tus-precios-sin-perder-clientes', title: 'Cómo subir tus precios', subtitle: 'Sin perder clientes', colors: ['#10b981', '#06b6d4'], icon: '💰' },
  { slug: 'como-cobrar-en-linea-en-colombia-guia-para-tu-pyme', title: 'Cómo cobrar en línea', subtitle: 'Guía para tu pyme en Colombia', colors: ['#f59e0b', '#10b981'], icon: '💳' },
  { slug: 'como-escribir-los-textos-de-tu-web-para-que-vendan', title: 'Textos de tu web que venden', subtitle: 'Cómo escribirlos', colors: ['#ec4899', '#8b5cf6'], icon: '✍️' },
  { slug: 'vende-mas-con-los-estados-de-whatsapp-guia-practica', title: 'Vende más con WhatsApp', subtitle: 'Estados que convierten', colors: ['#22c55e', '#10b981'], icon: '💬' },
  { slug: 'tu-web-carga-lento-y-pierdes-clientes-arreglalo-esta-semana', title: 'Tu web carga lento', subtitle: 'Y pierdes clientes', colors: ['#ef4444', '#ec4899'], icon: '⚡' },
  { slug: 'como-pedir-referidos-a-tus-clientes-sin-incomodar', title: 'Cómo pedir referidos', subtitle: 'Sin incomodar', colors: ['#6366f1', '#8b5cf6'], icon: '🤝' },
  { slug: 'tu-cliente-dice-esta-muy-caro-como-responder-bien', title: '"Está muy caro"', subtitle: 'Cómo responder bien', colors: ['#f59e0b', '#ef4444'], icon: '💭' },
  { slug: 'cuanto-cuesta-una-pagina-web-en-colombia', title: '¿Cuánto cuesta una web?', subtitle: 'En Colombia 2026', colors: ['#8b5cf6', '#ec4899'], icon: '💻' },
  { slug: 'como-mostrar-tus-precios-en-la-web-sin-perder-clientes', title: 'Cómo mostrar precios', subtitle: 'Sin perder clientes', colors: ['#10b981', '#06b6d4'], icon: '🏷️' },
  { slug: 'fotos-de-producto-con-celular-como-hacerlas-vender-mas', title: 'Fotos con celular', subtitle: 'Que vendan más', colors: ['#ec4899', '#f59e0b'], icon: '📸' },
  { slug: 'clientes-que-llenan-el-carrito-y-no-pagan-como-recuperarlos', title: 'Carrito abandonado', subtitle: 'Cómo recuperarlos', colors: ['#f59e0b', '#ec4899'], icon: '🛒' },
  { slug: 'tu-base-de-clientes-el-activo-que-estas-regalando', title: 'Tu base de clientes', subtitle: 'El activo que regalas', colors: ['#6366f1', '#06b6d4'], icon: '📊' },
  { slug: 'tu-pagina-de-inicio-no-dice-que-vendes-arreglala-esta-semana', title: 'Tu inicio no vende', subtitle: 'Arréglala esta semana', colors: ['#ef4444', '#8b5cf6'], icon: '🏠' },
  { slug: 'tu-catalogo-en-pdf-esta-perdiendo-ventas-pasalo-a-web', title: 'Catálogo en PDF', subtitle: 'Está perdiendo ventas', colors: ['#f59e0b', '#ef4444'], icon: '📄' },
  { slug: 'tu-publicidad-no-vende-5-revisiones-para-esta-semana', title: 'Tu publicidad no vende', subtitle: '5 revisiones urgentes', colors: ['#ef4444', '#f59e0b'], icon: '📢' },
  { slug: 'cotizacion-enviada-y-sin-respuesta-como-cerrar-la-venta', title: 'Cotización sin respuesta', subtitle: 'Cómo cerrar la venta', colors: ['#8b5cf6', '#ec4899'], icon: '✅' },
  { slug: 'automatiza-whatsapp-con-ia-y-no-pierdas-mas-clientes', title: 'Automatiza WhatsApp con IA', subtitle: 'No pierdas más clientes', colors: ['#22c55e', '#06b6d4'], icon: '🤖' },
  { slug: 'resenas-negativas-en-google-respondelas-sin-perder-clientes', title: 'Reseñas negativas', subtitle: 'Cómo responderlas bien', colors: ['#ef4444', '#ec4899'], icon: '⚠️' },
  { slug: 'como-saber-de-donde-vienen-tus-clientes-sin-adivinar', title: 'De dónde vienen tus clientes', subtitle: 'Sin adivinar', colors: ['#06b6d4', '#6366f1'], icon: '📈' },
  { slug: 'clientes-que-ya-te-compraron-la-venta-que-estas-ignorando', title: 'Clientes que ya compraron', subtitle: 'La venta que ignoras', colors: ['#10b981', '#8b5cf6'], icon: '🔁' },
  { slug: 'cuanto-puedes-pagar-por-un-cliente-sin-perder-dinero', title: '¿Cuánto pagar por un cliente?', subtitle: 'Sin perder dinero', colors: ['#f59e0b', '#10b981'], icon: '💵' },
  { slug: 'como-no-perder-clientes-por-responder-tarde-en-whatsapp', title: 'No pierdas clientes', subtitle: 'Por responder tarde', colors: ['#22c55e', '#3b82f6'], icon: '⏰' },
  { slug: 'como-aparecer-en-google-cuando-buscan-tu-negocio-en-tu-ciudad', title: 'Aparecer en Google', subtitle: 'En tu ciudad', colors: ['#3b82f6', '#06b6d4'], icon: '📍' },
  { slug: 'como-saber-si-tu-web-esta-espantando-clientes-y-como-arreglarlo', title: '¿Tu web espanta clientes?', subtitle: 'Cómo arreglarlo', colors: ['#ef4444', '#8b5cf6'], icon: '🐛' },
];

function generateSVG(img) {
  const [c1, c2] = img.colors;
  // Escapar & en XML
  const safeTitle = img.title.replace(/&/g, 'y');
  const safeSubtitle = img.subtitle.replace(/&/g, 'y');
  
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
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#overlay)"/>
  <circle cx="950" cy="120" r="180" fill="#ffffff" opacity="0.05"/>
  <circle cx="1050" cy="500" r="120" fill="#ffffff" opacity="0.05"/>
  <circle cx="150" cy="550" r="100" fill="#ffffff" opacity="0.05"/>
  <text x="60" y="70" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="#ffffff" opacity="0.8">IMPULSALA</text>
  <text x="60" y="90" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#ffffff" opacity="0.5">Agencia Digital - Bogota</text>
  <text x="60" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="80" fill="#ffffff" opacity="0.9">${img.icon}</text>
  <rect x="60" y="310" width="80" height="4" rx="2" fill="#ffffff" opacity="0.9"/>
  <text x="60" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="800" fill="#ffffff">${safeTitle}</text>
  <text x="60" y="425" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#ffffff" opacity="0.8">${safeSubtitle}</text>
  <rect x="0" y="590" width="1200" height="40" fill="#000000" opacity="0.4"/>
  <text x="60" y="616" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#ffffff" opacity="0.6">impulsala.com - Marketing Digital e IA</text>
</svg>`;
}

async function generateAll() {
  const dir = 'public/blog/crm/';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  for (const img of CRM_ARTICLES) {
    const svg = generateSVG(img);
    const outPath = dir + img.slug + '.webp';
    await sharp(Buffer.from(svg))
      .resize(1200, 630)
      .webp({ quality: 85 })
      .toFile(outPath);
    const size = (fs.statSync(outPath).size / 1024).toFixed(1);
    console.log('✅ ' + img.slug + '.webp (' + size + 'KB) - ' + img.title);
  }
  console.log('\n' + CRM_ARTICLES.length + ' imágenes generadas');
}

generateAll().catch(console.error);
