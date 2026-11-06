from PIL import Image,ImageChops,ImageDraw
from pathlib import Path
import json
base=Path('out/creative-quality-2026-10-29');r=json.loads((base/'repair-record.json').read_text());rows=[]
for f in r['frames']:
 if f['kind']!='baseline':continue
 old=base/(('baseline-' if f['offset']==60 else 'boundary-')+f['canvas']+'-'+f['scene']+'-f'+str(f['frame'])+'.png')
 bbox=ImageChops.difference(Image.open(old).convert('RGB'),Image.open(f['path']).convert('RGB')).getbbox()
 rows.append({'canvas':f['canvas'],'scene':f['scene'],'frame':f['frame'],'identicalPixels':bbox is None,'differenceBounds':bbox})
(base/'baseline-comparison.json').write_text(json.dumps(rows,indent=2))
print(json.dumps({'compared':len(rows),'pixelIdentical':sum(r['identicalPixels'] for r in rows),'changed':[r for r in rows if not r['identicalPixels']]}))
