import os, json, shutil, sys
from PIL import Image
EX='/tmp/claude-0/ex/'; DST='/home/claude/img/xv/'
def comp(src, dst):
    im = Image.open(src).convert('RGBA'); bg = Image.new('RGBA', im.size, (237,237,237,255)); bg.alpha_composite(im)
    bg.convert('RGB').save(dst, quality=84, optimize=True, progressive=True)
for f in os.listdir(DST): os.remove(DST+f)
placeholder = len(sys.argv) > 1
# explode: 71 frames if odd frames available, else 36
odd = os.path.exists(EX+'out2/DONE') and not placeholder
if odd:
    em = json.load(open(EX+'out2m/meta_0_71.json'))
    for i in range(71):
        src = EX+('out/%02d.png' % (i//2) if i % 2 == 0 else 'out2/%02d.png' % i)
        comp(src, DST+'e%02d.jpg' % i)
    e = em['frames']; labels = em['labels']
else:
    em = json.load(open(EX+'out/meta_0_36.json'))
    for i in range(36): comp(EX+'out/%02d.png' % i, DST+'e%02d.jpg' % i)
    e = em['frames']; labels = em['labels']
labels['board'] = 'Logic board'
if os.path.exists(EX+'outA/DONE') and not placeholder:
    for i in range(60): comp(EX+'outA/%02d.png' % i, DST+'a%02d.jpg' % i)
else:
    for i in range(36): shutil.copy(DST+'e00.jpg', DST+'a%02d.jpg' % i)
if os.path.exists(EX+'outB/DONE') and not placeholder:
    for i in range(60): comp(EX+'outB/%02d.png' % i, DST+'b%02d.jpg' % i)
    b = json.load(open(EX+'outB/meta_0_60.json'))['frames']
else:
    last = '%02d' % (len(e)-1)
    for i in range(36): shutil.copy(DST+'e%s.jpg' % last, DST+'b%02d.jpg' % i)
    b = [e[-1]] * 36
json.dump({'labels': labels, 'e': e, 'b': b, 'na': (60 if os.path.exists(EX+'outA/DONE') and not placeholder else 36)}, open(DST+'meta.json', 'w'))
print(len(e), len(os.listdir(DST)))
