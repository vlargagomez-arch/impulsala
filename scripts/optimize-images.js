// Optimiza las imágenes PNG del portafolio a WebP
// y genera versiones redimensionadas para diferentes viewports
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PORTFOLIO_DIR = "/home/z/my-project/public/portfolio";

async function optimizeImage(file) {
  const inputPath = path.join(PORTFOLIO_DIR, file);
  const baseName = path.basename(file, path.extname(file));
  const originalSize = fs.statSync(inputPath).size;

  // Generar WebP optimizado (calidad 78, buen balance tamaño/calidad)
  const webpPath = path.join(PORTFOLIO_DIR, `${baseName}.webp`);
  const info = await sharp(inputPath)
    .resize({ width: 1024, withoutEnlargement: true }) // max 1024px wide
    .webp({ quality: 78, effort: 4 })
    .toFile(webpPath);

  const newSize = fs.statSync(webpPath).size;
  const reduction = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

  console.log(
    `${baseName}: ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (-${reduction}%)`
  );

  // Borrar el PNG original (ya tenemos el WebP)
  fs.unlinkSync(inputPath);
}

async function main() {
  const files = fs.readdirSync(PORTFOLIO_DIR).filter((f) => f.endsWith(".png"));
  console.log(`Optimizando ${files.length} imágenes...\n`);

  for (const file of files) {
    try {
      await optimizeImage(file);
    } catch (e) {
      console.error(`Error con ${file}:`, e.message);
    }
  }

  console.log("\n✅ Listo. Imágenes optimizadas a WebP.");
}

main();
