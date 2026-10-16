#!/bin/bash
# Cambia Impulsala → Impulsala en todo el proyecto
# Mantiene la estructura, solo cambia el nombre

set -e

cd /home/z/my-project

echo "📝 Cambiando Impulsala → Impulsala en todos los archivos..."
echo ""

# Lista de archivos a procesar (excluyendo node_modules, .next, etc.)
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
  -not -name "*.db.backup" \
  -not -name "google-token.json" \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.sh" -o -name "*.env*" -o -name "*.yml" -o -name "*.yaml" -o -name "*.prisma" -o -name "*.css" -o -name "*.html" -o -name "Caddyfile" \) \
  2>/dev/null)

count=0
for file in $FILES; do
  if grep -q "Impulsala\|impulsala\|impulsala\|IMPULSALA\|impulsala\|Impulsala" "$file" 2>/dev/null; then
    # Impulsala → Impulsala
    sed -i 's/Impulsala/Impulsala/g' "$file"
    # impulsala → impulsala
    sed -i 's/impulsala/impulsala/g' "$file"
    # IMPULSALA → IMPULSALA
    sed -i 's/IMPULSALA/IMPULSALA/g' "$file"
    # impulsala → impulsala
    sed -i 's/impulsala/impulsala/g' "$file"
    # "Impulsala" → "Impulsala"
    sed -i 's/Impulsala/Impulsala/g' "$file"
    # impulsala → impulsala
    sed -i 's/impulsala/impulsala/g' "$file"
    # ImpulsaBot / impulsabot → ImpulsaBot / impulsabot
    sed -i 's/ImpulsaBot/ImpulsaBot/g' "$file"
    sed -i 's/impulsabot/impulsabot/g' "$file"
    count=$((count + 1))
    echo "  ✓ $file"
  fi
done

echo ""
echo "✅ $count archivos actualizados"
echo ""

# Casos especiales - nombres de paquete
echo "📝 Actualizando package.json..."
if [ -f "package.json" ]; then
  sed -i 's/"name": "nextjs_tailwind_shadcn_ts"/"name": "impulsala"/' package.json
  echo "  ✓ package.json"
fi

# Actualizar .env
echo "📝 Actualizando .env..."
if [ -f ".env" ]; then
  # Mantener credenciales pero cambiar nombres
  sed -i 's/admin@impulsala.co/admin@impulsala.co/g' .env
  sed -i 's/contacto@impulsala.co/contacto@impulsala.co/g' .env
  sed -i 's|https://impulsala.co|https://impulsala.co|g' .env
  echo "  ✓ .env"
fi

echo ""
echo "🎉 Cambio completado!"
echo ""
echo "Verificando cambios..."
remaining=$(grep -rl "Impulsala\|impulsala" src/ 2>/dev/null | wc -l)
echo "Apariciones restantes en src/: $remaining"
