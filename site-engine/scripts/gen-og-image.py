#!/usr/bin/env python3
"""
gen-og-image.py — Gera og:image 1200×630 para cliente
Uso: python3 scripts/gen-og-image.py --name "Dra. Maria" --primary "#9A6862" --accent "#C4924A" [--logo logo.png] [--out og-image.jpg]
Requer: pip install Pillow
"""
import argparse, os, sys
try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Erro: Pillow não instalado. Execute: pip install Pillow"); sys.exit(1)

def hex_rgb(h: str) -> tuple:
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def darken(rgb: tuple, pct: float = 0.25) -> tuple:
    return tuple(max(0, int(c * (1 - pct))) for c in rgb)

def gen(name: str, specialty: str, primary: str, accent: str, logo: str | None, out: str) -> None:
    W, H = 1200, 630
    bg = hex_rgb(primary)
    bg_dark = darken(bg)

    img = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(img)

    # Gradiente simples (topo → escuro)
    for y in range(H):
        t = y / H
        c = tuple(int(bg[i] + (bg_dark[i] - bg[i]) * t) for i in range(3))
        draw.line([(0, y), (W, y)], fill=c)

    # Barra lateral accent
    draw.rectangle([(0, 0), (10, H)], fill=hex_rgb(accent))

    # Logo (se fornecido)
    if logo and os.path.exists(logo):
        try:
            lg = Image.open(logo).convert("RGBA")
            lg.thumbnail((100, 100))
            img.paste(lg, (80, 70), lg)
        except Exception as e:
            print(f"  ⚠️  Logo não carregado: {e}")

    # Fontes (usa sistema macOS/Linux)
    font_candidates = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    def load_font(size: int):
        for fc in font_candidates:
            if os.path.exists(fc):
                try: return ImageFont.truetype(fc, size)
                except: pass
        return ImageFont.load_default()

    white = (255, 255, 255)
    muted = (200, 200, 200)

    draw.text((80, 200), name, font=load_font(72), fill=white)
    if specialty:
        draw.text((80, 290), specialty, font=load_font(32), fill=muted)
    draw.text((80, H - 60), "jbdigitalsystem.com", font=load_font(22), fill=(170, 170, 170))

    img.save(out, "JPEG", quality=92)
    print(f"✓ og:image salvo: {out} (1200×630)")

def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--name", required=True)
    p.add_argument("--specialty", default="")
    p.add_argument("--primary", required=True)
    p.add_argument("--accent", required=True)
    p.add_argument("--logo", default=None)
    p.add_argument("--out", default="og-image.jpg")
    a = p.parse_args()
    gen(a.name, a.specialty, a.primary, a.accent, a.logo, a.out)

if __name__ == "__main__":
    main()
