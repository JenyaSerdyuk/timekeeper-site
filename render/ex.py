import bpy, bmesh, math, sys, os, json
from mathutils import Vector, Matrix
sys.path.insert(0, '/tmp/claude-0/r')
import tk
tk.FIN['gold'] = ((1.0, 0.62, 0.2), 0.2)
from tk import metal, mat_emit_img, mat_simple, link, apply_mods, rounded_rect_mesh, boolean_cut, smooth, cyl, softbox

EX = '/tmp/claude-0/ex/'
R = tk.R

def disc(name, r, z0, z1, top_bev=0.0, bot_bev=0.0, verts=192, inner=None):
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=True, radius=r, segments=verts)
    f = [f for f in bm.faces][0]
    for v in bm.verts: v.co.z = z0
    ext = bmesh.ops.extrude_face_region(bm, geom=[f])
    for v in ext['geom']:
        if isinstance(v, bmesh.types.BMVert): v.co.z = z1
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.edges.ensure_lookup_table()
    def rim(z): return [e for e in bm.edges if all(abs(v.co.z - z) < 1e-4 for v in e.verts) and all(abs(math.hypot(v.co.x, v.co.y) - r) < 1e-3 for v in e.verts)]
    if top_bev > 0: bmesh.ops.bevel(bm, geom=rim(z1), offset=top_bev, segments=8, profile=0.5, affect='EDGES')
    if bot_bev > 0:
        bm.edges.ensure_lookup_table()
        bmesh.ops.bevel(bm, geom=rim(z0), offset=bot_bev, segments=8, profile=0.5, affect='EDGES')
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = link(bpy.data.objects.new(name, me))
    if inner:
        c = cyl('c', inner, (z1 - z0) + 4, verts); c.location.z = (z0 + z1) / 2
        boolean_cut(o, c)
    return o

def box(name, w, h, d, z0, x=0, y=0, r=0.15, mat=None):
    o = rounded_rect_mesh(name, w, h, min(r, w/2-0.01, h/2-0.01), d, seg=4)
    o.location = (x, y, z0 + d/2)
    if mat: o.data.materials.append(mat)
    return o

def tex_mat(name, path, rough=0.4, coat=0.5, metal_=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    N = m.node_tree.nodes; L = m.node_tree.links; p = N['Principled BSDF']
    t = N.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(path)
    L.new(t.outputs['Color'], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = rough; p.inputs['Coat Weight'].default_value = coat; p.inputs['Metallic'].default_value = metal_
    return m

def planar_uv(o, w, h, cx=0, cy=0):
    me = o.data; uvl = me.uv_layers.new()
    for poly in me.polygons:
        for li in poly.loop_indices:
            v = me.vertices[me.loops[li].vertex_index].co
            uvl.data[li].uv = ((v.x - cx) / w + 0.5, (v.y - cy) / h + 0.5)

PARTS = {}
def part(key, objs, dz, dx=0.0, label=None, anchor_r=20.0):
    g = bpy.data.objects.new('g_' + key, None); link(g)
    for o in objs: o.parent = g
    PARTS[key] = dict(g=g, dz=dz, dx=dx, label=label, ar=anchor_r)
    return g

def build():
    sc = tk.reset()
    fin = os.environ.get('FIN', 'silver')
    mf = metal('face', fin, radial=True, aniso=0.9, rough=0.36)
    ms = metal('side', fin, radial=False, aniso=0.6)
    # ---- face plate (top) z 3.5..5.5, window through-hole
    face = disc('face', 20.0, 4.1, 5.5, top_bev=1.0, bot_bev=0.2)
    cut = rounded_rect_mesh('cut', 25.6, 7.2, 1.8, 6); cut.location.z = 4.8
    boolean_cut(face, cut)
    face.data.materials.append(mf); face.data.materials.append(ms)
    for p in face.data.polygons: p.material_index = 0 if abs(p.normal.z) > 0.92 else 1
    smooth(face)
    # ---- glass
    glass = rounded_rect_mesh('glass', 25.4, 7.0, 1.7, 0.7, seg=8); glass.location.z = 4.95
    md = glass.modifiers.new('b','BEVEL'); md.width = 0.15; md.segments = 3; apply_mods(glass)
    gm = bpy.data.materials.new('gl'); gm.use_nodes = True; gp = gm.node_tree.nodes['Principled BSDF']
    gp.inputs['Base Color'].default_value = (0.92, 0.95, 0.97, 1); gp.inputs['Roughness'].default_value = 0.02
    gp.inputs['Transmission Weight'].default_value = 1.0; gp.inputs['IOR'].default_value = 1.45
    glass.data.materials.append(gm)
    gp.inputs['Roughness'].default_value = 0.04; gp.inputs['Base Color'].default_value = (0.85, 0.92, 0.95, 1)
    # ---- display module
    blk = mat_simple('blk', (0.012, 0.012, 0.013), 0.45, coat=0.4)
    dmod = rounded_rect_mesh('dmod', 31.0, 11.5, 1.2, 1.1, seg=6); dmod.location.z = 3.55; dmod.data.materials.append(blk)
    dface = rounded_rect_mesh('dface', 25.4, 7.0, 1.6, 0.45, seg=6); dface.location.z = 4.325
    planar_uv(dface, 25.4, 7.0)
    dface.data.materials.append(mat_emit_img('dispm', R + 'disp.png', 2.2))
    pins = []
    pm = metal('pin', fin, rough=0.25, aniso=0.0)
    for i in range(10):
        for sy in (-1, 1):
            pn = box('pin', 0.6, 0.9, 0.35, 2.65, x=-11.25 + i*2.5, y=sy*5.3, r=0.1, mat=pm); pins.append(pn)
    # ---- logic board
    pcb = disc('pcb', 17.6, 0.0, 1.0, verts=160)
    planar_uv(pcb, 35.2, 35.2)
    pcb.data.materials.append(tex_mat('pcbm', EX + 'pcb.png', rough=0.38, coat=0.7))
    comps = []
    chipm = tex_mat('chipm', EX + 'chip.png', rough=0.5, coat=0.2)
    c1 = box('se', 6.0, 6.0, 0.9, 1.0, x=-5.5, y=6.0, r=0.3); planar_uv(c1, 6, 6, -5.5, 6.0); c1.data.materials.append(chipm); comps.append(c1)
    c2 = box('mcu', 5.0, 5.0, 0.8, 1.0, x=5.5, y=6.5, r=0.25, mat=blk); comps.append(c2)
    xt = box('xtal', 3.2, 1.6, 0.8, 1.0, x=0.5, y=10.5, r=0.4, mat=pm); comps.append(xt)
    sw = box('switch', 3.2, 3.6, 1.6, 1.0, x=15.2, y=-5.5, r=0.2, mat=pm); comps.append(sw)
    swb = box('swb', 1.2, 1.4, 1.0, 1.4, x=16.9, y=-5.5, r=0.2, mat=blk); comps.append(swb)
    ceram = mat_simple('cer', (0.55, 0.50, 0.42), 0.45)
    wht = mat_simple('wht', (0.85, 0.85, 0.84), 0.4)
    import random; random.seed(3)
    spots = [(-10, -2), (-8, -6), (-12, 3), (-2, -9), (2, -11), (6, -10), (9, -3), (11, 2), (-1, 3), (2, 2), (-4, -3), (13, 8), (-13, -7), (8, 12), (-9, 11), (0, -4), (4, -5), (-6, 1), (10, -8), (-3, 12)]
    for (x, y) in spots:
        rot = random.random() < 0.5
        w, h = (1.6, 0.8) if not rot else (0.8, 1.6)
        comps.append(box('smd', w, h, 0.5, 1.0, x=x, y=y, r=0.08, mat=random.choice([ceram, ceram, blk, wht])))
    fpc = box('fpc', 8.0, 2.4, 0.15, 1.0, x=0, y=-1, r=0.3, mat=mat_simple('fpc', (0.45, 0.27, 0.08), 0.35, coat=0.6)); comps.append(fpc)
    # ---- battery (coin cell)
    bat = disc('bat', 10.0, -3.4, -0.2, top_bev=0.35, bot_bev=0.35, verts=128)
    bm_ = metal('batm', 'silver', radial=True, aniso=0.4, rough=0.22)
    bat.data.materials.append(bm_); smooth(bat)
    bat2 = disc('bat2', 8.6, -0.2, 0.0, verts=128); bat2.data.materials.append(bm_)
    # ---- case ring z -3.5..3.5 with button hole
    ring = disc('ring', 20.0, -3.5, 4.1, verts=192, inner=18.4)
    bh = cyl('bh', 1.15, 6, 48); bh.rotation_euler = (0, math.radians(90), 0); bh.location = (19.2, -5.5, 0.3)
    boolean_cut(ring, bh)
    ring.data.materials.append(ms); smooth(ring)
    # ---- button
    btn = cyl('btn', 1.0, 2.6, 48); btn.rotation_euler = (0, math.radians(90), 0); btn.location = (19.9, -5.5, 0.3)
    md = btn.modifiers.new('b', 'BEVEL'); md.width = 0.25; md.segments = 4; apply_mods(btn)
    btn.data.materials.append(ms); smooth(btn)
    # ---- back cover z -5.5..-3.5 with 3 screw holes
    back = disc('back', 20.0, -5.5, -3.5, top_bev=0.25, bot_bev=1.3)
    sp = [(16.0 * math.cos(math.radians(a)), 16.0 * math.sin(math.radians(a))) for a in (90, 210, 330)]
    for (x, y) in sp:
        h = cyl('sh', 1.5, 1.2, 48); h.location = (x, y, -5.5); boolean_cut(back, h)
    mb = metal('backf', fin, radial=True, aniso=0.9, rough=0.32)
    back.data.materials.append(mb); back.data.materials.append(ms)
    for p in back.data.polygons: p.material_index = 0 if abs(p.normal.z) > 0.92 else 1
    smooth(back)
    # ---- screws
    scr = []
    for (x, y) in sp:
        hd = cyl('head', 1.4, 0.6, 48); hd.location = (x, y, -5.2)
        md = hd.modifiers.new('b', 'BEVEL'); md.width = 0.2; md.segments = 3; apply_mods(hd)
        slot = rounded_rect_mesh('slot', 1.7, 0.35, 0.1, 1.0, seg=2); slot.location = (x, y, -5.5)
        boolean_cut(hd, slot)
        sh = cyl('shaft', 0.75, 4.0, 32); sh.location = (x, y, -3.0)
        for o in (hd, sh): o.data.materials.append(pm); smooth(o); scr.append(o)
    # ---- parts and explode offsets (final positions), centred
    part('face', [face], 41, label='Brushed steel face')
    part('glass', [glass], 28, label='Protective glass', anchor_r=13.7)
    part('display', [dmod, dface] + pins, 17, label='Red LED display', anchor_r=15.5)
    part('board', [pcb] + comps, 6, label='Logic board · secure chip', anchor_r=17.6)
    part('battery', [bat, bat2], -3.5, label='Battery', anchor_r=10)
    part('ring', [ring], -15, label='Steel case', anchor_r=20)
    part('button', [btn], -15, dx=7, label='Side button', anchor_r=1.4)
    part('back', [back], -26, label='Back cover', anchor_r=20)
    part('screws', scr, -36, label='Screws', anchor_r=17.4)
    return sc

def setup_camera(sc, W, H):
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); link(cam)
    cam.data.lens = 85; cam.data.sensor_fit = 'VERTICAL'; cam.data.sensor_height = 24
    el = math.radians(33); az = math.radians(-90)
    fov_h = 24.0  # sensor
    span = 114.0  # mm vertical to fit
    dist = span * 85 / 24.0
    tgt = Vector((0, 0, 0.5))
    cam.location = tgt + Vector((math.cos(az) * math.cos(el), math.sin(az) * math.cos(el), math.sin(el))) * dist
    f = (tgt - cam.location).normalized(); upw = Vector((0, 0, 1))
    rgt = f.cross(upw).normalized(); up2 = rgt.cross(f).normalized()
    M = Matrix((rgt, up2, -f)).transposed().to_4x4(); M.translation = cam.location
    cam.matrix_world = M; sc.camera = cam
    sc.render.resolution_x = W; sc.render.resolution_y = H
    cam['dir'] = list((cam.location - tgt).normalized()); cam['tgt'] = list(tgt)
    return cam, dist, rgt

def lights(dist):
    s = dist / 100.0
    c = Vector((0, 0, 0))
    # camera is at -Y; key from upper left front, rim from back
    softbox('key', (40*s, 120*s), (-90*s, -70*s, 90*s), c, 3.0)
    softbox('fill', (120*s, 50*s), (110*s, -60*s, 40*s), c, 0.8)
    softbox('top', (120*s, 120*s), (0, 0, 160*s), c, 1.6)
    softbox('rimL', (14*s, 160*s), (-120*s, 90*s, 30*s), c, 3.0)
    softbox('rimR', (14*s, 160*s), (120*s, 90*s, 20*s), c, 2.5)
    softbox('strip', (12*s, 200*s), (40*s, -90*s, 120*s), c, 1.2)
    softbox('front', (160*s, 60*s), (0, -150*s, 60*s), c, 0.9)
    for o in bpy.data.objects:
        if o.type == 'MESH' and o.name.split('.')[0] in ('key','fill','top','rimL','rimR','strip','front'):
            o.visible_shadow = False

def ease(t): return t*t*(3-2*t)

def run(frames, W, H, samples, outdir):
    sc = build()
    cam, dist, rgt = setup_camera(sc, W, H)
    lights(dist)
    nt = sc.world.node_tree; bg = nt.nodes['Background']; bg.inputs[1].default_value = 1.0
    env = [n for n in nt.nodes if n.type == 'TEX_ENVIRONMENT'][0]
    mix = nt.nodes.new('ShaderNodeMixRGB'); mix.blend_type = 'ADD'; mix.inputs[0].default_value = 1.0
    mix.inputs[2].default_value = (0.32, 0.32, 0.33, 1)
    mul = nt.nodes.new('ShaderNodeMixRGB'); mul.blend_type = 'MULTIPLY'; mul.inputs[0].default_value = 1.0; mul.inputs[2].default_value = (0.85, 0.85, 0.85, 1)
    nt.links.new(env.outputs[0], mul.inputs[1]); nt.links.new(mul.outputs[0], mix.inputs[1]); nt.links.new(mix.outputs[0], bg.inputs[0])
    # shadow catcher
    bpy.ops.mesh.primitive_plane_add(size=600, location=(0, 0, -5.6))
    fl = bpy.context.active_object; fl.is_shadow_catcher = True
    sc.cycles.samples = samples
    root = bpy.data.objects.new('root', None); link(root)
    for k, P in PARTS.items(): P['g'].parent = root
    os.makedirs(outdir, exist_ok=True)
    NFR = int(frames[2])
    meta = []
    for i in range(int(frames[0]), int(frames[1])):
        if os.environ.get('ODD') and i % 2 == 0: continue
        TURN = os.environ.get('TURN')
        if TURN:
            t = 1.0 if TURN == 'B' else 0.0
            root.rotation_euler = (0, 0, math.radians(-28 + 26 * t + 360.0 * i / NFR))
        else:
            t = ease(i / (NFR - 1))
            root.rotation_euler = (0, 0, math.radians(-28 + 26 * t))
        span = 74 + (114 - 74) * t; dd = span * 85 / 24.0
        cam.location = Vector(cam['tgt']) + Vector(cam['dir']) * dd
        lowest = 0
        for k, P in PARTS.items():
            P['g'].location = (P['dx'] * t, 0, P['dz'] * t)
        bpy.context.view_layer.update()
        zmin = min((o.matrix_world @ Vector(c)).z for P in PARTS.values() for o in P['g'].children for c in o.bound_box)
        fl.location.z = zmin - 0.05
        from bpy_extras.object_utils import world_to_camera_view
        fm = {}
        for k, P in PARTS.items():
            g = P['g']; o0 = g.children[0]
            pts = [g.matrix_world @ (g.matrix_parent_inverse @ Vector(c)) for o in g.children for c in o.bound_box]
            pts = [o.matrix_world @ Vector(c) for o in g.children for c in o.bound_box]
            cz = sum(p.z for p in pts) / len(pts)
            if k == 'button':
                cx = sum(p.x for p in pts) / len(pts); cy = sum(p.y for p in pts) / len(pts)
                wp = Vector((cx, cy, cz)) + rgt * P['ar']
            else:
                wp = (root.matrix_world @ Vector((0, 0, 0))) + Vector((0, 0, cz)) + rgt * P['ar']
            v = world_to_camera_view(sc, cam, wp)
            fm[k] = [round(v.x, 4), round(1 - v.y, 4)]
        meta.append(fm)
        sc.render.filepath = os.path.join(outdir, '%02d.png' % i)
        if not os.environ.get('NORENDER'):
            bpy.ops.render.render(write_still=True)
    with open(os.path.join(outdir, 'meta_%d_%d.json' % (int(frames[0]), int(frames[1]))), 'w') as fh:
        json.dump({'labels': {k: P['label'] for k, P in PARTS.items()}, 'frames': meta}, fh)

if __name__ == '__main__':
    a = sys.argv[sys.argv.index('--') + 1:]
    start, end, nfr, W, H, samples, outdir = a
    run((start, end, nfr), int(W), int(H), int(samples), outdir)
