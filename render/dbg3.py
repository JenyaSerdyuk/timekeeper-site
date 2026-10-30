import sys; src=open('/tmp/claude-0/r/tk.py').read().split("if __name__")[0]
import bpy
for wr in [0,90,180,270]:
    exec(src.replace("WROT = 30","WROT = %d"%wr))
    sc,root=build('keychain','silver'); sc.render.resolution_x=sc.render.resolution_y=300; sc.cycles.samples=12
    root.rotation_euler=(math.radians(-14),math.radians(-25),0)
    sc.render.filepath='/tmp/claude-0/r/w%d.png'%wr; bpy.ops.render.render(write_still=True)
