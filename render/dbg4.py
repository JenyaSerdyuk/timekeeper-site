exec(open('/tmp/claude-0/r/tk.py').read().split("if __name__")[0])
for name,mk in [('m1',lambda: metal('f','silver',radial=True,aniso=0.95,rough=0.3)),('m2','nobump'),('m3','noramp')]:
    sc=reset(); sc.render.resolution_x=sc.render.resolution_y=300; sc.cycles.samples=12
    bpy.ops.mesh.primitive_cylinder_add(vertices=128,radius=20,depth=4); o=bpy.context.active_object
    m=metal('f','silver',radial=True,aniso=0.95,rough=0.3)
    nt=m.node_tree; p=nt.nodes['Principled BSDF']
    if name in('m2',):
        for l in list(nt.links):
            if l.to_socket==p.inputs['Normal']: nt.links.remove(l)
    if name=='m3':
        for l in list(nt.links):
            if l.to_socket==p.inputs['Roughness']: nt.links.remove(l)
    o.data.materials.append(m)
    for pp in o.data.polygons: pp.use_smooth=True
    o.rotation_euler=(math.radians(-25),math.radians(-20),0)
    camera(62*85/36,(0,0,0),85,6); studio(62*85/36,(0,0,0))
    sc.render.filepath='/tmp/claude-0/r/d4_'+name+'.png'; bpy.ops.render.render(write_still=True)
