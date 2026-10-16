#!/bin/bash
# Cambia Impulsala → Impulsala en todo el proyecto
set -e
cd /home/z/my-project

echo "📝 Cambiando Impulsala → Impulsala..."

FILES=$(find . \
  -type f \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./.git/*" \
  -not -path "./upload/*" \
  -not -path "./tool-results/*" \
  -not -path "./download/*" \
  -not -name "*.log" \
  -not -name "*.zip" \
  -not -name "*.db" \
  -not -name "*.png" \
  -not -name "*.svg" \
  -not -name "google-token.json" \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.sh" -o -name "*.env*" -o -name "*.yml" -o -name "*.yaml" -o -name "*.prisma" -o -name "*.css" -o -name "*.html" -o -name "Caddyfile" \) \
  2>/dev/null)

count=0
for file in $FILES; do
  if grep -q "Impulsala\|impulsala\|IMPULSALA" "$file" 2>/dev/null; then
    sed -i 's/Impulsala/Impulsala/g' "$file"
    sed -i 's/impulsala/impulsala/g' "$file"
    sed -i 's/IMPULSALA/IMPULSALA/g' "$file"
    count=$((count + 1))
    echo "  ✓ $file"
  fi
done

echo ""
echo "✅ $count archivos actualizados"
echo ""
echo "Verificando..."
remaining=$(grep -rl "Impulsala\|impulsala" src/ 2>/dev/null | wc -l)
echo "Apariciones restantes: $remaining"
