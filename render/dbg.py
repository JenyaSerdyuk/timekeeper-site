import sys; sys.argv=['x']; exec(open('/tmp/claude-0/r/tk.py').read().split("if __name__")[0])
import bpy, math
for aniso,rough,name,ax in [(0.0,0.2,'a0','Z'),(1.0,0.35,'a1','Z'),(1.0,0.35,'a2','Y')]:
    sc=reset(); sc.render.resolution_x=sc.render.resolution_y=300; sc.cycles.samples=16
    bpy.ops.mesh.primitive_cylinder_add(vertices=128,radius=20,depth=4); o=bpy.context.active_object
    m=bpy.data.materials.new('m'); m.use_nodes=True; p=m.node_tree.nodes['Principled BSDF']
    p.inputs['Metallic'].default_value=1; p.inputs['Roughness'].default_value=rough; p.inputs['Anisotropic'].default_value=aniso
    p.inputs['Base Color'].default_value=(.9,.9,.9,1)
    tg=m.node_tree.nodes.new('ShaderNodeTangent'); tg.direction_type='RADIAL'; tg.axis=ax
    m.node_tree.links.new(tg.outputs[0],p.inputs['Tangent']); o.data.materials.append(m)
    for pp in o.data.polygons: pp.use_smooth=True
    o.rotation_euler=(math.radians(-25),math.radians(-20),0)
    camera(62*85/36,(0,0,0),85,6); studio(62*85/36,(0,0,0))
    sc.render.filepath='/tmp/claude-0/r/dbg_'+name+'.png'; bpy.ops.render.render(write_still=True)
