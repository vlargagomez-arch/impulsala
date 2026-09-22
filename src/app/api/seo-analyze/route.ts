import { NextRequest, NextResponse } from "next/server";

/* ===== Types ===== */
interface SubMetric {
  name: string;
  value: string;
  status: "good" | "warning" | "critical";
}

interface CategoryResult {
  label: string;
  score: number;
  status: "good" | "warning" | "critical";
  detail: string;
  recommendation: string;
  icon: string;
  subMetrics: SubMetric[];
}

interface Issue {
  url: string;
  issue: string;
  severity: "high" | "medium" | "low";
  category: string;
}

interface ActionItem {
  priority: number;
  action: string;
  impact: string;
  effort: string;
  category: string;
}

interface SEOReport {
  url: string;
  domain: string;
  overallScore: number;
  grade: string;
  categories: CategoryResult[];
  issues: Issue[];
  actions: ActionItem[];
  technologies: { name: string; category: string }[];
  serverInfo: {
    statusCode: number;
    ssl: boolean;
    server: string;
    contentType: string;
    responseTime: number;
    contentLength: string;
  };
  pageContent: {
    title: string | null;
    metaDescription: string | null;
    h1Count: number;
    h1Text: string[];
    h2Count: number;
    h3Count: number;
    imgCount: number;
    imgWithAlt: number;
    linkCount: number;
    externalLinks: number;
    internalLinks: number;
    wordCount: number;
    hasViewport: boolean;
    hasCharset: boolean;
    hasOgTags: boolean;
    hasTwitterCards: boolean;
    hasCanonical: boolean;
    hasRobots: boolean;
    hasSchema: boolean;
    hasFavicon: boolean;
    hasLang: boolean;
  };
  summary: { good: number; warning: number; critical: number };
}

function clamp(v: number) { return Math.round(Math.min(100, Math.max(0, v))); }

/* ===== Technology Detection ===== */
function detectTech(html: string): { name: string; category: string }[] {
  const techs: { name: string; category: string }[] = [];
  const l = html.toLowerCase();

  if (l.includes("__next") || l.includes("_next/static") || l.includes("next/router")) techs.push({ name: "Next.js", category: "frontend" });
  else if (l.includes("data-reactroot") || l.includes("__react") || l.includes("react.production") || l.includes("_react")) techs.push({ name: "React", category: "frontend" });
  if (l.includes("ng-version") || l.includes("ng-app") || l.includes("angular.io")) techs.push({ name: "Angular", category: "frontend" });
  if (l.includes("vue") && (l.includes("v-app") || l.includes("vuejs") || l.includes("v-cloak"))) techs.push({ name: "Vue.js", category: "frontend" });
  if (l.includes("svelte") && (l.includes("svelte-") || l.includes("sveltekit"))) techs.push({ name: "Svelte", category: "frontend" });
  if (l.includes("astro-island") || l.includes("astro-slot")) techs.push({ name: "Astro", category: "frontend" });
  if (l.includes("nuxt") || l.includes("__nuxt")) techs.push({ name: "Nuxt.js", category: "frontend" });
  if (l.includes("gatsby") || l.includes("gatsby-")) techs.push({ name: "Gatsby", category: "frontend" });
  if (l.includes("tailwind") || l.includes("tailwindcss")) techs.push({ name: "Tailwind CSS", category: "frontend" });
  if (l.includes("bootstrap") || l.includes("bootstrap.min.css")) techs.push({ name: "Bootstrap", category: "frontend" });
  if (l.includes("jquery") || l.includes("jquery.min.js")) techs.push({ name: "jQuery", category: "frontend" });

  if (l.includes("wp-content") || l.includes("wp-includes") || l.includes("wordpress")) techs.push({ name: "WordPress", category: "cms" });
  if (l.includes("shopify") || l.includes("shopify.com")) techs.push({ name: "Shopify", category: "cms" });
  if (l.includes("contentful") || l.includes("contentful.com")) techs.push({ name: "Contentful", category: "cms" });
  if (l.includes("sanity") || l.includes("sanity.io")) techs.push({ name: "Sanity", category: "cms" });
  if (l.includes("strapi") || l.includes("strapi.io")) techs.push({ name: "Strapi", category: "cms" });
  if (l.includes("webflow") || l.includes("data-wf-page")) techs.push({ name: "Webflow", category: "cms" });
  if (l.includes("wix") || l.includes("wix.com") || l.includes("wix-")) techs.push({ name: "Wix", category: "cms" });

  if (l.includes("google-analytics") || l.includes("gtag(") || l.includes("googletagmanager") || l.includes("ga('create'")) techs.push({ name: "Google Analytics", category: "analytics" });
  if (l.includes("gtm.js") || l.includes("googletagmanager.com/gtm.js")) techs.push({ name: "Google Tag Manager", category: "analytics" });
  if (l.includes("facebook_pixel") || l.includes("fbq(") || l.includes("fbevents.js")) techs.push({ name: "Meta Pixel", category: "analytics" });
  if (l.includes("hotjar") || l.includes("hj")) techs.push({ name: "Hotjar", category: "analytics" });
  if (l.includes("clarity.ms") || l.includes("microsoft/clarity")) techs.push({ name: "Microsoft Clarity", category: "analytics" });
  if (l.includes("plausible") || l.includes("plausible.io")) techs.push({ name: "Plausible", category: "analytics" });

  if (l.includes("vercel") || l.includes("vercel-insights")) techs.push({ name: "Vercel", category: "hosting" });
  if (l.includes("cloudflare") || l.includes("cf-browser-verification")) techs.push({ name: "Cloudflare", category: "hosting" });
  if (l.includes("netlify") || l.includes("netlify-identity")) techs.push({ name: "Netlify", category: "hosting" });
  if (l.includes("firebase") || l.includes("firebaseapp.com")) techs.push({ name: "Firebase", category: "hosting" });

  if (l.includes("recaptcha") || l.includes("g-recaptcha")) techs.push({ name: "reCAPTCHA", category: "security" });

  return techs;
}

/* ===== Parse HTML ===== */
function parseHTML(html: string) {
  const c: SEOReport["pageContent"] = {
    title: null, metaDescription: null,
    h1Count: 0, h1Text: [], h2Count: 0, h3Count: 0,
    imgCount: 0, imgWithAlt: 0,
    linkCount: 0, externalLinks: 0, internalLinks: 0,
    wordCount: 0, hasViewport: false, hasCharset: false,
    hasOgTags: false, hasTwitterCards: false,
    hasCanonical: false, hasRobots: false, hasSchema: false,
    hasFavicon: false, hasLang: false,
  };

  const tm = html.match(/<title[^>]*>(.*?)<\/title>/i);
  if (tm) c.title = tm[1].trim();

  const dm = html.match(/<meta[^>]+name\s*=\s*["']description["'][^>]+content\s*=\s*["'](.*?)["']/i)
    || html.match(/<meta[^>]+content\s*=\s*["'](.*?)["'][^>]+name\s*=\s*["']description["']/i);
  if (dm) c.metaDescription = dm[1].trim();

  c.hasViewport = /<meta[^>]+name\s*=\s*["']viewport["']/i.test(html);
  c.hasCharset = /<meta[^>]+charset/i.test(html);
  c.hasLang = /<html[^>]+lang\s*=/i.test(html);
  c.hasFavicon = /<link[^>]+rel\s*=\s*["'](?:icon|shortcut icon)["']/i.test(html) || /rel\s*=\s*["'](?:icon|shortcut icon)["'][^>]+href/i.test(html);
  c.hasCanonical = /<link[^>]+rel\s*=\s*["']canonical["']/i.test(html) || /rel\s*=\s*["']canonical["'][^>]+href/i.test(html);
  c.hasOgTags = /property\s*=\s*["']og:/i.test(html);
  c.hasTwitterCards = /name\s*=\s*["']twitter:/i.test(html);
  c.hasRobots = /name\s*=\s*["']robots["']/i.test(html);
  c.hasSchema = /application\/ld\+json/i.test(html);

  const h1m = html.match(/<h1[^>]*>(.*?)<\/h1>/gi) || [];
  c.h1Count = h1m.length;
  c.h1Text = h1m.map(h => h.replace(/<[^>]*>/g, "").trim()).slice(0, 3);
  c.h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  c.h3Count = (html.match(/<h3[^>]*>/gi) || []).length;

  const imgs = html.match(/<img[^>]*>/gi) || [];
  c.imgCount = imgs.length;
  c.imgWithAlt = imgs.filter(img => /alt\s*=\s*["'][^"']+["']/i.test(img)).length;

  const links = html.match(/<a[^>]+href\s*=\s*["']([^"']+)["']/gi) || [];
  c.linkCount = links.length;
  c.internalLinks = links.filter(l => /^\//.test(l) || !/^https?:\/\//i.test(l)).length;
  c.externalLinks = links.length - c.internalLinks;

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ").trim();
  c.wordCount = text ? text.split(/\s+/).filter(w => w.length > 1).length : 0;

  return c;
}

/* ===== Build Report ===== */
function buildReport(url: string, html: string, statusCode: number, responseTime: number, headers: Headers): SEOReport {
  const p = parseHTML(html);
  const techs = detectTech(html);
  const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();

  const issues: Issue[] = [];
  const actions: ActionItem[] = [];

  // ===== SEO ON-PAGE =====
  let seoScore = 100;
  const seoSubs: SubMetric[] = [];

  if (p.title) {
    const tl = p.title.length;
    seoSubs.push({ name: "Title Tag", value: `"${p.title.length > 60 ? p.title.substring(0, 60) + "..." : p.title}" (${tl} car.)`, status: (tl >= 30 && tl <= 60) ? "good" : "warning" });
    if (tl < 30 || tl > 60) { seoScore -= 5; issues.push({ url, issue: `Title tag ${tl < 30 ? "muy corto" : "demasiado largo"} (${tl} car., ideal: 30-60)`, severity: "medium", category: "SEO" }); }
  } else {
    seoSubs.push({ name: "Title Tag", value: "No encontrado", status: "critical" });
    seoScore -= 20;
    issues.push({ url, issue: "Sin title tag — esencial para SEO", severity: "high", category: "SEO" });
    actions.push({ priority: 1, action: "Agregar title tag descriptivo (30-60 caracteres)", impact: "Alta (+15-20 pts)", effort: "Bajo", category: "SEO" });
  }

  if (p.metaDescription) {
    const dl = p.metaDescription.length;
    seoSubs.push({ name: "Meta Description", value: `"${p.metaDescription.substring(0, 80)}..." (${dl} car.)`, status: (dl >= 120 && dl <= 160) ? "good" : "warning" });
    if (dl < 120 || dl > 160) { seoScore -= 5; issues.push({ url, issue: `Meta description ${dl < 120 ? "corta" : "larga"} (${dl} car., ideal: 120-160)`, severity: "low", category: "SEO" }); }
  } else {
    seoSubs.push({ name: "Meta Description", value: "No encontrada", status: "critical" });
    seoScore -= 15;
    issues.push({ url, issue: "Sin meta description", severity: "high", category: "SEO" });
    actions.push({ priority: 2, action: "Agregar meta description única (120-160 caracteres)", impact: "Alta (+10-15 pts)", effort: "Medio", category: "SEO" });
  }

  if (p.h1Count === 1) {
    seoSubs.push({ name: "H1 Tag", value: `"${(p.h1Text[0] || "").substring(0, 50)}"`, status: "good" });
  } else if (p.h1Count > 1) {
    seoSubs.push({ name: "H1 Tags", value: `${p.h1Count} encontrados (debe ser 1)`, status: "warning" });
    seoScore -= 8; issues.push({ url, issue: `Multiples H1 (${p.h1Count})`, severity: "medium", category: "SEO" });
    actions.push({ priority: 3, action: "Corregir: un solo H1 por pagina", impact: "Media (+8 pts)", effort: "Bajo", category: "SEO" });
  } else {
    seoSubs.push({ name: "H1 Tag", value: "No encontrado", status: "critical" });
    seoScore -= 15; issues.push({ url, issue: "Sin etiqueta H1", severity: "high", category: "SEO" });
    actions.push({ priority: 3, action: "Agregar H1 con palabra clave principal", impact: "Alta (+15 pts)", effort: "Bajo", category: "SEO" });
  }

  seoSubs.push({ name: "Estructura H2-H3", value: `${p.h2Count} H2, ${p.h3Count} H3`, status: (p.h2Count >= 2) ? "good" : p.h2Count >= 1 ? "warning" : "warning" });
  if (p.h2Count === 0) { seoScore -= 5; issues.push({ url, issue: "Sin H2 para estructurar contenido", severity: "medium", category: "SEO" }); }

  if (p.imgCount > 0) {
    const pct = Math.round((p.imgWithAlt / p.imgCount) * 100);
    seoSubs.push({ name: "Alt en Imagenes", value: `${p.imgWithAlt}/${p.imgCount} con alt (${pct}%)`, status: pct >= 90 ? "good" : pct >= 50 ? "warning" : "critical" });
    if (pct < 90) { seoScore -= pct >= 50 ? 5 : 10; issues.push({ url, issue: `${p.imgCount - p.imgWithAlt} imagenes sin alt`, severity: pct >= 50 ? "medium" : "high", category: "Accesibilidad" }); }
  } else {
    seoSubs.push({ name: "Imagenes", value: "No encontradas", status: "good" });
  }

  seoSubs.push({ name: "Contenido", value: `~${p.wordCount} palabras`, status: p.wordCount >= 300 ? "good" : p.wordCount >= 100 ? "warning" : "critical" });
  if (p.wordCount < 300) { seoScore -= p.wordCount >= 100 ? 8 : 15; if (p.wordCount < 100) issues.push({ url, issue: `Contenido muy escaso: ${p.wordCount} palabras`, severity: "high", category: "SEO" }); }

  seoSubs.push({ name: "Canonical", value: p.hasCanonical ? "Presente" : "Ausente", status: p.hasCanonical ? "good" : "warning" });
  if (!p.hasCanonical) { seoScore -= 3; issues.push({ url, issue: "Sin canonical tag", severity: "low", category: "SEO" }); }

  seoSubs.push({ name: "Schema/JSON-LD", value: p.hasSchema ? "Detectado" : "No detectado", status: p.hasSchema ? "good" : "warning" });
  if (!p.hasSchema) { seoScore -= 5; issues.push({ url, issue: "Sin Schema markup", severity: "medium", category: "SEO" }); actions.push({ priority: 6, action: "Implementar Schema markup (Organization, FAQ, etc.)", impact: "Media (+5-10 pts)", effort: "Medio", category: "SEO" }); }

  seoSubs.push({ name: "Open Graph", value: p.hasOgTags ? "Presente" : "Ausente", status: p.hasOgTags ? "good" : "warning" });
  if (!p.hasOgTags) { seoScore -= 3; issues.push({ url, issue: "Sin Open Graph tags", severity: "low", category: "Redes Sociales" }); }

  seoSubs.push({ name: "Twitter Cards", value: p.hasTwitterCards ? "Presente" : "Ausente", status: p.hasTwitterCards ? "good" : "warning" });

  seoScore = clamp(seoScore);

  // ===== MOBILE/UX =====
  let mobScore = 100;
  const mobSubs: SubMetric[] = [];

  mobSubs.push({ name: "Viewport", value: p.hasViewport ? "Configurado" : "No configurado", status: p.hasViewport ? "good" : "critical" });
  if (!p.hasViewport) { mobScore -= 30; issues.push({ url, issue: "Sin viewport meta — no responsive", severity: "high", category: "Movil" }); actions.push({ priority: 0, action: 'Agregar <meta name="viewport" content="width=device-width, initial-scale=1">', impact: "Critica (+30 pts)", effort: "Bajo", category: "Movil" }); }

  mobSubs.push({ name: "Atributo lang", value: p.hasLang ? "Definido" : "No definido", status: p.hasLang ? "good" : "warning" });
  if (!p.hasLang) { mobScore -= 5; }

  mobSubs.push({ name: "Favicon", value: p.hasFavicon ? "Presente" : "No encontrado", status: p.hasFavicon ? "good" : "warning" });
  if (!p.hasFavicon) { mobScore -= 3; }

  const mq = (html.match(/@media/gi) || []).length;
  mobSubs.push({ name: "Media Queries", value: `${mq} bloques responsive`, status: mq >= 3 ? "good" : mq >= 1 ? "warning" : "critical" });
  if (mq < 3) { mobScore -= mq >= 1 ? 5 : 15; if (mq === 0) issues.push({ url, issue: "Sin media queries — posible no responsive", severity: "high", category: "Movil" }); }

  mobSubs.push({ name: "Charset", value: p.hasCharset ? "Definido" : "No definido", status: p.hasCharset ? "good" : "warning" });
  if (!p.hasCharset) { mobScore -= 5; }

  mobScore = clamp(mobScore);

  // ===== SECURITY =====
  const isHttps = url.startsWith("https://");
  const srv = headers.get("server") || "Desconocido";
  const hsts = (headers.get("strict-transport-security") || "").length > 0;
  const csp = (headers.get("content-security-policy") || "").length > 0;
  const xframe = (headers.get("x-frame-options") || "").length > 0 || (headers.get("content-security-policy") || "").includes("frame-ancestors");
  const xct = (headers.get("x-content-type-options") || "").length > 0;

  let secScore = 100;
  const secSubs: SubMetric[] = [];

  secSubs.push({ name: "SSL/HTTPS", value: isHttps ? "Conexion segura" : "HTTP inseguro", status: isHttps ? "good" : "critical" });
  if (!isHttps) { secScore -= 30; issues.push({ url, issue: "No usa HTTPS", severity: "high", category: "Seguridad" }); actions.push({ priority: 0, action: "Migrar a HTTPS con certificado SSL", impact: "Critica (+30 pts)", effort: "Medio", category: "Seguridad" }); }

  secSubs.push({ name: "HSTS", value: hsts ? "Activo" : "No configurado", status: hsts ? "good" : "warning" });
  if (!hsts) { secScore -= 8; issues.push({ url, issue: "HSTS no configurado", severity: "medium", category: "Seguridad" }); }

  secSubs.push({ name: "CSP", value: csp ? "Configurado" : "No configurado", status: csp ? "good" : "warning" });
  if (!csp) { secScore -= 8; issues.push({ url, issue: "Sin Content Security Policy", severity: "medium", category: "Seguridad" }); }

  secSubs.push({ name: "X-Frame-Options", value: xframe ? "Protegido" : "No configurado", status: xframe ? "good" : "warning" });
  if (!xframe) { secScore -= 5; }

  secSubs.push({ name: "X-Content-Type", value: xct ? "Configurado" : "No configurado", status: xct ? "good" : "warning" });
  if (!xct) { secScore -= 3; }

  secSubs.push({ name: "Servidor", value: srv, status: "good" });

  secScore = clamp(secScore);

  // ===== PERFORMANCE =====
  const htmlKB = Math.round(html.length / 1024);
  const scripts = (html.match(/<script/gi) || []).length;
  const styles = (html.match(/<link[^>]+stylesheet/gi) || []).length + (html.match(/<style/gi) || []).length;
  const inlineStyles = (html.match(/style\s*=/gi) || []).length;

  let perfScore = 100;
  const perfSubs: SubMetric[] = [];

  perfSubs.push({ name: "Tamano HTML", value: `${htmlKB} KB`, status: htmlKB <= 100 ? "good" : htmlKB <= 500 ? "warning" : "critical" });
  if (htmlKB > 500) { perfScore -= 20; issues.push({ url, issue: `HTML pesado (${htmlKB} KB)`, severity: "medium", category: "Rendimiento" }); }
  else if (htmlKB > 100) { perfScore -= 10; }

  perfSubs.push({ name: "Scripts", value: `${scripts} bloques`, status: scripts <= 5 ? "good" : scripts <= 15 ? "warning" : "critical" });
  if (scripts > 15) { perfScore -= 10; issues.push({ url, issue: `${scripts} bloques de script`, severity: "medium", category: "Rendimiento" }); }
  else if (scripts > 5) { perfScore -= 3; }

  perfSubs.push({ name: "CSS", value: `${styles} hojas`, status: styles <= 3 ? "good" : styles <= 8 ? "warning" : "critical" });
  if (styles > 8) { perfScore -= 8; }

  perfSubs.push({ name: "Estilos Inline", value: `${inlineStyles}`, status: inlineStyles <= 10 ? "good" : inlineStyles <= 30 ? "warning" : "critical" });
  if (inlineStyles > 30) { perfScore -= 5; }

  perfSubs.push({ name: "Tiempo Respuesta", value: `${responseTime}ms`, status: responseTime <= 500 ? "good" : responseTime <= 2000 ? "warning" : "critical" });
  if (responseTime > 2000) { perfScore -= 15; issues.push({ url, issue: `Respuesta lenta (${responseTime}ms)`, severity: "high", category: "Rendimiento" }); }
  else if (responseTime > 500) { perfScore -= 5; }

  perfSubs.push({ name: "Enlaces", value: `${p.linkCount} (${p.internalLinks} internos, ${p.externalLinks} externos)`, status: "good" });

  perfScore = clamp(perfScore);

  // ===== CONTENT =====
  let contScore = 100;
  const contSubs: SubMetric[] = [];

  contSubs.push({ name: "Palabras", value: `~${p.wordCount}`, status: p.wordCount >= 300 ? "good" : p.wordCount >= 100 ? "warning" : "critical" });
  if (p.wordCount < 300) { contScore -= p.wordCount >= 100 ? 15 : 25; }

  contSubs.push({ name: "Enlaces Internos", value: `${p.internalLinks}`, status: p.internalLinks >= 3 ? "good" : p.internalLinks >= 1 ? "warning" : "critical" });
  if (p.internalLinks === 0) { contScore -= 10; issues.push({ url, issue: "Sin enlaces internos", severity: "medium", category: "SEO" }); }

  contSubs.push({ name: "Enlaces Externos", value: `${p.externalLinks}`, status: p.externalLinks >= 1 ? "good" : "warning" });
  if (p.externalLinks === 0) { contScore -= 3; }

  const ht = p.h1Count + p.h2Count + p.h3Count;
  contSubs.push({ name: "Jerarquia Headings", value: `H1:${p.h1Count} H2:${p.h2Count} H3:${p.h3Count}`, status: ht >= 3 ? "good" : "warning" });
  if (ht < 3) { contScore -= 5; }

  contSubs.push({ name: "Imagenes", value: `${p.imgCount}`, status: "good" });
  contSubs.push({ name: "Meta Robots", value: p.hasRobots ? "Definido" : "Por defecto (index)", status: "good" });

  contScore = clamp(contScore);

  // ===== TECH/ANALYTICS =====
  let techScore = 80;
  const techSubs: SubMetric[] = [];

  techSubs.push({ name: "Tecnologias", value: `${techs.length} detectadas: ${techs.map(t => t.name).join(", ") || "Ninguna clara"}`, status: techs.length > 0 ? "good" : "warning" });

  const hasAnalytics = techs.some(t => t.category === "analytics");
  if (hasAnalytics) {
    techSubs.push({ name: "Analytics", value: techs.filter(t => t.category === "analytics").map(t => t.name).join(", "), status: "good" });
  } else {
    techSubs.push({ name: "Analytics", value: "No detectado", status: "critical" });
    techScore -= 20;
    issues.push({ url, issue: "Sin Google Analytics ni tracking", severity: "high", category: "Analytics" });
    actions.push({ priority: 8, action: "Instalar Google Analytics 4 o Tag Manager", impact: "Critica (no puedes medir)", effort: "Bajo", category: "Analytics" });
  }

  techSubs.push({ name: "CMS/Framework", value: techs.find(t => t.category === "cms")?.name || techs.find(t => t.category === "frontend")?.name || "Desarrollo custom", status: "good" });
  techSubs.push({ name: "Hosting", value: techs.find(t => t.category === "hosting")?.name || "No identificado", status: "good" });

  techScore = clamp(techScore);

  // ===== COMBINE =====
  const categories: CategoryResult[] = [
    {
      label: "SEO On-Page", score: seoScore,
      status: seoScore >= 75 ? "good" : seoScore >= 50 ? "warning" : "critical",
      detail: seoScore >= 75 ? `SEO tecnico solido. Title y meta description correctos. Estructura de headings OK.` : seoScore >= 50 ? `SEO aceptable con mejoras necesarias.` : `SEO deficiente. Faltan elementos fundamentales.`,
      recommendation: seoScore >= 75 ? "Enfocarse en contenido de calidad y link building." : "Corregir elementos criticos (title, meta, H1) primero.",
      icon: "FileSearch", subMetrics: seoSubs,
    },
    {
      label: "Experiencia Movil", score: mobScore,
      status: mobScore >= 75 ? "good" : mobScore >= 50 ? "warning" : "critical",
      detail: mobScore >= 75 ? "Pagina preparada para moviles con viewport y responsive." : "Algunos elementos moviles necesitan atencion.",
      recommendation: mobScore >= 75 ? "Monitorear Core Web Vitals mobile." : "Agregar viewport meta y mejorar media queries.",
      icon: "Smartphone", subMetrics: mobSubs,
    },
    {
      label: "Seguridad", score: secScore,
      status: secScore >= 75 ? "good" : secScore >= 50 ? "warning" : "critical",
      detail: secScore >= 75 ? "Buenas practicas de seguridad." : "Faltan headers de seguridad importantes.",
      recommendation: secScore >= 75 ? "Mantener certificados y headers actualizados." : "Implementar HSTS, CSP y X-Frame-Options.",
      icon: "Shield", subMetrics: secSubs,
    },
    {
      label: "Rendimiento", score: perfScore,
      status: perfScore >= 75 ? "good" : perfScore >= 50 ? "warning" : "critical",
      detail: perfScore >= 75 ? `HTML ligero (${htmlKB}KB) y respuesta rapida (${responseTime}ms).` : "Rendimiento con margen de mejora.",
      recommendation: perfScore >= 75 ? "Considerar prefetch y service worker." : "Minificar HTML/CSS/JS, reducir scripts, implementar CDN.",
      icon: "Gauge", subMetrics: perfSubs,
    },
    {
      label: "Contenido y Estructura", score: contScore,
      status: contScore >= 75 ? "good" : contScore >= 50 ? "warning" : "critical",
      detail: contScore >= 75 ? "Buen contenido y estructura de enlaces." : "Contenido necesita mejora.",
      recommendation: contScore >= 75 ? "Agregar enlaces internos estrategicos." : "Expandir contenido, mejorar headings y enlaces internos.",
      icon: "FileCode", subMetrics: contSubs,
    },
    {
      label: "Tecnologias y Tracking", score: techScore,
      status: techScore >= 75 ? "good" : techScore >= 50 ? "warning" : "critical",
      detail: techs.length > 0 ? `Detectadas: ${techs.map(t => t.name).join(", ")}.` : "No se detectaron tecnologias claramente.",
      recommendation: techScore >= 75 ? "Stack adecuado. Asegurar que analytics este configurado." : "Instalar al menos un sistema de analytics.",
      icon: "Wifi", subMetrics: techSubs,
    },
  ];

  const overall = Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length);
  const grade = overall >= 85 ? "A" : overall >= 70 ? "B" : overall >= 55 ? "C" : overall >= 40 ? "D" : "F";

  issues.sort((a, b) => { const o = { high: 0, medium: 1, low: 2 }; return o[a.severity] - o[b.severity]; });
  actions.sort((a, b) => a.priority - b.priority);

  return {
    url, domain, overallScore: overall, grade,
    categories, issues, actions, technologies: techs,
    serverInfo: { statusCode, ssl: isHttps, server: srv, contentType: headers.get("content-type") || "Desconocido", responseTime, contentLength: headers.get("content-length") ? `${Math.round(parseInt(headers.get("content-length")!) / 1024)} KB` : `${htmlKB} KB` },
    pageContent: p,
    summary: { good: categories.filter(c => c.status === "good").length, warning: categories.filter(c => c.status === "warning").length, critical: categories.filter(c => c.status === "critical").length },
  };
}

/* ===== API ===== */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL es requerida" }, { status: 400 });
    }

    url = url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;

    try { new URL(url); } catch { return NextResponse.json({ error: "URL invalida" }, { status: 400 }); }

    const t0 = Date.now();
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);

    let resp: Response;
    let html = "";
    let statusCode = 0;
    let rt = 0;

    try {
      resp = await fetch(url, {
        signal: ctrl.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
        },
        redirect: "follow",
      });
      rt = Date.now() - t0;
      statusCode = resp.status;
      html = await resp.text();
    } catch (e: unknown) {
      clearTimeout(timer);
      const msg = e instanceof DOMException && e.name === "AbortError"
        ? "La página tardó demasiado en responder (timeout 20s). Intenta con otra URL."
        : `No se pudo acceder a la página. Puede estar bloqueada o fuera de línea. Intenta con otra URL.`;
      return NextResponse.json({ error: msg }, { status: 422 });
    }
    clearTimeout(timer);

    if (statusCode !== 200 && statusCode !== 301 && statusCode !== 302) {
      // Si hay HTML suficiente, analizarlo de todos modos (algunos sitios bloquean pero devuelven HTML)
      if (!html || html.length < 500) {
        return NextResponse.json({ error: `La página respondió con código ${statusCode}. Puede estar bloqueando el acceso. Intenta con otra URL como google.com o impulsala.com` }, { status: 422 });
      }
    }

    if (!html || html.length < 50) {
      return NextResponse.json({ error: "La pagina no contiene HTML suficiente para analizar." }, { status: 422 });
    }

    // Check if it's a parked domain / placeholder page (not a real website)
    const htmlLower = html.toLowerCase();
    const parkedIndicators = [
      "this domain is for sale", "buy this domain", "domain parking", "parked domain",
      "this domain is available", "purchase this domain", "register this domain",
      "dominio en venta", "comprar este dominio", "este dominio esta a la venta",
      "this page is parked", "coming soon", "under construction", "site not found",
      "error 404", "page not found", "no such site", "webnode", "sedoparking",
      "dan.com", "aftermarket", "undeliverable", "namecheap parking",
    ];
    const isParked = parkedIndicators.some(ind => htmlLower.includes(ind));
    const hasNoRealContent = !htmlLower.includes("<html") && !htmlLower.includes("<!doctype");
    if (isParked || hasNoRealContent) {
      return NextResponse.json({ error: "Este dominio no tiene una pagina web real (esta en venta, parqueado o no existe). Solo analizamos sitios web activos." }, { status: 422 });
    }

    if (html.length > 500000) html = html.substring(0, 500000);

    const report = buildReport(url, html, statusCode, rt, resp.headers);
    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("SEO Analysis Error:", error);
    return NextResponse.json({ error: "Error interno al analizar" }, { status: 500 });
  }
}
