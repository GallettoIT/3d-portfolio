import bpy
import math
import bmesh

def create_moka():
    # Base della moka
    bpy.ops.mesh.primitive_cylinder_add(radius=0.05, depth=0.12)
    base = bpy.context.active_object
    base.name = "Moka_Base"
    
    # Parte superiore
    bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=0.08, location=(0, 0, 0.1))
    top = bpy.context.active_object
    top.name = "Moka_Top"
    
    # Manico
    bpy.ops.mesh.primitive_cylinder_add(radius=0.01, depth=0.08)
    handle = bpy.context.active_object
    handle.name = "Moka_Handle"
    handle.rotation_euler = (0, math.pi/2, 0)
    handle.location = (0.06, 0, 0.08)
    
    # Beccuccio
    bpy.ops.mesh.primitive_cone_add(radius1=0.01, radius2=0.005, depth=0.04)
    spout = bpy.context.active_object
    spout.name = "Moka_Spout"
    spout.rotation_euler = (0, -math.pi/2, 0)
    spout.location = (-0.04, 0, 0.14)
    
    # Materiale metallico
    metal_mat = bpy.data.materials.new(name="Moka_Metal")
    metal_mat.use_nodes = True
    nodes = metal_mat.node_tree.nodes
    principled = nodes["Principled BSDF"]
    principled.inputs["Metallic"].default_value = 1.0
    principled.inputs["Roughness"].default_value = 0.2
    principled.inputs["Base Color"].default_value = (0.8, 0.8, 0.8, 1)
    
    # Applica il materiale a tutte le parti
    for obj in [base, top, handle, spout]:
        obj.data.materials.append(metal_mat)
        
    # Raggruppa tutti gli oggetti
    bpy.ops.object.select_all(action='DESELECT')
    for obj in [base, top, handle, spout]:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = base
    bpy.ops.object.join()
    
    # Aggiungi il sistema di particelle per il vapore
    bpy.ops.object.particle_system_add()
    psys = base.particle_systems[0]
    psys.settings.type = 'EMITTER'
    psys.settings.count = 100
    psys.settings.frame_start = 1
    psys.settings.frame_end = 1
    psys.settings.lifetime = 50
    psys.settings.emit_from = 'VERT'
    psys.settings.physics_type = 'NEWTON'
    psys.settings.render_type = 'NONE'
    psys.settings.particle_size = 0.01
    psys.settings.gravity = (0, 0, 0.1)

create_moka()