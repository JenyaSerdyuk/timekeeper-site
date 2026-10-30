import bpy, bmesh, math, sys, os
from mathutils import Vector, Matrix

R = '/tmp/claude-0/r/'
WROT = 30
WSTR = 0.9

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.use_denoising = True
    try: sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    except Exception: pass
    sc.cycles.samples = 64
    sc.cycles.max_bounces = 8
    sc.cycles.glossy_bounces = 6
    sc.cycles.transparent_max_bounces = 8
    sc.render.film_transparent = True
    sc.view_settings.view_transform = 'AgX'
    try: sc.view_settings.look = 'AgX - Punchy'
    except Exception: pass
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    w = bpy.data.worlds.new('W'); sc.world = w
    w.use_nodes = True
    nt = w.node_tree; bg = nt.nodes.get('Background') or nt.nodes.new('ShaderNodeBackground')
    env = nt.nodes.new('ShaderNodeTexEnvironment')
    env.image = bpy.data.images.load('/usr/local/lib/python3.13/dist-packages/bpy/5.1/datafiles/studiolights/world/studio.exr')
    mp = nt.nodes.new('ShaderNodeMapping'); tc = nt.nodes.new('ShaderNodeTexCoord')
    mp.inputs['Rotation'].default_value = (math.radians(90), 0, math.radians(WROT))
    nt.links.new(tc.outputs['Generated'], mp.inputs[0]); nt.links.new(mp.outputs[0], env.inputs[0])
    nt.links.new(env.outputs[0], bg.inputs[0]); bg.inputs[1].default_value = WSTR
    out = [n for n in nt.nodes if n.type == 'OUTPUT_WORLD']
    out = out[0] if out else nt.nodes.new('ShaderNodeOutputWorld')
    nt.links.new(bg.outputs[0], out.inputs[0])
    return sc

# ---------------- materials ----------------
FIN = {'silver': ((0.86, 0.86, 0.87), 0.17), 'black': ((0.055, 0.055, 0.06), 0.30), 'gold': ((0.95, 0.72, 0.40), 0.16)}

def metal(name, fin='silver', radial=False, aniso=0.75, rough=None, axis='Z'):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; L = nt.links
    p = N['Principled BSDF']
    col, r = FIN[fin]
    p.inputs['Base Color'].default_value = (*col, 1)
    p.inputs['Metallic'].default_value = 1.0
    p.inputs['Roughness'].default_value = rough if rough is not None else r
    p.inputs['Anisotropic'].default_value = aniso
    tg = N.new('ShaderNodeTangent')
    tg.direction_type = 'RADIAL'; tg.axis = axis
    L.new(tg.outputs[0], p.inputs['Tangent'])
    # fine brushing bump
    tc = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping')
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 1.2; nz.inputs['Detail'].default_value = 12
    if radial:
        # polar: stretch noise along circles via gradient spherical trick -> use radius only
        sep = N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Object'], sep.inputs[0])
        vl = N.new('ShaderNodeVectorMath'); vl.operation = 'LENGTH'
        cmb = N.new('ShaderNodeCombineXYZ'); L.new(sep.outputs[0], cmb.inputs[0]); L.new(sep.outputs[1], cmb.inputs[1])
        L.new(cmb.outputs[0], vl.inputs[0])
        cm2 = N.new('ShaderNodeCombineXYZ'); L.new(vl.outputs['Value'], cm2.inputs[0])
        mt = N.new('ShaderNodeMath'); mt.operation = 'MULTIPLY'; mt.inputs[1].default_value = 40
        L.new(vl.outputs['Value'], mt.inputs[0])
        cm2.inputs[1].default_value = 0.3
        L.new(cm2.outputs[0], mp.inputs[0])
        mp.inputs['Scale'].default_value = (900, 1, 1)
    else:
        L.new(tc.outputs['Object'], mp.inputs[0])
        mp.inputs['Scale'].default_value = (220, 0.5, 220) if axis == 'X' else ((0.5, 220, 220) if axis == 'Y' else (0.4, 300, 0.4))
        nz.inputs['Scale'].default_value = 1.0
    L.new(mp.outputs[0], nz.inputs['Vector'])
    bmp = N.new('ShaderNodeBump'); bmp.inputs['Strength'].default_value = 0.012 if radial else 0.05; bmp.inputs['Distance'].default_value = 0.005 if radial else 0.01
    L.new(nz.outputs['Fac'], bmp.inputs['Height']); L.new(bmp.outputs[0], p.inputs['Normal'])
    # roughness variation
    ramp = N.new('ShaderNodeMapRange'); ramp.inputs['To Min'].default_value = (rough if rough is not None else r) * 0.75
    ramp.inputs['To Max'].default_value = (rough if rough is not None else r) * 1.3
    L.new(nz.outputs['Fac'], ramp.inputs['Value']); L.new(ramp.outputs['Result'], p.inputs['Roughness'])
    return m

def mat_emit_img(name, path, strength=6):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; L = nt.links
    p = N['Principled BSDF']
    img = N.new('ShaderNodeTexImage'); img.image = bpy.data.images.load(path)
    p.inputs['Base Color'].default_value = (0.01, 0.01, 0.01, 1)
    p.inputs['Roughness'].default_value = 0.05
    p.inputs['Coat Weight'].default_value = 1.0
    p.inputs['Coat Roughness'].default_value = 0.02
    L.new(img.outputs['Color'], p.inputs['Emission Color'])
    p.inputs['Emission Strength'].default_value = strength
    return m

def mat_simple(name, col, rough=0.5, metal_=0.0, coat=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*col, 1); p.inputs['Roughness'].default_value = rough
    p.inputs['Metallic'].default_value = metal_; p.inputs['Coat Weight'].default_value = coat
    return m

def mat_glass():
    m = bpy.data.materials.new('glass'); m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (1, 1, 1, 1); p.inputs['Roughness'].default_value = 0.0
    p.inputs['Transmission Weight'].default_value = 1.0; p.inputs['IOR'].default_value = 1.5
    return m

# ---------------- geometry helpers ----------------
def link(obj):
    bpy.context.collection.objects.link(obj); return obj

def apply_mods(o):
    bpy.context.view_layer.objects.active = o
    for md in list(o.modifiers):
        bpy.ops.object.modifier_apply(modifier=md.name)

def rounded_rect_mesh(name, w, h, r, depth, seg=10, bevel=0.0, bseg=4):
    bm = bmesh.new()
    pts = []
    for cx, cy, a0 in [(w/2-r, h/2-r, 0), (-w/2+r, h/2-r, 90), (-w/2+r, -h/2+r, 180), (w/2-r, -h/2+r, 270)]:
        for i in range(seg+1):
            a = math.radians(a0 + 90*i/seg)
            pts.append((cx + r*math.cos(a), cy + r*math.sin(a)))
    vs = [bm.verts.new((x, y, -depth/2)) for x, y in pts]
    f = bm.faces.new(vs)
    ext = bmesh.ops.extrude_face_region(bm, geom=[f])
    for v in ext['geom']:
        if isinstance(v, bmesh.types.BMVert): v.co.z += depth
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = link(bpy.data.objects.new(name, me))
    if bevel > 0:
        md = o.modifiers.new('b', 'BEVEL'); md.width = bevel; md.segments = bseg; md.limit_method = 'ANGLE'; md.angle_limit = math.radians(40)
        md.harden_normals = False
    return o

def poly_prism(name, pts, depth, bevel=0.0, bseg=5):
    bm = bmesh.new()
    vs = [bm.verts.new((x, y, -depth/2)) for x, y in pts]
    f = bm.faces.new(vs)
    ext = bmesh.ops.extrude_face_region(bm, geom=[f])
    for v in ext['geom']:
        if isinstance(v, bmesh.types.BMVert): v.co.z += depth
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = link(bpy.data.objects.new(name, me))
    if bevel > 0:
        md = o.modifiers.new('b', 'BEVEL'); md.width = bevel; md.segments = bseg; md.limit_method = 'ANGLE'; md.angle_limit = math.radians(40)
    return o

def boolean_cut(target, cutter):
    md = target.modifiers.new('cut', 'BOOLEAN'); md.operation = 'DIFFERENCE'; md.object = cutter
    try: md.solver = 'EXACT'
    except Exception: pass
    bpy.context.view_layer.objects.active = target
    bpy.ops.object.modifier_apply(modifier=md.name)
    bpy.data.objects.remove(cutter)
    target.data.materials.clear()
    for p in target.data.polygons: p.material_index = 0

def smooth(o, ang=35):
    for p in o.data.polygons: p.use_smooth = True
    wn = o.modifiers.new('wn', 'WEIGHTED_NORMAL'); wn.mode = 'FACE_AREA'; wn.weight = 100; wn.keep_sharp = True
    return
    try:
        o.data.set_sharp_from_angle(angle=math.radians(ang))
    except Exception:
        md = o.modifiers.new('ws', 'WEIGHTED_NORMAL')

def cyl(name, r, d, verts=128):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=d)
    o = bpy.context.active_object; o.name = name; return o

def plane_uv(name, w, h, z):
    bpy.ops.mesh.primitive_plane_add(size=1)
    o = bpy.context.active_object; o.name = name; o.scale = (w, h, 1); o.location.z = z
    bpy.ops.object.transform_apply(scale=True)
    return o

def display_window(parent, w, h, r, z_face, disp_img, recess=0.9, bez=0.8, y=0.0):
    """cuts a recess into parent at front face z_face and inserts display + glass"""
    cutter = rounded_rect_mesh('cut', w+bez*2, h+bez*2, r+bez, recess*2)
    cutter.location.z = z_face; cutter.location.y = y
    boolean_cut(parent, cutter)
    # display panel (rounded) inside recess
    pan = rounded_rect_mesh('disp', w+bez*2-0.05, h+bez*2-0.05, r+bez, 0.2)
    pan.location.z = z_face - recess + 0.1; pan.location.y = y
    # emissive face with uv
    me = pan.data
    uvl = me.uv_layers.new()
    for poly in me.polygons:
        for li in poly.loop_indices:
            v = me.vertices[me.loops[li].vertex_index].co
            uvl.data[li].uv = ((v.x)/(w+bez*2)+0.5, (v.y)/(h+bez*2)+0.5)
    pan.data.materials.append(mat_emit_img('dispmat', disp_img, 1.5))
    pan.parent = parent
    return pan

# ---------------- products ----------------
def keychain(fin='silver'):
    root = bpy.data.objects.new('root', None); link(root)
    Rr, H = 20.0, 11.0
    body = cyl('body', Rr, H, 192)
    md = body.modifiers.new('b', 'BEVEL'); md.width = 1.3; md.segments = 8; md.limit_method = 'ANGLE'; md.angle_limit = math.radians(40)
    apply_mods(body)
    display_window(body, 24.0, 5.6, 1.0, H/2, R+'disp.png')
    smooth(body)
    # face (radial) vs side material split by normal: assign side material to faces with |nz|<0.9
    mf = metal('face', fin, radial=True, aniso=0.95, rough=0.3); ms = metal('side', fin, radial=False, aniso=0.6)
    body.data.materials.append(mf); body.data.materials.append(ms)
    for p in body.data.polygons:
        p.material_index = 0 if abs(p.normal.z) > 0.92 else 1
    body.parent = root
    # side button
    b = cyl('btn', 1.0, 2.4, 48); b.rotation_euler = (0, math.radians(90), 0); b.location = (Rr+0.3, -5.5, 0)
    b.data.materials.append(ms); smooth(b); b.parent = root
    return root, (0, 0, 0), 62

def pendant(fin='silver'):
    root = bpy.data.objects.new('root', None); link(root)
    a, Lr = 7.2, 20.0
    pts = [(-a, Lr), (a, Lr), (a, a), (Lr, a), (Lr, -a), (a, -a), (a, -Lr), (-a, -Lr), (-a, -a), (-Lr, -a), (-Lr, a), (-a, a)]
    # round convex corners via bevel on vertical edges: build prism then bevel modifier handles all
    body = poly_prism('cross', pts, 9.0)
    md = body.modifiers.new('bv', 'BEVEL'); md.affect = 'EDGES'; md.width = 2.6; md.segments = 10; md.limit_method = 'ANGLE'; md.angle_limit = math.radians(60)
    apply_mods(body)
    md = body.modifiers.new('b2', 'BEVEL'); md.width = 0.8; md.segments = 5; md.limit_method = 'ANGLE'; md.angle_limit = math.radians(30)
    apply_mods(body)
    body.name = 'pendant'
    display_window(body, 29.0, 7.0, 1.0, 4.5+0.8, R+'disp.png', recess=1.0, bez=1.0)
    smooth(body, 40)
    m = metal('pm', fin, aniso=0.85, rough=0.3, axis='X'); body.data.materials.append(m); body.parent = root
    # side button
    b = cyl('btn', 0.9, 2.2, 32); b.rotation_euler = (0, math.radians(90), 0); b.location = (-Lr-0.4, 3.5, 0)
    b.data.materials.append(m); smooth(b); b.parent = root
    # bail
    bm_ = metal('bail', fin, aniso=0.4, rough=0.12)
    lug = rounded_rect_mesh('lug', 4.2, 4.0, 1.0, 3.6, bevel=0.5); apply_mods(lug)
    lug.location = (0, Lr+1.2, 0); lug.data.materials.append(bm_); smooth(lug); lug.parent = root
    bar = cyl('bail', 2.7, 6.6, 64); bar.rotation_euler = (0, math.radians(90), 0); bar.location = (0, Lr+4.4, 0)
    md = bar.modifiers.new('b', 'BEVEL'); md.width = 0.5; md.segments = 4; apply_mods(bar)
    bar.data.materials.append(bm_); smooth(bar); bar.parent = root
    # chain: two strands going up in a V, cable links
    for side in (-1, 1):
        base = Vector((0, Lr+4.4, 0)); dirv = Vector((side*math.sin(math.radians(13)), math.cos(math.radians(13)), 0))
        for k in range(16):
            bpy.ops.mesh.primitive_torus_add(major_radius=1.25, minor_radius=0.36, major_segments=32, minor_segments=12)
            t = bpy.context.active_object
            t.scale = (1, 1.55, 1)
            c = base + dirv*(1.6 + k*2.9)
            t.location = c
            t.rotation_euler = (0, math.radians(90) if k % 2 else 0, -side*math.radians(13))
            t.data.materials.append(bm_); smooth(t, 80); t.parent = root
    return root, (0, 6, 0), 70

def oct_pts(w, h, c):
    return [(-w/2+c, h/2), (w/2-c, h/2), (w/2, h/2-c), (w/2, -h/2+c), (w/2-c, -h/2), (-w/2+c, -h/2), (-w/2, -h/2+c), (-w/2, h/2-c)]

def mat_keys():
    m = bpy.data.materials.new('keytop'); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; L = nt.links
    p = N['Principled BSDF']; p.inputs['Base Color'].default_value = (0.012, 0.012, 0.013, 1); p.inputs['Roughness'].default_value = 0.45
    p.inputs['Coat Weight'].default_value = 0.3; p.inputs['Coat Roughness'].default_value = 0.3
    img = N.new('ShaderNodeTexImage'); img.image = bpy.data.images.load(R + 'keys.png')
    mix = N.new('ShaderNodeMix'); mix.data_type = 'RGBA'
    mix.inputs['A'].default_value = (0.012, 0.012, 0.013, 1); mix.inputs['B'].default_value = (0.8, 0.8, 0.8, 1)
    L.new(img.outputs['Alpha'], mix.inputs['Factor']); L.new(mix.outputs['Result'], p.inputs['Base Color'])
    return m

def tex_mat(name, path, rough=0.35, coat=1.0, emit=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; L = nt.links; p = N['Principled BSDF']
    img = N.new('ShaderNodeTexImage'); img.image = bpy.data.images.load(path)
    L.new(img.outputs['Color'], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = rough; p.inputs['Coat Weight'].default_value = coat; p.inputs['Coat Roughness'].default_value = 0.03
    if emit: L.new(img.outputs['Color'], p.inputs['Emission Color']); p.inputs['Emission Strength'].default_value = emit
    return m

def uv_plane(o, w, h, cx=0, cy=0):
    me = o.data; uvl = me.uv_layers.new() if not me.uv_layers else me.uv_layers[0]
    for poly in me.polygons:
        for li in poly.loop_indices:
            v = me.vertices[me.loops[li].vertex_index].co
            uvl.data[li].uv = ((v.x-cx)/w+0.5, (v.y-cy)/h+0.5)

def bracelet(root, fin, H_, wbase, z0=0.0):
    bm_ = metal('br', fin, aniso=0.85, rough=0.26, axis='Y')
    for sgn in (1, -1):
        y = sgn*(H_/2 - 0.8); z = z0; ang = math.radians(2)
        for r in range(10):
            ln = 5.0
            row = bpy.data.objects.new('row', None); link(row); row.parent = root
            cy_ = y + sgn*ln/2*math.cos(ang); cz = z - ln/2*math.sin(ang)
            row.location = (0, cy_, cz); row.rotation_euler = (sgn*ang, 0, 0)
            w = wbase - min(r, 3)*0.7
            parts = [(-w*0.355, w*0.29, 0.25), (0, w*0.40, 0.0), (w*0.355, w*0.29, 0.25)]
            for px, pw, dz in parts:
                lk = rounded_rect_mesh('link', pw - 0.22, ln - 0.28, 0.4, 2.6, seg=3, bevel=0.32, bseg=3); apply_mods(lk)
                lk.location = (px, 0, dz); lk.data.materials.append(bm_); smooth(lk, 40); lk.parent = row
            y += sgn*ln*math.cos(ang); z -= ln*math.sin(ang)
            ang += math.radians(10)

def keypad(root, kw, kh, ky, ztop):
    kb = rounded_rect_mesh('kbase', kw-0.2, kh-0.2, 1.3, 1.0); kb.location = (0, ky, ztop-1.9)
    kb.data.materials.append(mat_simple('kb', (0.008, 0.008, 0.009), 0.6)); kb.parent = root
    km = mat_keys(); cols, rows = 5, 4; gx, gy = 0.75, 0.75
    kwid = (kw - 1.4 - gx*(cols-1)) / cols; khei = (kh - 1.4 - gy*(rows-1)) / rows
    for i in range(20):
        c, r = i % cols, i // cols
        x = -kw/2 + 0.7 + kwid/2 + c*(kwid+gx); y = ky + kh/2 - 0.7 - khei/2 - r*(khei+gy)
        k = rounded_rect_mesh('key', kwid, khei, 0.8, 1.6, seg=4, bevel=0.4, bseg=3); apply_mods(k)
        k.location = (x, y, ztop - 1.4 + 0.85)
        me = k.data; uvl = me.uv_layers.new()
        for poly in me.polygons:
            for li in poly.loop_indices:
                v = me.vertices[me.loops[li].vertex_index].co
                u = v.x / kwid; vv = v.y / khei
                uvl.data[li].uv = ((c + 0.5 + u*0.95) / cols, 1 - (r + 0.5 - vv*0.95*khei/kwid) / rows)
        k.data.materials.append(km); smooth(k, 40); k.parent = root

def screws(root, fin, pts, z):
    scm = metal('scr', fin, aniso=0.2, rough=0.2)
    for sx, sy in pts:
        s_ = cyl('screw', 1.15, 0.8, 32); s_.location = (sx, sy, z+0.15)
        md = s_.modifiers.new('b', 'BEVEL'); md.width = 0.25; md.segments = 3; apply_mods(s_)
        sl = rounded_rect_mesh('slot', 1.9, 0.32, 0.1, 0.6); sl.location = (sx, sy, z+0.55); sl.rotation_euler = (0, 0, math.radians(35))
        boolean_cut(s_, sl)
        s_.data.materials.append(scm); smooth(s_); s_.parent = root

def watch(fin='silver', clear=False):
    """calculator watch: keypad on top, grey LCD, red display at the bottom"""
    root = bpy.data.objects.new('root', None); link(root)
    W_, H_, D = 40.0, 52.0, 10.0
    case = poly_prism('case', oct_pts(W_, H_, 4.4), D)
    md = case.modifiers.new('b', 'BEVEL'); md.width = 0.9; md.segments = 5; md.limit_method = 'ANGLE'; md.angle_limit = math.radians(30)
    apply_mods(case)
    kw, kh, ky = 32.4, 21.5, 9.6
    cut = rounded_rect_mesh('cut', kw, kh, 1.4, 2.4); cut.location = (0, ky, D/2); boolean_cut(case, cut)
    display_window(case, 29.6, 6.2, 0.8, D/2, R+'lcd.png', recess=0.9, bez=1.2, y=-6.0)
    display_window(case, 29.6, 5.6, 0.8, D/2, R+'disp_c.png', recess=0.9, bez=1.2, y=-15.8)
    # LCD should glow less
    for o in case.children:
        if o.data.materials and 'lcd' in o.data.materials[0].node_tree.nodes['Image Texture'].image.name:
            o.data.materials[0].node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 0.55
    smooth(case, 40)
    m = metal('wm', fin, aniso=0.85, rough=0.3, axis='Y')
    if clear:
        cm = bpy.data.materials.new('clear'); cm.use_nodes = True; cp = cm.node_tree.nodes['Principled BSDF']
        cp.inputs['Base Color'].default_value = (1, 1, 1, 1); cp.inputs['Roughness'].default_value = 0.03
        cp.inputs['Transmission Weight'].default_value = 1.0; cp.inputs['Coat Weight'].default_value = 1.0; cp.inputs['IOR'].default_value = 1.2
        case.data.materials.append(cm)
        # electronics inside
        pcb = rounded_rect_mesh('pcb', W_-6, H_-6, 2.0, 1.0); pcb.location.z = -1.5
        pcb.data.materials.append(mat_simple('pcb', (0.16, 0.18, 0.16), 0.35, 0, 0.6)); pcb.parent = root
        gold = mat_simple('gold', (1.0, 0.75, 0.38), 0.2, 1)
        chip = mat_simple('chip', (0.02, 0.02, 0.022), 0.35)
        import random; rnd = random.Random(7)
        for k in range(46):
            w = rnd.uniform(0.6, 2.6); h = rnd.uniform(0.5, 1.8)
            x = rnd.uniform(-(W_-9)/2, (W_-9)/2); y = rnd.uniform(-(H_-9)/2, (H_-9)/2)
            for zz in (-0.8, -2.25):
                cpt = rounded_rect_mesh('cmp', w, h, 0.1, 0.5); cpt.location = (x if zz > -1 else -x*0.9, y if zz > -1 else y*0.95, zz)
                cpt.data.materials.append(gold if k % 3 == 0 else chip); cpt.parent = root
        for (x, y, w, h) in [(-7, -2, 6, 6), (6, 14, 7, 5)]:
            ic = rounded_rect_mesh('ic', w, h, 0.4, 0.9); ic.location = (x, y, -2.45); ic.data.materials.append(metal('shield', 'silver', aniso=0.3, rough=0.25) if w > 6.5 else chip); ic.parent = root
        bat = cyl('battery', 8.0, 2.4, 64); bat.location = (5, -6, -3.2)
        bat.data.materials.append(metal('bat', 'silver', aniso=0.6, rough=0.2, radial=True)); bat.parent = root
        # metal side buttons & bracelet stay steel
    else:
        case.data.materials.append(m)
    case.parent = root
    keypad(root, kw, kh, ky, D/2)
    screws(root, fin, [(-16.6, 22.9), (16.6, 22.9), (-16.6, -22.9), (16.6, -22.9)], D/2)
    for sx, sy in [(1, 12), (1, -6), (-1, 12), (-1, -6)]:
        b = cyl('push', 1.1, 2.4, 32); b.rotation_euler = (0, math.radians(90), 0); b.location = (sx*(W_/2+0.9), sy, 0)
        b.data.materials.append(m); b.parent = root
    bracelet(root, fin, H_, 30.0)
    return root, (0, 0, 0), 92

def watch2(fin='silver'):
    """analog watch: cushion case, red dial, hands, red display on the dial"""
    root = bpy.data.objects.new('root', None); link(root)
    W_, H_, D = 42.0, 44.0, 11.0
    case = rounded_rect_mesh('case', W_, H_, 10.0, D, seg=16)
    md = case.modifiers.new('b', 'BEVEL'); md.width = 2.4; md.segments = 10; md.limit_method = 'ANGLE'; md.angle_limit = math.radians(30)
    apply_mods(case)
    cut = rounded_rect_mesh('cut', 36.0, 37.6, 7.5, 3.0); cut.location = (0, 0, D/2); boolean_cut(case, cut)
    smooth(case, 40)
    m = metal('wm', fin, aniso=0.8, rough=0.24, axis='Y'); case.data.materials.append(m); case.parent = root
    # dial
    dz = D/2 - 1.45
    dial = rounded_rect_mesh('dial', 35.8, 37.4, 7.4, 0.2, seg=16); dial.location.z = dz
    uv_plane(dial, 35.8, 37.4); dial.data.materials.append(tex_mat('dialm', R+'dial.png', rough=0.45, coat=0.6)); dial.parent = root
    # red display on dial
    fr = rounded_rect_mesh('dfr', 27.6, 5.8, 1.0, 0.5); fr.location = (0, -10.6, dz+0.25)
    fr.data.materials.append(mat_simple('dfr', (0.01, 0.01, 0.01), 0.2, 0, 1)); fr.parent = root
    dp = rounded_rect_mesh('dp', 26.6, 4.8, 0.8, 0.1); dp.location = (0, -10.6, dz+0.52)
    uv_plane(dp, 26.6, 4.8, 0, 0); dp.data.materials.append(mat_emit_img('dpm', R+'disp_w.png', 1.5)); dp.parent = root
    # indices
    im_ = metal('idx', fin, aniso=0.3, rough=0.15)
    for k in range(12):
        a = math.radians(90 - k*30)
        if k in (3, 5, 6, 7): continue
        rx, ry = 15.0, 15.8
        x, y = math.cos(a)*rx, math.sin(a)*ry
        L_ = 3.2 if k % 3 == 0 else 2.4
        for off in ((-0.55, 0.55) if k == 0 else (0,)):
            ix = rounded_rect_mesh('i', 0.55, L_, 0.2, 0.5); ix.location = (x+off, y, dz+0.35); ix.rotation_euler = (0, 0, a - math.pi/2)
            ix.data.materials.append(im_); ix.parent = root
    # date window at 3
    dw = rounded_rect_mesh('dw', 3.0, 2.4, 0.2, 0.3); dw.location = (12.2, 0, dz+0.2)
    uv_plane(dw, 3.0, 2.4); dw.data.materials.append(tex_mat('date', R+'date.png', rough=0.5, coat=0)); dw.parent = root
    # hands (10:10)
    hm = metal('hand', fin, aniso=0.3, rough=0.12)
    for ang, ln, wd in ((math.radians(90 - 305), 9.0, 0.9), (math.radians(90 - 60), 13.0, 0.7)):
        h = rounded_rect_mesh('hand', wd, ln, wd*0.45, 0.35); h.location = (math.cos(ang)*ln/2, math.sin(ang)*ln/2, dz+0.9); h.rotation_euler = (0, 0, ang - math.pi/2)
        h.data.materials.append(hm); h.parent = root
    cap = cyl('cap', 1.0, 0.8, 32); cap.location = (0, 0, dz+1.1); cap.data.materials.append(hm); cap.parent = root
    # crown
    cw = cyl('crown', 2.3, 3.0, 24); cw.rotation_euler = (0, math.radians(90), 0); cw.location = (W_/2 + 1.0, 0, 0)
    cw.data.materials.append(m); cw.parent = root
    bracelet(root, fin, H_, 30.0)
    return root, (0, 0, 0), 92

def painting(fin='silver'):
    root = bpy.data.objects.new('root', None); link(root)
    W, H, D = 120, 70, 4.0
    p = rounded_rect_mesh('panel', W, H, 0.8, D, seg=4, bevel=0.6, bseg=4); apply_mods(p)
    display_window(p, 39.1, 7.6, 1.0, D/2, R+'disp_p.png', recess=0.8, bez=1.1)
    smooth(p, 40)
    m = metal('pm', fin, aniso=0.9, rough=0.32, axis='Y')
    p.data.materials.append(m); p.parent = root
    return root, (0, 0, 0), 150

# ---------------- studio ----------------
def softbox(name, size, loc, look_at, strength):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc)
    o = bpy.context.active_object; o.name = name; o.scale = (size[0], size[1], 1)
    d = Vector(look_at) - Vector(loc); o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    e = nt.nodes.new('ShaderNodeEmission'); e.inputs['Strength'].default_value = strength
    out = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], out.inputs[0])
    o.data.materials.append(m)
    o.visible_camera = False
    return o

def studio(dist, center=(0, 0, 0), wall=False):
    c = Vector(center)
    s = dist / 100.0
    softbox('key', (40*s, 160*s), (c.x-120*s, c.y+60*s, 110*s), c, 3.2)
    softbox('fill', (120*s, 50*s), (c.x+140*s, c.y-30*s, 70*s), c, 0.6)
    softbox('top', (200*s, 30*s), (c.x, c.y+160*s, 50*s), c, 1.6)
    softbox('rimL', (14*s, 220*s), (c.x-160*s, c.y, -40*s), c, 4)
    softbox('rimR', (14*s, 220*s), (c.x+160*s, c.y+20*s, -30*s), c, 3)
    softbox('strip', (16*s, 260*s), (c.x+40*s, c.y+40*s, 170*s), c, 1.4)
    softbox('front', (70*s, 70*s), (c.x-45*s, c.y+55*s, 185*s), c, 2.4)
    softbox('front2', (30*s, 90*s), (c.x+60*s, c.y-40*s, 170*s), c, 0.9)
    if wall:
        bpy.ops.mesh.primitive_plane_add(size=1000, location=(0, 0, -11))
        w = bpy.context.active_object; w.data.materials.append(mat_simple('wall', (0.035, 0.035, 0.037), 0.85))

def camera(dist, center, lens=85, elev=8):
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); link(cam)
    cam.data.lens = lens; cam.data.sensor_width = 36
    e = math.radians(elev)
    cam.location = (center[0], center[1] - 0 + math.sin(e)*dist*0, center[2] + dist)
    cam.location = Vector(center) + Vector((0, math.sin(e)*dist, math.cos(e)*dist))
    f = (Vector(center) - cam.location).normalized()
    upw = Vector((0, 1, 0))
    rgt = f.cross(upw).normalized(); up2 = rgt.cross(f).normalized()
    M = Matrix((rgt, up2, -f)).transposed().to_4x4(); M.translation = cam.location
    cam.matrix_world = M
    bpy.context.scene.camera = cam
    cam.data.dof.use_dof = True; cam.data.dof.focus_distance = dist; cam.data.dof.aperture_fstop = 11
    return cam

def build(prod, fin):
    sc = reset()
    fn = {'keychain': keychain, 'pendant': pendant, 'watch': watch, 'watch2': watch2, 'watch3': (lambda f: watch(f, clear=True)), 'painting': painting}[prod]
    root, center, frame_w = fn(fin)
    bpy.context.view_layer.update()
    pts = []
    for o in root.children_recursive:
        if o.type == 'MESH':
            mw = o.matrix_world
            pts += [mw @ Vector(c) for c in o.bound_box]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    ctr = (mn + mx) / 2
    if prod == 'painting': ctr = Vector((0, 0, 0))
    for o in root.children:
        o.location -= ctr
    rxz = max(math.hypot(p.x-ctr.x, p.z-ctr.z) for p in pts)
    hh = (mx.y - mn.y)
    frame_w = max(2*rxz, hh) * FITPAD.get(prod, 1.12)
    center = (0, 0, 0)
    # frame_w: scene width to fit; distance from lens
    lens = 85
    dist = frame_w * lens / 36.0
    camera(dist, center, lens, elev=6 if prod != 'painting' else 0)
    studio(dist, center, wall=False)
    return sc, root

def render(prod, fin, frames, size, samples, outdir, swing=None, tilt=18):
    sc, root = build(prod, fin)
    if prod == 'painting':
        sc.world.node_tree.nodes['Background'].inputs[1].default_value = 0.42
    sc.render.resolution_x = size; sc.render.resolution_y = size
    sc.cycles.samples = samples
    os.makedirs(outdir, exist_ok=True)
    for i in frames:
        if swing:
            a = math.radians(swing * math.sin(2*math.pi*i/NFP))
        else:
            a = 2*math.pi*i/NF - math.radians(25)
        # turntable around vertical (Y) axis of view; products face +Z camera
        root.rotation_euler = (math.radians(-tilt) if not swing else 0, a, 0)
        sc.render.filepath = os.path.join(outdir, '%02d.png' % i)
        bpy.ops.render.render(write_still=True)

NF = 36
NFP = 24
FITPAD = {'keychain': 1.7, 'pendant': 1.12, 'watch': 1.12, 'watch2': 1.12, 'watch3': 1.12, 'painting': 1.15}
def len_frames(p): return NF

if __name__ == '__main__':
    prod, fin, start, end, size, samples, outdir = sys.argv[-7:]
    frames = range(int(start), int(end))
    render(prod, fin, frames, int(size), int(samples), outdir, swing=None, tilt=(4 if prod == 'painting' else 14))
