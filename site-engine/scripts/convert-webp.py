#!/usr/bin/env python3
"""
convert-webp.py — Converte fotos para WebP com recorte 4:5 (portrait)
Uso: python3 scripts/convert-webp.py <input_dir> [output_dir]
Requer: pip install Pillow
"""
import sys, os, pathlib
try:
    from PIL import Image
except ImportError:
    print("Erro: Pillow não instalado. Execute: pip install Pillow"); sys.exit(1)

def to_webp_45(src: pathlib.Path, dst: pathlib.Path, quality: int = 85) -> None:
    img = Image.open(src).convert("RGB")
    w, h = img.size
    ratio = 4 / 5  # largura / altura desejada
    if w / h > ratio:          # mais largo → cortar lados
        nw = int(h * ratio)
        img = img.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:                      # mais alto → cortar topo/base
        nh = int(w / ratio)
        img = img.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    img.save(dst, "WEBP", quality=quality, method=6)

def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    src_dir = pathlib.Path(sys.argv[1])
    dst_dir = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else src_dir / "webp"
    if not src_dir.is_dir():
        print(f"Erro: diretório não encontrado: {src_dir}"); sys.exit(1)
    dst_dir.mkdir(parents=True, exist_ok=True)
    exts = {".jpg", ".jpeg", ".png", ".heic", ".webp"}
    n = 0
    for f in sorted(src_dir.iterdir()):
        if f.suffix.lower() in exts and f.parent != dst_dir:
            dst = dst_dir / (f.stem + ".webp")
            to_webp_45(f, dst)
            print(f"  ✓ {f.name} → {dst.name}")
            n += 1
    print(f"\n{n} imagem(ns) convertida(s) em {dst_dir}")

if __name__ == "__main__":
    main()
