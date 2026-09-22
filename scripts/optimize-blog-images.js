const sharp = require("sharp");
const fs = require("fs");
const https = require("https");
const path = require("path");

const BLOG_DIR = "/home/z/my-project/public/blog";
const REMOTE_BASE = "https://sfile.chatglm.cn/images-ppt/";

// Mapeo de URLs remotas a nombres locales
const images = [
  { remote: "b3f9b896626d.jpg", local: "agentes-ia-venden.jpg" },
  { remote: "cbabcd96574b.jpg", local: "seo-con-ia.jpg" },
  { remote: "4c62e3ca6f14.png", local: "automatizacion-ventas.jpg" },
  { remote: "f81806a0ef33.jpg", local: "pagina-web-vende.jpg" },
  { remote: "cf0cf6ea3d7f.png", local: "google-ads-ia.jpg" },
  { remote: "3487df595f9c.png", local: "chatbot-vs-agente.jpg" },
  { remote: "6a5d4fc12fb5.jpg", local: "crm-piensa-por-ti.jpg" },
  { remote: "ed408c23bde8.jpg", local: "marketing-predictivo.jpg" },
  { remote: "28bb8594852f.png", local: "ecommerce-autonomo.jpg" },
  { remote: "a44f172f8e21.png", local: "contenido-rankea.jpg" },
  { remote: "49ece20a8683.jpg", local: "whatsapp-business-ia.jpg" },
  { remote: "d7d7fa989193.jpg", local: "transformacion-digital.jpg" },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", reject);
  });
}

async function main() {
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

  for (const img of images) {
    const tempPath = path.join(BLOG_DIR, `_temp_${img.local}`);
    const finalPath = path.join(BLOG_DIR, img.local.replace(".jpg", ".webp"));

    // Skip if already exists
    if (fs.existsSync(finalPath)) {
      console.log(`✅ ${img.local} → ya existe`);
      continue;
    }

    try {
      // Download
      console.log(`⬇️ Descargando ${img.remote}...`);
      await download(`${REMOTE_BASE}${img.remote}`, tempPath);

      const originalSize = fs.statSync(tempPath).size;

      // Optimize to WebP
      await sharp(tempPath)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 75, effort: 4 })
        .toFile(finalPath);

      const newSize = fs.statSync(finalPath).size;
      const reduction = (((originalSize - newSize) / originalSize) * 100).toFixed(0);

      console.log(`✅ ${img.local}: ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (-${reduction}%)`);

      // Delete temp
      fs.unlinkSync(tempPath);
    } catch (e) {
      console.log(`❌ ${img.remote}: ${e.message}`);
    }
  }
  console.log("\n✅ Todas las imágenes optimizadas");
}

main();
