#!/bin/bash
# Empaqueta el proyecto completo en un ZIP descargable

set -e

PROJECT_DIR="/home/z/my-project"
OUTPUT_ZIP="/home/z/my-project/download/impulsa-proyecto.zip"

# Limpiar ZIP anterior
rm -f "$OUTPUT_ZIP"

cd "$PROJECT_DIR"

echo "📦 Creando ZIP del proyecto..."

# Crear ZIP excluyendo archivos pesados
zip -r "$OUTPUT_ZIP" . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".git/*" \
  -x "db/*" \
  -x "upload/*" \
  -x "tool-results/*" \
  -x "download/*" \
  -x "*.log" \
  -x "google-token.json" \
  -x ".DS_Store" \
  -q

echo ""
echo "✅ ZIP creado exitosamente:"
ls -lh "$OUTPUT_ZIP"

echo ""
echo "📁 Total archivos incluidos:"
unzip -l "$OUTPUT_ZIP" | tail -1