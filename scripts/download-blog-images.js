const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');
const http = require('http');

const ARTICLES = [
  { slug: 'como-conseguir-resenas-en-google-que-traigan-clientes', query: 'google reviews five stars business' },
  { slug: 'tu-dominio-hosting-y-accesos-estan-a-tu-nombre', query: 'domain name ownership digital business' },
  { slug: 'tu-formulario-de-contacto-pierde-clientes-arreglalo-esta-semana', query: 'contact form website optimization' },
  { slug: 'como-subir-tus-precios-sin-perder-clientes', query: 'price increase business strategy money' },
  { slug: 'como-cobrar-en-linea-en-colombia-guia-para-tu-pyme', query: 'online payment gateway colombia' },
  { slug: 'como-escribir-los-textos-de-tu-web-para-que-vendan', query: 'copywriting website text sales' },
  { slug: 'vende-mas-con-los-estados-de-whatsapp-guia-practica', query: 'whatsapp business marketing strategy' },
  { slug: 'tu-web-carga-lento-y-pierdes-clientes-arreglalo-esta-semana', query: 'slow website loading speed optimization' },
  { slug: 'como-pedir-referidos-a-tus-clientes-sin-incomodar', query: 'customer referrals word of mouth business' },
  { slug: 'tu-cliente-dice-esta-muy-caro-como-responder-bien', query: 'customer negotiation price objection sales' },
  { slug: 'cuanto-cuesta-una-pagina-web-en-colombia', query: 'web development cost website design' },
  { slug: 'como-mostrar-tus-precios-en-la-web-sin-perder-clientes', query: 'pricing page website design' },
  { slug: 'fotos-de-producto-con-celular-como-hacerlas-vender-mas', query: 'product photography smartphone' },
  { slug: 'clientes-que-llenan-el-carrito-y-no-pagan-como-recuperarlos', query: 'shopping cart abandonment ecommerce' },
  { slug: 'tu-base-de-clientes-el-activo-que-estas-regalando', query: 'customer database CRM business' },
  { slug: 'tu-pagina-de-inicio-no-dice-que-vendes-arreglala-esta-semana', query: 'website homepage design sales' },
  { slug: 'tu-catalogo-en-pdf-esta-perdiendo-ventas-pasalo-a-web', query: 'pdf catalog to website digital transformation' },
  { slug: 'tu-publicidad-no-vende-5-revisiones-para-esta-semana', query: 'advertising marketing campaign review' },
  { slug: 'cotizacion-enviada-y-sin-respuesta-como-cerrar-la-venta', query: 'sales quote proposal business deal' },
  { slug: 'automatiza-whatsapp-con-ia-y-no-pierdas-mas-clientes', query: 'whatsapp automation AI chatbot business' },
  { slug: 'resenas-negativas-en-google-respondelas-sin-perder-clientes', query: 'negative review response reputation management' },
  { slug: 'como-saber-de-donde-vienen-tus-clientes-sin-adivinar', query: 'customer analytics data tracking' },
  { slug: 'clientes-que-ya-te-compraron-la-venta-que-estas-ignorando', query: 'customer retention repeat business' },
  { slug: 'cuanto-puedes-pagar-por-un-cliente-sin-perder-dinero', query: 'customer acquisition cost marketing budget' },
  { slug: 'como-no-perder-clientes-por-responder-tarde-en-whatsapp', query: 'fast response customer service whatsapp' },
  { slug: 'como-aparecer-en-google-cuando-buscan-tu-negocio-en-tu-ciudad', query: 'google local business map seo' },
  { slug: 'como-saber-si-tu-web-esta-espantando-clientes-y-como-arreglarlo', query: 'bad website design losing customers' },
];

function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        return downloadImage(response.headers.location, filePath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function processArticle(article, index) {
  try {
    console.log(`[${index + 1}/${ARTICLES.length}] Buscando: ${article.query}`);
    const output = execSync(
      `z-ai image-search -q "${article.query}" --count 1 --gl us --no-rank 2>&1`,
      { timeout: 120000, encoding: 'utf-8' }
    );

    // Parse JSON from output (skip the emoji lines)
    const jsonStart = output.indexOf('{');
    if (jsonStart === -1) {
      console.log(`  ⚠️ No JSON found`);
      return false;
    }
    const jsonStr = output.slice(jsonStart);
    const data = JSON.parse(jsonStr);

    if (!data.results || data.results.length === 0) {
      console.log(`  ⚠️ No images found`);
      return false;
    }

    const imageUrl = data.results[0].original_url;
    console.log(`  📸 Found: ${imageUrl}`);

    // Download and convert to WebP
    const tempPath = `/tmp/blog-img-${index}.jpg`;
    await downloadImage(imageUrl, tempPath);

    const sharp = require('sharp');
    const outPath = `public/blog/crm/${article.slug}.webp`;
    await sharp(tempPath)
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .webp({ quality: 80 })
      .toFile(outPath);

    const size = (fs.statSync(outPath).size / 1024).toFixed(1);
    console.log(`  ✅ Saved: ${outPath} (${size}KB)`);
    fs.unlinkSync(tempPath);
    return true;
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  const dir = 'public/blog/crm/';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let success = 0;
  for (let i = 0; i < ARTICLES.length; i++) {
    await processArticle(ARTICLES[i], i);
    if (await processArticle(ARTICLES[i], i)) success++;
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\n${success}/${ARTICLES.length} images downloaded successfully`);
}

main().catch(console.error);
