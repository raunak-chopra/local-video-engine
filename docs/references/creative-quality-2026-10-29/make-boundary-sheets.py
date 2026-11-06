from PIL import Image, ImageDraw
from pathlib import Path
import json
base=Path('out/creative-quality-2026-10-29');r=json.loads((base/'boundary-record.json').read_text())
for canvas in ['vertical','square','landscape']:
 frames=[f for f in r['frames'] if f['canvas']==canvas]
 for group in range(2):
  selected=frames[group*12:(group+1)*12];im0=Image.open(selected[0]['path']);tw=240 if canvas=='vertical' else 400;th=round(im0.height*tw/im0.width)
  sheet=Image.new('RGB',(tw*3,(th+24)*4),'#26303b');d=ImageDraw.Draw(sheet)
  for i,f in enumerate(selected):
   x=(i%3)*tw;y=(i//3)*(th+24);im=Image.open(f['path']).convert('RGB');im.thumbnail((tw,th));sheet.paste(im,(x,y+24));d.text((x+4,y+6),f"{f['scene']} f{f['frame']} offset {f['offset']}",fill='white')
  dest=base/f'boundary-{canvas}-{group+1}-sheet.png';sheet.save(dest);print(dest)
