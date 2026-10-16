const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const BLOG_DIR = "/home/z/my-project/public/blog";

async function main() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith(".jpg"));
  for (const file of files) {
    const inputPath = path.join(BLOG_DIR, file);
    const outputPath = path.join(BLOG_DIR, file.replace(".jpg", ".webp"));
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${file} → ya existe .webp`);
      fs.unlinkSync(inputPath);
      continue;
    }

    const originalSize = fs.statSync(inputPath).size;
    await sharp(inputPath)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 75, effort: 4 })
      .toFile(outputPath);

    const newSize = fs.statSync(outputPath).size;
    console.log(`✅ ${file}: ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB`);
    fs.unlinkSync(inputPath);
  }
  console.log("\n✅ Todas las JPEG convertidas a WebP");
}
main();
