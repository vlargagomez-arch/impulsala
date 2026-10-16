#!/usr/bin/env python3
"""
Quita el fondo blanco de un logo PNG y lo hace transparente.
Útil para logos que se deben ver bien en modo claro y oscuro.
"""
import sys
from PIL import Image

def remove_white_background(input_path, output_path, threshold=240):
    """
    Convierte píxeles blancos/casi blancos en transparentes.
    """
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            # Si el pixel es blanco o casi blanco, hacerlo transparente
            if r > threshold and g > threshold and b > threshold:
                pixels[x, y] = (r, g, b, 0)
            # Si es casi blanco pero tiene algo de color, reducir opacidad
            elif r > 200 and g > 200 and b > 200:
                # Calcular opacidad basada en qué tan blanco es
                opacity = int(255 * (255 - r) / 55)
                pixels[x, y] = (r, g, b, opacity)

    img.save(output_path, "PNG")
    print(f"✅ Fondo removido: {output_path}")

if __name__ == "__main__":
    input_path = sys.argv[1] if len(sys.argv) > 1 else "/tmp/trackela-transparent.png"
    output_path = sys.argv[2] if len(sys.argv) > 2 else "/home/z/my-project/public/trackela-logo.png"
    remove_white_background(input_path, output_path)
