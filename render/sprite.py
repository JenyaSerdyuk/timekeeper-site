import os, json, sys, math
from PIL import Image
d = sys.argv[1]  # e.g. /home/claude/img/xv/
COLS, ROWS = 4, 3; PER = COLS * ROWS
meta = json.load(open(d + 'meta.json')); sp = {}
for st in ('a', 'b'):
    fs = sorted(f for f in os.listdir(d) if f.startswith(st) and f[1:3].isdigit() and f.endswith('.jpg'))
    if not fs: continue
    w, h = Image.open(d + fs[0]).size
    nch = math.ceil(len(fs) / PER)
    for c in range(nch):
        sheet = Image.new('RGB', (w * COLS, h * ROWS), (237, 237, 237))
        for j, f in enumerate(fs[c * PER:(c + 1) * PER]):
            sheet.paste(Image.open(d + f), ((j % COLS) * w, (j // COLS) * h))
        sheet.save(d + '%ss%d.jpg' % (st, c), quality=80, optimize=True, progressive=True)
    sp[st] = {'cols': COLS, 'rows': ROWS, 'per': PER, 'n': len(fs), 'chunks': nch}
meta['sp'] = sp
json.dump(meta, open(d + 'meta.json', 'w'))
print(d, sp)
