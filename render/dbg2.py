import sys; exec(open('/tmp/claude-0/r/tk.py').read().split("if __name__")[0])
sc,root=build('keychain','silver')
b=bpy.data.objects['body']
import collections
c=collections.Counter((p.material_index) for p in b.data.polygons); print('MI',c)
big=sorted(b.data.polygons,key=lambda p:-p.area)[:4]; print([(p.area,p.material_index,tuple(round(x,2) for x in p.normal)) for p in big])
print([m.name for m in b.data.materials])
f=b.data.materials[0]; p=f.node_tree.nodes['Principled BSDF']; print({i.name:(i.is_linked, getattr(i,'default_value',None) if not hasattr(i.default_value,'__len__') else tuple(i.default_value)) for i in p.inputs if i.name in ('Anisotropic','Roughness','Tangent','Normal','Metallic')})
