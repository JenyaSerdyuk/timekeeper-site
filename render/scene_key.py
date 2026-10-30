import sys
exec(open('/tmp/claude-0/r/tk.py').read().split("if __name__")[0])
mode=sys.argv[-1]
src=open('/tmp/claude-0/r/tk.py').read()
import bpy, math
R2='/tmp/claude-0/r/'
# use blank or mask display
def run(disp,out,samples,size):
    global R
    import builtins
    sc=reset()
    # temporarily swap display image name
    orig=R+'disp.png'
    root,center,fw=keychain('silver')
    for m in bpy.data.materials:
        if m.name.startswith('dispmat'):
            for n in m.node_tree.nodes:
                if n.type=='TEX_IMAGE': n.image=bpy.data.images.load(R2+disp)
            if disp=='disp_mask.png':
                p=m.node_tree.nodes['Principled BSDF']; p.inputs['Emission Strength'].default_value=20; p.inputs['Coat Weight'].default_value=0
    sc.render.film_transparent=False
    sc.render.image_settings.file_format='JPEG'; sc.render.image_settings.quality=92
    sc.view_settings.view_transform='AgX'
    # concrete backdrop
    bpy.ops.mesh.primitive_plane_add(size=600,location=(0,0,-6.2))
    bd=bpy.context.active_object
    m=bpy.data.materials.new('concrete'); m.use_nodes=True; nt=m.node_tree; N=nt.nodes; L=nt.links; p=N['Principled BSDF']
    nz=N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value=4.0; nz.inputs['Detail'].default_value=14; nz.inputs['Roughness'].default_value=0.62
    vo=N.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value=60
    ramp=N.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].color=(0.035,0.034,0.032,1); ramp.color_ramp.elements[1].color=(0.11,0.105,0.1,1)
    L.new(nz.outputs['Fac'],ramp.inputs['Fac']); L.new(ramp.outputs['Color'],p.inputs['Base Color'])
    p.inputs['Roughness'].default_value=0.85
    bmp=N.new('ShaderNodeBump'); bmp.inputs['Strength'].default_value=0.25; L.new(vo.outputs['Distance'],bmp.inputs['Height']); L.new(bmp.outputs[0],p.inputs['Normal'])
    bd.data.materials.append(m)
    # camera straight on, keychain flat facing camera
    root.rotation_euler=(0,0,0)
    lens=85; fw=118; dist=fw*lens/36
    cam=bpy.data.objects.new('cam',bpy.data.cameras.new('cam')); bpy.context.collection.objects.link(cam)
    cam.data.lens=lens; cam.location=(0,0,dist); cam.rotation_euler=(0,0,0); sc.camera=cam
    cam.data.dof.use_dof=True; cam.data.dof.focus_distance=dist-5.5; cam.data.dof.aperture_fstop=5.6
    studio(dist,(0,0,0),wall=False)
    # warm low sun for long shadow like product photo
    sun=bpy.data.lights.new('sun','SUN'); sun.energy=3.2; sun.angle=math.radians(3); sun.color=(1,0.93,0.84)
    so=bpy.data.objects.new('sun',sun); bpy.context.collection.objects.link(so); so.rotation_euler=(math.radians(-48),math.radians(38),0)
    sc.world.node_tree.nodes['Background'].inputs[1].default_value=0.55
    sc.render.resolution_x=size[0]; sc.render.resolution_y=size[1]; sc.cycles.samples=samples
    sc.render.filepath=out; bpy.ops.render.render(write_still=True)
if mode=='mask': run('disp_mask.png',R2+'key_mask.jpg',4,(1800,1200))
else: run('disp_blank.png',R2+'key_scene.jpg',int(sys.argv[-2]),(1800,1200))
