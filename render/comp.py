import sys,glob,os
from PIL import Image
def bg(sz):
    import numpy as np
    y,x=np.mgrid[0:sz,0:sz]/sz
    d=np.sqrt((x-.5)**2*1.0+(y-.32)**2*1.2)
    v=np.clip(0.165-0.15*d*1.6,0.028,1)  # center ~ #2a, edge ~ #0a
    a=(v*255).astype('uint8'); return Image.fromarray(np.dstack([a,a,(a*1.02).clip(0,255).astype('uint8')]))
src,dst,q=sys.argv[1],sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 82
os.makedirs(dst,exist_ok=True); B=None
for f in sorted(glob.glob(src+'/*.png')):
    im=Image.open(f).convert('RGBA')
    if B is None or B.size!=im.size: B=bg(im.size[0])
    out=B.copy().convert('RGBA'); out.alpha_composite(im)
    out.convert('RGB').save(os.path.join(dst,os.path.basename(f)[:-4]+'.jpg'),quality=q,optimize=True,progressive=True)
