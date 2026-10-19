const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');
const http = require('http');
const sharp = require('sharp');

const ARTICLES = [
  { file: 'agentes-ia-venden', query: 'AI artificial intelligence sales business' },
  { file: 'seo-con-ia', query: 'SEO search engine optimization google' },
  { file: 'automatizacion-ventas', query: 'sales automation leads CRM' },
  { file: 'pagina-web-vende', query: 'website design conversion sales' },
  { file: 'google-ads-ia', query: 'google ads advertising marketing' },
  { file: 'chatbot-vs-agente', query: 'chatbot AI customer service' },
  { file: 'crm-piensa-por-ti', query: 'CRM customer management dashboard' },
  { file: 'marketing-predictivo', query: 'predictive analytics marketing data' },
  { file: 'ecommerce-autonomo', query: 'ecommerce online store shopping' },
  { file: 'contenido-rankea', query: 'content marketing blog SEO writing' },
  { file: 'whatsapp-business-ia', query: 'whatsapp business marketing phone' },
  { file: 'transformacion-digital', query: 'digital transformation technology' },
  { file: 'landing-conversion', query: 'landing page web design conversion' },
  { file: 'email-marketing-ia', query: 'email marketing newsletter campaign' },
  { file: 'google-my-business', query: 'google maps local business' },
  { file: 'tiktok-ads', query: 'tiktok social media video marketing' },
  { file: 'web-lenta', query: 'slow website loading speed' },
  { file: 'ia-contenido', query: 'AI content generation writing' },
  { file: 'instagram-ads', query: 'instagram social media marketing' },
  { file: 'whatsapp-bot', query: 'whatsapp chatbot messaging' },
  { file: 'errores-seo', query: 'SEO errors google penalty' },
  { file: 'crm-pymes', query: 'small business CRM software' },
  { file: 'web-errores-diseno', query: 'bad website design UX errors' },
];

function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, filePath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) { reject(new Error(`HTTP ${response.statusCode}`)); return; }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function processArticle(article, index) {
  try {
    console.log(`[${index+1}/${ARTICLES.length}] ${article.query}`);
    const output = execSync(`z-ai image-search -q "${article.query}" --count 1 --gl us --no-rank 2>&1`, { timeout: 120000, encoding: 'utf-8' });
    const jsonStart = output.indexOf('{');
    if (jsonStart === -1) { console.log('  ⚠️ No JSON'); return false; }
    const data = JSON.parse(output.slice(jsonStart));
    if (!data.results || data.results.length === 0) { console.log('  ⚠️ No images'); return false; }
    
    const imageUrl = data.results[0].original_url;
    const tempPath = `/tmp/blog-hard-${index}.jpg`;
    await downloadImage(imageUrl, tempPath);
    
    const outPath = `public/blog/${article.file}.webp`;
    await sharp(tempPath).resize(1200, 630, { fit: 'cover', position: 'center' }).webp({ quality: 80 }).toFile(outPath);
    
    const size = (fs.statSync(outPath).size / 1024).toFixed(1);
    console.log(`  ✅ ${outPath} (${size}KB)`);
    fs.unlinkSync(tempPath);
    return true;
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    return false;
  }
}

async function main() {
  let success = 0;
  for (let i = 0; i < ARTICLES.length; i++) {
    if (await processArticle(ARTICLES[i], i)) success++;
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log(`\n${success}/${ARTICLES.length} images downloaded`);
}
main().catch(console.error);
