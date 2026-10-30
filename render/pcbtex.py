from PIL import Image, ImageDraw, ImageFilter
import random, math
random.seed(7)
S=2048; im=Image.new('RGB',(S,S),(16,17,18)); d=ImageDraw.Draw(im)
c=S/2; R=S/2
def inside(x,y,m=40): return math.hypot(x-c,y-c)<R-m
# traces
for _ in range(260):
    x=random.randrange(0,S); y=random.randrange(0,S)
    if not inside(x,y,80): continue
    w=random.choice([4,5,6,8]); col=(38,40,42)
    pts=[(x,y)]
    for k in range(random.randint(2,5)):
        dirn=random.choice([(1,0),(0,1),(-1,0),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)])
        L=random.randint(60,300); x2=x+dirn[0]*L; y2=y+dirn[1]*L
        if not inside(x2,y2,80): break
        pts.append((x2,y2)); x,y=x2,y2
    if len(pts)>1:
        d.line(pts,fill=col,width=w,joint='curve')
        for p in (pts[0],pts[-1]):
            r=w*1.6; d.ellipse([p[0]-r,p[1]-r,p[0]+r,p[1]+r],fill=(150,152,155)); d.ellipse([p[0]-r*.45,p[1]-r*.45,p[0]+r*.45,p[1]+r*.45],fill=(10,10,10))
# vias grid
for _ in range(120):
    x=random.randrange(0,S); y=random.randrange(0,S)
    if inside(x,y,90): d.ellipse([x-7,y-7,x+7,y+7],fill=(140,142,146)); d.ellipse([x-3,y-3,x+3,y+3],fill=(8,8,8))
# edge ring
d.ellipse([22,22,S-22,S-22],outline=(60,62,64),width=6)
# silkscreen text-ish ticks
for a in range(0,360,6):
    r1=R-60; r2=R-(78 if a%30==0 else 68)
    t=math.radians(a); d.line([(c+r1*math.cos(t),c+r1*math.sin(t)),(c+r2*math.cos(t),c+r2*math.sin(t))],fill=(120,122,124),width=3)
im=im.filter(ImageFilter.GaussianBlur(0.6)); im.save('pcb.png')
# chip top texture
ch=Image.new('RGB',(512,512),(14,14,15)); d=ImageDraw.Draw(ch)
d.ellipse([40,40,80,80],outline=(70,70,72),width=4)
for i,t in enumerate(['TK-SE','2026','ANCHOR']):
    d.text((120,180+i*70),t,fill=(95,96,98),font_size=56)
ch.save('chip.png')
