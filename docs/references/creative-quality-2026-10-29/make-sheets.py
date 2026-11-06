from PIL import Image, ImageDraw
from pathlib import Path
import json
base=Path('out/creative-quality-2026-10-29')
r=json.loads((base/'render-record.json').read_text())
for kind in ['baseline','stress']:
 for canvas in ['vertical','square','landscape']:
  frames=[f for f in r['frames'] if f['kind']==kind and f['canvas']==canvas]
  if len(frames)!=8: continue
  tw=320 if canvas=='vertical' else 480
  th=round(frames[0]['height']*tw/frames[0]['width'])
  sheet=Image.new('RGB',(tw*4,(th+30)*2),'#26303b');d=ImageDraw.Draw(sheet)
  for i,f in enumerate(frames):
   x=(i%4)*tw;y=(i//4)*(th+30)
   im=Image.open(f['path']).convert('RGB');im.thumbnail((tw,th));sheet.paste(im,(x,y+30))
   d.text((x+5,y+7),f"{kind} {canvas} {f['scene']} f{f['frame']}",fill='white')
  dest=base/f'{kind}-{canvas}-sheet.png';sheet.save(dest);print(dest)
