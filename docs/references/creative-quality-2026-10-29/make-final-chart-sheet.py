from PIL import Image,ImageDraw,ImageChops
from pathlib import Path
import json
base=Path('out/creative-quality-2026-10-29');r=json.loads((base/'final-chart-record.json').read_text());frames=[f for f in r['frames'] if f['kind']=='spring-stress']
if len(frames)!=6:raise Exception('Final frame batch incomplete')
w=540;h=600;sheet=Image.new('RGB',(2*w,3*h),'#26303b');d=ImageDraw.Draw(sheet)
for i,f in enumerate(frames):
 x=(i%2)*w;y=(i//2)*h;im=Image.open(f['path']).convert('RGB');im.thumbnail((w,h-30));sheet.paste(im,(x+(w-im.width)//2,y+30));d.text((x+6,y+8),f"{f['canvas']} decimal spring hold f{f['frame']}",fill='white')
sheet.save(base/'final-chart-spring-sheet.png')
compare=[]
for f in r['frames']:
 if f['kind']=='spring-stress':continue
 old=base/f"repaired-{f['kind']}-{f['canvas']}-chart-f{f['frame']}.png"
 compare.append({'kind':f['kind'],'canvas':f['canvas'],'frame':f['frame'],'identicalPixels':ImageChops.difference(Image.open(old).convert('RGB'),Image.open(f['path']).convert('RGB')).getbbox() is None})
(base/'final-chart-comparison.json').write_text(json.dumps(compare,indent=2))
print(json.dumps({'frames':len(r['frames']),'status':r['status'],'unchangedChartHolds':sum(c['identicalPixels'] for c in compare),'springSheet':str(base/'final-chart-spring-sheet.png')}))
