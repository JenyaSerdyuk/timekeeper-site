import bpy, bmesh, math, sys, os, json
from mathutils import Vector, Matrix
sys.path.insert(0, '/tmp/claude-0/ex'); sys.path.insert(0, '/tmp/claude-0/r')
import tk
from tk import metal, mat_emit_img, mat_simple, link, apply_mods, rounded_rect_mesh, poly_prism, boolean_cut, smooth, cyl
import ex
from ex import disc, box, tex_mat, planar_uv, part, PARTS, lights, ease
from bpy_extras.object_utils import world_to_camera_view

EX = '/tmp/claude-0/ex/'; R = tk.R

def cross_pts(a, L):
    return [(-a, L), (a, L), (a, a), (L, a), (L, -a), (a, -a), (a, -L), (-a, -L), (-a, -a), (-L, -a), (-L, a), (-a, a)]

def cross(name, a, L, z0, z1, rad=2.6, bev=0.0):
    o = poly_prism(name, cross_pts(a, L), z1 - z0)
    o.location.z = (z0 + z1) / 2
    md = o.modifiers.new('bv', 'BEVEL'); md.affect = 'EDGES'; md.width = rad; md.segments = 10; md.limit_method = 'ANGLE'; md.angle_limit = math.radians(60)
    apply_mods(o)
    if bev > 0:
        md = o.modifiers.new('b2', 'BEVEL'); md.width = bev; md.segments = 4; md.limit_method = 'ANGLE'; md.angle_limit = math.radians(30)
        apply_mods(o)
    return o

def glassmat():
    gm = bpy.data.materials.new('gl'); gm.use_nodes = True; gp = gm.node_tree.nodes['Principled BSDF']
    gp.inputs['Base Color'].default_value = (0.85, 0.92, 0.95, 1); gp.inputs['Roughness'].default_value = 0.04
    gp.inputs['Transmission Weight'].default_value = 1.0; gp.inputs['IOR'].default_value = 1.45
    return gm

def comps_on(z, spots, mats, chipm=None, blk=None, pm=None, chip_at=None, mcu_at=None, xt_at=None):
    out = []
    import random; random.seed(5)
    if chip_at:
        c1 = box('se', 6.0, 6.0, 0.9, z, x=chip_at[0], y=chip_at[1], r=0.3); planar_uv(c1, 6, 6, chip_at[0], chip_at[1]); c1.data.materials.append(chipm); out.append(c1)
    if mcu_at: out.append(box('mcu', 5.0, 5.0, 0.8, z, x=mcu_at[0], y=mcu_at[1], r=0.25, mat=blk))
    if xt_at: out.append(box('xtal', 3.2, 1.6, 0.8, z, x=xt_at[0], y=xt_at[1], r=0.4, mat=pm))
    for (x, y) in spots:
        rot = random.random() < 0.5
        w, h = (1.6, 0.8) if not rot else (0.8, 1.6)
        out.append(box('smd', w, h, 0.5, z, x=x, y=y, r=0.08, mat=random.choice(mats)))
    return out

def common_mats():
    fin = os.environ.get('FIN', 'silver')
    M = dict(
        face=metal('face', fin, aniso=0.85, rough=0.34, axis='X'),
        side=metal('side', fin, radial=False, aniso=0.6),
        pin=metal('pin', fin, rough=0.25, aniso=0.0),
        blk=mat_simple('blk', (0.012, 0.012, 0.013), 0.45, coat=0.4),
        cer=mat_simple('cer', (0.55, 0.50, 0.42), 0.45),
        wht=mat_simple('wht', (0.85, 0.85, 0.84), 0.4),
        pouch=mat_simple('pouch', (0.72, 0.73, 0.75), 0.32, metal_=0.85),
        chip=tex_mat('chipm', EX + 'chip.png', rough=0.5, coat=0.2),
        pcb=tex_mat('pcbm', EX + 'pcb.png', rough=0.38, coat=0.7),
        glass=glassmat(),
    )
    return M

def display_stack(M, w, h, zplate_bot, img, modw, modh, npins):
    """display module under the plate, emissive boss rising into the window, glass in the window"""
    dmod = rounded_rect_mesh('dmod', modw, modh, 1.2, 1.1, seg=6); dmod.location.z = zplate_bot - 0.55; dmod.data.materials.append(M['blk'])
    dface = rounded_rect_mesh('dface', w, h, 1.6, 0.45, seg=6); dface.location.z = zplate_bot + 0.225
    planar_uv(dface, w, h); dface.data.materials.append(mat_emit_img('dispm', img, 2.2))
    pins = []
    for i in range(npins):
        for sy in (-1, 1):
            pins.append(box('pin', 0.6, 0.9, 0.35, zplate_bot - 1.45, x=-(npins - 1) * 1.25 + i * 2.5, y=sy * (modh / 2 - 0.45), r=0.1, mat=M['pin']))
    glass = rounded_rect_mesh('glass', w, h, 1.7, 0.7, seg=8); glass.location.z = zplate_bot + 0.85
    md = glass.modifiers.new('b', 'BEVEL'); md.width = 0.15; md.segments = 3; apply_mods(glass)
    glass.data.materials.append(M['glass'])
    return [dmod, dface] + pins, [glass]

# ------------------------------------------------------------------ pendant
def build_pendant():
    sc = tk.reset(); M = common_mats()
    a, L = 7.2, 20.0
    # face plate z 3.1..4.5 with window
    face = cross('face', a, L, 3.1, 4.5, bev=0.7)
    cut = rounded_rect_mesh('cut', 30.4, 8.4, 1.8, 6); cut.location.z = 3.8; boolean_cut(face, cut)
    face.data.materials.append(M['face']); face.data.materials.append(M['side'])
    for p in face.data.polygons: p.material_index = 0 if abs(p.normal.z) > 0.92 else 1
    smooth(face, 40)
    disp, glass = display_stack(M, 30.2, 8.2, 3.1, R + 'disp.png', 34.0, 11.6, 10)
    # board: inner cross
    pcb = cross('pcb', a - 2.2, L - 2.2, 0.4, 1.2, rad=1.6)
    planar_uv(pcb, 40, 40); pcb.data.materials.append(M['pcb'])
    spots = [(-12, 2), (-14, -2), (12, 3), (14, -1), (-2, -12), (2, -14), (0, -9), (3, 13), (-3, 15), (9, -3), (-9, 3), (-5, -5), (5, 4), (0, 0), (-1, 6), (16, 2)]
    comps = comps_on(1.2, spots, [M['cer'], M['cer'], M['blk'], M['wht']], M['chip'], M['blk'], M['pin'], chip_at=(-3.5, 9.5), mcu_at=(-14.0, 0.0), xt_at=(13.5, 2.5))
    comps.append(box('switch', 3.2, 3.6, 1.6, 1.2, x=15.0, y=3.5, r=0.2, mat=M['pin']))
    # battery: flat pouch in the lower arm
    bat = rounded_rect_mesh('bat', 9.6, 13.0, 1.2, 2.6, seg=6, bevel=0.5, bseg=4); apply_mods(bat); bat.location = (0, -9.5, -1.0)
    bat.data.materials.append(M['pouch']); smooth(bat)
    tab = box('tab', 3.0, 2.0, 0.2, 0.25, x=0, y=-2.2, r=0.1, mat=M['pin'])
    # case ring (cross frame) z -3.1..3.1, with button hole on +X arm
    ring = cross('ring', a, L, -3.1, 3.1)
    inner = cross('in', a - 1.5, L - 1.5, -5, 5, rad=1.2); boolean_cut(ring, inner)
    bh = cyl('bh', 1.05, 6, 48); bh.rotation_euler = (0, math.radians(90), 0); bh.location = (L - 0.5, 3.5, 0.2); boolean_cut(ring, bh)
    ring.data.materials.append(M['side']); smooth(ring, 40)
    # bail on the ring
    bm_ = metal('bail', os.environ.get('FIN', 'silver'), aniso=0.4, rough=0.14)
    lug = rounded_rect_mesh('lug', 4.2, 4.0, 1.0, 3.6, bevel=0.5); apply_mods(lug); lug.location = (0, L + 1.2, 0)
    lug.data.materials.append(bm_); smooth(lug)
    bar = cyl('bail', 2.7, 6.6, 64); bar.rotation_euler = (0, math.radians(90), 0); bar.location = (0, L + 4.4, 0)
    md = bar.modifiers.new('b', 'BEVEL'); md.width = 0.5; md.segments = 4; apply_mods(bar)
    bar.data.materials.append(bm_); smooth(bar)
    # button
    btn = cyl('btn', 0.9, 2.4, 48); btn.rotation_euler = (0, math.radians(90), 0); btn.location = (L + 0.3, 3.5, 0.2)
    md = btn.modifiers.new('b', 'BEVEL'); md.width = 0.25; md.segments = 4; apply_mods(btn)
    btn.data.materials.append(M['side']); smooth(btn)
    # back cover z -4.5..-3.1 with 4 screws
    back = cross('back', a, L, -4.5, -3.1, bev=0.7)
    sp = [(0, 16.5), (16.5, 0), (0, -16.5), (-16.5, 0)]
    for (x, y) in sp:
        h = cyl('sh', 1.4, 1.2, 48); h.location = (x, y, -4.5); boolean_cut(back, h)
    back.data.materials.append(M['face']); back.data.materials.append(M['side'])
    for p in back.data.polygons: p.material_index = 0 if abs(p.normal.z) > 0.92 else 1
    smooth(back, 40)
    scr = []
    for (x, y) in sp:
        hd = cyl('head', 1.3, 0.6, 48); hd.location = (x, y, -4.2)
        md = hd.modifiers.new('b', 'BEVEL'); md.width = 0.2; md.segments = 3; apply_mods(hd)
        slot = rounded_rect_mesh('slot', 1.6, 0.35, 0.1, 1.0, seg=2); slot.location = (x, y, -4.5); boolean_cut(hd, slot)
        sh = cyl('shaft', 0.7, 3.6, 32); sh.location = (x, y, -2.2)
        for o in (hd, sh): o.data.materials.append(M['pin']); smooth(o); scr.append(o)
    part('face', [face], 40, label='Brushed steel face')
    part('glass', glass, 28, label='Protective glass')
    part('display', disp, 17.5, label='Red LED display')
    part('board', [pcb] + comps, 7, label='Logic board')
    part('battery', [bat, tab], -2.5, label='Battery')
    part('ring', [ring, lug, bar], -14, label='Steel case · bail')
    part('button', [btn], -14, dx=7, label='Side button')
    part('back', [back], -25, label='Back cover')
    part('screws', scr, -35, label='Screws')
    return sc, dict(spanA=72, spanB=118, rot0=-28, rot1=-4, tgtz=0.5, shiftA=0.0, shiftB=2.0)

# ------------------------------------------------------------------ painting
def build_painting():
    sc = tk.reset(); M = common_mats()
    W, H = 120.0, 70.0
    pm = metal('pm', os.environ.get('FIN', 'silver'), aniso=0.9, rough=0.26, axis='Y')
    # front panel z 0.8..2.0 with window
    face = rounded_rect_mesh('face', W, H, 0.8, 1.2, seg=4, bevel=0.5, bseg=4); apply_mods(face); face.location.z = 1.4
    cut = rounded_rect_mesh('cut', 41.3, 9.8, 1.8, 6); cut.location.z = 1.4; boolean_cut(face, cut)
    face.data.materials.append(pm); smooth(face, 40)
    disp, glass = display_stack(M, 41.1, 9.6, 0.8, R + 'disp_p.png', 46.0, 14.0, 12)
    # logic board under the display, battery to the right
    pcb = rounded_rect_mesh('pcb', 58.0, 26.0, 2.0, 0.8, seg=6); pcb.location = (-6, -4, -1.0)
    planar_uv(pcb, 58, 58, -6, -4); pcb.data.materials.append(M['pcb'])
    spots = [(-30, -12), (-26, 4), (-22, -14), (-18, 6), (-14, -10), (-8, 6), (0, -14), (4, 5), (10, -12), (14, 4), (18, -10), (20, 3), (-32, 2), (-10, -3), (6, -6), (16, -4)]
    comps = comps_on(-0.6, spots, [M['cer'], M['cer'], M['blk'], M['wht']], M['chip'], M['blk'], M['pin'], chip_at=(-24.0, -4.0), mcu_at=(12.0, -6.0), xt_at=(2.0, 2.0))
    usb = box('usb', 9.0, 7.5, 3.2, -1.4, x=-34.0, y=-10.0, r=1.2, mat=M['pin'])
    bat = rounded_rect_mesh('bat', 34.0, 22.0, 1.6, 2.4, seg=6, bevel=0.5, bseg=4); apply_mods(bat); bat.location = (40.0, 8.0, -0.9)
    bat.data.materials.append(M['pouch']); smooth(bat)
    # steel frame z -1.6..0.8
    frame = rounded_rect_mesh('frame', W, H, 0.8, 2.4, seg=4); frame.location.z = -0.4
    inn = rounded_rect_mesh('in', W - 3.0, H - 3.0, 0.4, 6, seg=4); inn.location.z = -0.4; boolean_cut(frame, inn)
    frame.data.materials.append(M['side']); smooth(frame, 40)
    # back plate z -2.0..-1.6 and hanger
    back = rounded_rect_mesh('back', W, H, 0.8, 0.4, seg=4); back.location.z = -1.8
    sp = [(-55, -30), (55, -30), (55, 30), (-55, 30)]
    for (x, y) in sp:
        h = cyl('sh', 1.3, 2, 32); h.location = (x, y, -1.8); boolean_cut(back, h)
    back.data.materials.append(metal('bk', os.environ.get('FIN', 'silver'), aniso=0.6, rough=0.4, axis='X')); smooth(back, 40)
    cleat = rounded_rect_mesh('cleat', 70.0, 7.0, 1.0, 2.4, seg=4, bevel=0.4, bseg=3); apply_mods(cleat); cleat.location = (0, 18.0, -3.2)
    cleat.data.materials.append(M['side']); smooth(cleat)
    scr = []
    for (x, y) in sp:
        hd = cyl('head', 1.25, 0.5, 40); hd.location = (x, y, -2.25)
        slot = rounded_rect_mesh('slot', 1.6, 0.3, 0.1, 1.0, seg=2); slot.location = (x, y, -2.5); boolean_cut(hd, slot)
        sh = cyl('shaft', 0.7, 3.0, 24); sh.location = (x, y, -0.5)
        for o in (hd, sh): o.data.materials.append(M['pin']); smooth(o); scr.append(o)
    part('face', [face], 56, label='Brushed steel panel')
    part('glass', glass, 41, label='Protective glass')
    part('display', disp, 27, label='Red LED display')
    part('board', [pcb] + comps + [usb], 13, label='Logic board')
    part('battery', [bat], 20, dx=12, label='Battery')
    part('ring', [frame], -2, label='Steel frame')
    part('back', [back, cleat], -17, label='Back plate · wall mount')
    part('screws', scr, -31, label='Screws')
    return sc, dict(spanA=200, spanB=262, rot0=-26, rot1=-8, tgtz=2.0, shiftA=0.0, shiftB=28.0)

BUILDERS = {}
def run(prod, frames, W, Hh, samples, outdir):
    sc, cfg = BUILDERS[prod]()
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); link(cam)
    cam.data.lens = 85; cam.data.sensor_fit = 'VERTICAL'; cam.data.sensor_height = 24
    el = math.radians(cfg.get('el', 33)); az = math.radians(-90)
    tgt = Vector((0, 0, cfg['tgtz']))
    dirv = Vector((math.cos(az) * math.cos(el), math.sin(az) * math.cos(el), math.sin(el)))
    sc.camera = cam; sc.render.resolution_x = W; sc.render.resolution_y = Hh
    rg0 = (-dirv).cross(Vector((0, 0, 1))).normalized()
    def place(span, sh=0.0):
        T = tgt + rg0 * sh
        cam.location = T + dirv * (span * 85 / 24.0)
        f = (T - cam.location).normalized(); upw = Vector((0, 0, 1))
        rgt = f.cross(upw).normalized(); up2 = rgt.cross(f).normalized()
        Mx = Matrix((rgt, up2, -f)).transposed().to_4x4(); Mx.translation = cam.location
        cam.matrix_world = Mx
        return rgt
    place(cfg['spanB'])
    lights(cfg['spanB'] * 85 / 24.0 * (1.0 if prod == 'pendant' else 1.0))
    nt = sc.world.node_tree; bg = nt.nodes['Background']; bg.inputs[1].default_value = 1.0
    env = [n for n in nt.nodes if n.type == 'TEX_ENVIRONMENT'][0]
    mix = nt.nodes.new('ShaderNodeMixRGB'); mix.blend_type = 'ADD'; mix.inputs[0].default_value = 1.0; mix.inputs[2].default_value = (0.32, 0.32, 0.33, 1)
    mul = nt.nodes.new('ShaderNodeMixRGB'); mul.blend_type = 'MULTIPLY'; mul.inputs[0].default_value = 1.0; mul.inputs[2].default_value = (0.85, 0.85, 0.85, 1)
    nt.links.new(env.outputs[0], mul.inputs[1]); nt.links.new(mul.outputs[0], mix.inputs[1]); nt.links.new(mix.outputs[0], bg.inputs[0])
    bpy.ops.mesh.primitive_plane_add(size=1200, location=(0, 0, -6))
    fl = bpy.context.active_object; fl.is_shadow_catcher = True
    sc.cycles.samples = samples
    root = bpy.data.objects.new('root', None); link(root)
    for k, P in PARTS.items(): P['g'].parent = root
    os.makedirs(outdir, exist_ok=True)
    start, end, NFR = int(frames[0]), int(frames[1]), int(frames[2])
    TURN = os.environ.get('TURN'); meta = []
    for i in range(start, end):
        if TURN:
            t = 1.0 if TURN == 'B' else 0.0
            rz = cfg['rot0'] + (cfg['rot1'] - cfg['rot0']) * t + 360.0 * i / NFR
        else:
            t = ease(i / (NFR - 1)); rz = cfg['rot0'] + (cfg['rot1'] - cfg['rot0']) * t
        root.rotation_euler = (0, 0, math.radians(rz))
        rgt = place(cfg['spanA'] + (cfg['spanB'] - cfg['spanA']) * t, cfg['shiftA'] + (cfg['shiftB'] - cfg['shiftA']) * t)
        for k, P in PARTS.items(): P['g'].location = (P['dx'] * t, 0, P['dz'] * t)
        bpy.context.view_layer.update()
        zmin = min((o.matrix_world @ Vector(c)).z for P in PARTS.values() for o in P['g'].children for c in o.bound_box)
        fl.location.z = zmin - 0.05
        fm = {}
        for k, P in PARTS.items():
            pts = [o.matrix_world @ Vector(c) for o in P['g'].children for c in o.bound_box]
            pv = [world_to_camera_view(sc, cam, p) for p in pts]
            cz = sum(p.z for p in pts) / len(pts)
            ctr = Vector((sum(p.x for p in pts) / len(pts), sum(p.y for p in pts) / len(pts), cz))
            vc = world_to_camera_view(sc, cam, ctr)
            x = max(v.x for v in pv)
            fm[k] = [round(min(x, 0.97), 4), round(1 - vc.y, 4)]
        meta.append(fm)
        sc.render.filepath = os.path.join(outdir, '%02d.png' % i)
        if not os.environ.get('NORENDER'):
            bpy.ops.render.render(write_still=True)
    with open(os.path.join(outdir, 'meta_%d_%d.json' % (start, end)), 'w') as fh:
        json.dump({'labels': {k: P['label'] for k, P in PARTS.items()}, 'frames': meta}, fh)

BUILDERS.update({'pendant': build_pendant, 'painting': build_painting})
if __name__ == '__main__':
    a = sys.argv[sys.argv.index('--') + 1:]
    prod, start, end, nfr, W, H, samples, outdir = a
    run(prod, (start, end, nfr), int(W), int(H), int(samples), outdir)
