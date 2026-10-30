exec(open('/tmp/claude-0/r/tk.py').read().split("if __name__")[0])
for name in ['bev','bool','full']:
    sc=reset(); sc.render.resolution_x=sc.render.resolution_y=300; sc.cycles.samples=12
    body=cyl('body',20,11,192)
    md=body.modifiers.new('b','BEVEL'); md.width=1.3; md.segments=8; md.limit_method='ANGLE'; md.angle_limit=math.radians(40); apply_mods(body)
    if name!='bev':
        display_window(body,24,5.6,1.0,5.5,R+'disp.png')
    m=metal('f','silver',radial=True,aniso=0.95,rough=0.3); body.data.materials.append(m)
    if name=='full': smooth(body)
    else:
        for pp in body.data.polygons: pp.use_smooth=True
    body.rotation_euler=(math.radians(-25),math.radians(-20),0)
    camera(62*85/36,(0,0,0),85,6); studio(62*85/36,(0,0,0))
    sc.render.filepath='/tmp/claude-0/r/d5_'+name+'.png'; bpy.ops.render.render(write_still=True)
