import os, json, sys
from PIL import Image
EX='/tmp/claude-0/ex/'
prod = sys.argv[1]; DST = '/home/claude/img/' + {'pendant': 'xvp', 'painting': 'xva'}[prod] + '/'
os.makedirs(DST, exist_ok=True)
def comp(src, dst):
    im = Image.open(src).convert('RGBA'); bg = Image.new('RGBA', im.size, (237,237,237,255)); bg.alpha_composite(im)
    bg.convert('RGB').save(dst, quality=84, optimize=True, progressive=True)
def frames(d):
    return sorted(f for f in os.listdir(d) if f.endswith('.png')) if os.path.isdir(d) else []
out = {}
E = frames(EX+prod+'_E'); em = json.load(open(EX+prod+'_E/meta_0_%d.json' % len(E)))
for i, f in enumerate(E): comp(EX+prod+'_E/'+f, DST+'e%02d.jpg' % i)
A = frames(EX+prod+'_A'); na = 0
if len(A) == 48 and os.path.exists(EX+prod+'_A/meta_0_48.json'):
    for i, f in enumerate(A): comp(EX+prod+'_A/'+f, DST+'a%02d.jpg' % i)
    na = 48
B = frames(EX+prod+'_B'); b = []
if len(B) == 48 and os.path.exists(EX+prod+'_B/meta_0_48.json'):
    for i, f in enumerate(B): comp(EX+prod+'_B/'+f, DST+'b%02d.jpg' % i)
    b = json.load(open(EX+prod+'_B/meta_0_48.json'))['frames']
mx = max(v[0] for v in em['frames'][-1].values())
col = round(min(0.80, max(0.74, mx + 0.04)), 3)
if prod == 'painting':
    em['labels']['back'] = 'Back plate'; col = 0.76
json.dump({'labels': em['labels'], 'e': em['frames'], 'b': b, 'na': na, 'col': col}, open(DST+'meta.json', 'w'))
print(prod, len(E), na, len(b), col)
