import bpy
import math
import bmesh

def create_sickle():
    # Crea la curva per la falce
    bpy.ops.curve.primitive_bezier_curve_add()
    sickle_curve = bpy.context.active_object
    sickle_curve.name = "Sickle_Curve"
    
    # Modifica i punti della curva per formare la falce
    points = sickle_curve.data.splines[0].bezier_points
    points[0].co = (0, 0, 0)
    points[1].co = (0.2, 0.2, 0)
    points[1].handle_left = (0.1, 0.1, 0)
    points[1].handle_right = (0.3, 0.3, 0)
    
    # Converti la curva in mesh
    bpy.context.view_layer.objects.active = sickle_curve
    bpy.ops.object.convert(target='MESH')
    
    # Estrudi la mesh per dare spessore
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.extrude_region_move(TRANSFORM_OT_translate=(0, 0, 0.02))
    bpy.ops.object.mode_set(mode='OBJECT')
    
    return sickle_curve

def create_hammer():
    # Crea il manico
    bpy.ops.mesh.primitive_cylinder_add(radius=0.02, depth=0.4)
    handle = bpy.context.active_object
    handle.name = "Hammer_Handle"
    
    # Crea la testa del martello
    bpy.ops.mesh.primitive_cube_add(size=0.15)
    head = bpy.context.active_object
    head.scale = (1, 0.3, 0.3)
    head.location = (0, 0, 0.2)
    head.name = "Hammer_Head"
    
    # Unisci gli oggetti
    bpy.ops.object.select_all(action='DESELECT')
    head.select_set(True)
    handle.select_set(True)
    bpy.context.view_layer.objects.active = handle
    bpy.ops.object.join()
    
    return handle

def create_hammer_and_sickle():
    # Crea gli oggetti
    sickle = create_sickle()
    hammer = create_hammer()
    
    # Posiziona gli oggetti
    hammer.location = (-0.1, 0, 0)
    hammer.rotation_euler = (0, 0, -math.pi/4)
    
    sickle.location = (0.1, 0, 0)
    sickle.rotation_euler = (0, 0, math.pi/4)
    
    # Materiale metallico rosso
    red_metal = bpy.data.materials.new(name="Red_Metal")
    red_metal.use_nodes = True
    nodes = red_metal.node_tree.nodes
    principled = nodes["Principled BSDF"]
    principled.inputs["Base Color"].default_value = (0.8, 0.0, 0.0, 1)
    principled.inputs["Metallic"].default_value = 0.8
    principled.inputs["Roughness"].default_value = 0.2
    
    # Applica il materiale
    for obj in [hammer, sickle]:
        obj.data.materials.append(red_metal)
    
    # Raggruppa gli oggetti
    bpy.ops.object.select_all(action='DESELECT')
    hammer.select_set(True)
    sickle.select_set(True)
    bpy.context.view_layer.objects.active = hammer
    bpy.ops.object.join()
    
    # Posiziona sulla parete
    hammer.location = (-1.95, 0, 1.5)
    hammer.rotation_euler = (0, math.pi/2, 0)

create_hammer_and_sickle()