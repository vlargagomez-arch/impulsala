const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const DIR = "/home/z/my-project/public/testimonials";

async function optimize(file) {
  const inputPath = path.join(DIR, file);
  const baseName = path.basename(file, path.extname(file));
  const originalSize = fs.statSync(inputPath).size;

  const webpPath = path.join(DIR, `${baseName}.webp`);
  await sharp(inputPath)
    .resize({ width: 400, height: 400, fit: "cover", position: "center" })
    .webp({ quality: 80, effort: 4 })
    .toFile(webpPath);

  const newSize = fs.statSync(webpPath).size;
  console.log(`${baseName}: ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB`);

  fs.unlinkSync(inputPath);
}

async function main() {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".png"));
  for (const file of files) {
    await optimize(file);
  }
  console.log("✅ Listo");
}

main();
