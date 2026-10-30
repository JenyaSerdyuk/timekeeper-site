import os, json, sys, math
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]   # src prefix e.g. /tmp/claude-0/ex/kg  -> kg_E kg_A kg_B
col_override = float(sys.argv[3]) if len(sys.argv) > 3 else None
os.makedirs(dst, exist_ok=True)
for f in os.listdir(dst): os.remove(os.path.join(dst, f))
def comp(s, d):
    im = Image.open(s).convert('RGBA'); bg = Image.new('RGBA', im.size, (237,237,237,255)); bg.alpha_composite(im)
    bg.convert('RGB').save(d, quality=84, optimize=True, progressive=True)
def frames(d): return sorted(f for f in os.listdir(d) if f.endswith('.png')) if os.path.isdir(d) else []
def meta(d):
    m = [f for f in os.listdir(d) if f.startswith('meta_')]; return json.load(open(os.path.join(d, m[0]))) if m else None
E = frames(src+'_E'); em = meta(src+'_E')
for i, f in enumerate(E): comp(os.path.join(src+'_E', f), os.path.join(dst, 'e%02d.jpg' % i))
COLS, ROWS = 4, 3; PER = 12; sp = {}; na = 0; b = []
for st in ('A', 'B'):
    fs = frames(src+'_'+st)
    if not fs: continue
    tmp = []
    for f in fs:
        im = Image.open(os.path.join(src+'_'+st, f)).convert('RGBA'); bg = Image.new('RGBA', im.size, (237,237,237,255)); bg.alpha_composite(im); tmp.append(bg.convert('RGB'))
    w, h = tmp[0].size; nch = math.ceil(len(tmp) / PER)
    for c in range(nch):
        sheet = Image.new('RGB', (w*COLS, h*ROWS), (237,237,237))
        for j, im in enumerate(tmp[c*PER:(c+1)*PER]): sheet.paste(im, ((j % COLS)*w, (j // COLS)*h))
        sheet.save(os.path.join(dst, '%ss%d.jpg' % (st.lower(), c)), quality=80, optimize=True, progressive=True)
    sp[st.lower()] = {'cols': COLS, 'rows': ROWS, 'per': PER, 'n': len(tmp), 'chunks': nch}
    if st == 'A': na = len(tmp)
    else: b = meta(src+'_B')['frames']
labels = em['labels']
for k, v in list(labels.items()):
    if v.startswith('Logic board'): labels[k] = 'Logic board'
    if v.startswith('Back plate'): labels[k] = 'Back plate'
if 'gold' in dst or dst.rstrip('/').endswith('g'):
    G={'Brushed steel face':'Gold face','Steel case':'Gold case','Steel case · bail':'Gold case · bail','Brushed steel panel':'Gold panel','Steel frame':'Gold frame'}
    labels={k:G.get(v,v) for k,v in labels.items()}
mx = max(v[0] for v in em['frames'][-1].values())
col = col_override or round(min(0.80, max(0.74, mx + 0.04)), 3)
json.dump({'labels': labels, 'e': em['frames'], 'b': b, 'na': na, 'col': col, 'sp': sp}, open(os.path.join(dst, 'meta.json'), 'w'))
print(dst, len(E), na, len(b), col, sp)
