"""
Contact Sheet Generator for Personal Video Engine.
Takes key stills from out/ and tiles them into a single QA contact sheet.
Run via: uv run --with pillow tools/contact_sheet.py <OutputSheetName> <Image1> <Image2> ...
"""

import sys
import os
from PIL import Image, ImageDraw, ImageFont

def create_contact_sheet(output_path: str, image_paths: list[str], cols: int = 2):
    missing = [p for p in image_paths if not os.path.exists(p)]
    if missing:
        raise FileNotFoundError("Missing contact-sheet inputs: " + ", ".join(missing))
    if cols < 1:
        raise ValueError("cols must be positive")
    images = [Image.open(p) for p in image_paths]
    if not images:
        raise ValueError("No images supplied")

    n = len(images)
    rows = (n + cols - 1) // cols
    w, h = images[0].size
    
    # Scale each thumb to fit nicely in 1920-width contact sheet
    thumb_w = 960
    thumb_h = int(h * (thumb_w / w))
    
    sheet_w = thumb_w * cols
    sheet_h = thumb_h * rows
    
    sheet = Image.new("RGB", (sheet_w, sheet_h), color=(10, 15, 25))
    draw = ImageDraw.Draw(sheet)
    
    for idx, img in enumerate(images):
        r = idx // cols
        c = idx % cols
        x = c * thumb_w
        y = r * thumb_h
        
        resized = img.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        sheet.paste(resized, (x, y))
        
        # Border
        draw.rectangle([x, y, x + thumb_w - 1, y + thumb_h - 1], outline=(50, 70, 90), width=2)
        
        # Label
        label = os.path.basename(image_paths[idx])
        draw.rectangle([x + 16, y + 16, x + 16 + len(label) * 11, y + 44], fill=(0, 0, 0, 180))
        draw.text((x + 22, y + 20), label, fill=(88, 230, 217))
        
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    sheet.save(output_path, quality=95)
    print(f"Contact sheet generated: {output_path} ({sheet_w}x{sheet_h})")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python contact_sheet.py <out_sheet.png> <img1.png> <img2.png> ...")
        sys.exit(1)
    create_contact_sheet(sys.argv[1], sys.argv[2:])
