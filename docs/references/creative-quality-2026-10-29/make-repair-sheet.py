from PIL import Image, ImageDraw
from pathlib import Path
import json
base=Path('out/creative-quality-2026-10-29');r=json.loads((base/'repair-record.json').read_text())
frames=[f for f in r['frames'] if f['kind']=='stress']
if len(frames)==9:
 w=540;h=600;sheet=Image.new('RGB',(w*3,h*3),'#26303b');d=ImageDraw.Draw(sheet)
 for i,f in enumerate(frames):
  x=(i%3)*w;y=(i//3)*h;im=Image.open(f['path']).convert('RGB');im.thumbnail((w,h-30));sheet.paste(im,(x+(w-im.width)//2,y+30));d.text((x+5,y+8),f"{f['canvas']} {f['scene']} f{f['frame']}",fill='white')
 dest=base/'repaired-stress-sheet.png';sheet.save(dest);print(dest)
else:print(f'Waiting for repair batch: {len(frames)}/9 stress frames')
