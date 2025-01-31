import bpy
import math

def setup_lighting():
    # Rimuovi tutte le luci esistenti
    for obj in bpy.data.objects:
        if obj.type == 'LIGHT':
            bpy.data.objects.remove(obj, do_unlink=True)
    
    # Luce principale dalla finestra
    bpy.ops.object.light_add(type='AREA', location=(0, -1.9, 2))
    window_light = bpy.context.active_object
    window_light.data.energy = 500
    window_light.data.size = 1.2
    window_light.data.size_y = 1.5
    window_light.rotation_euler = (0, -math.pi/6, 0)
    window_light.name = "Window_Light"
    
    # Luce ambientale dal soffitto
    bpy.ops.object.light_add(type='AREA', location=(0, 0, 2.9))
    ceiling_light = bpy.context.active_object
    ceiling_light.data.energy = 100
    ceiling_light.data.size = 3
    ceiling_light.data.size_y = 3
    ceiling_light.name = "Ceiling_Light"
    
    # Luce da scrivania
    bpy.ops.object.light_add(type='SPOT', location=(0, -1, 1.5))
    desk_light = bpy.context.active_object
    desk_light.data.energy = 50
    desk_light.data.spot_size = math.pi/4
    desk_light.data.spot_blend = 0.5
    desk_light.rotation_euler = (math.pi/4, 0, 0)
    desk_light.name = "Desk_Light"
    
    # Luce di rimbalzo dal pavimento
    bpy.ops.object.light_add(type='AREA', location=(0, 0, 0.1))
    bounce_light = bpy.context.active_object
    bounce_light.data.energy = 30
    bounce_light.data.size = 4
    bounce_light.data.size_y = 4
    bounce_light.name = "Bounce_Light"
    
    # Impostazioni di rendering
    bpy.context.scene.render.engine = 'CYCLES'
    bpy.context.scene.cycles.samples = 128
    bpy.context.scene.cycles.use_denoising = True
    
    # Impostazioni del mondo
    world = bpy.context.scene.world
    if not world:
        world = bpy.data.worlds.new("World")
        bpy.context.scene.world = world
    
    world.use_nodes = True
    nodes = world.node_tree.nodes
    links = world.node_tree.links
    
    # Pulisci i nodi esistenti
    nodes.clear()
    
    # Crea i nodi per l'illuminazione del mondo
    bg = nodes.new('ShaderNodeBackground')
    output = nodes.new('ShaderNodeOutputWorld')
    bg.inputs['Color'].default_value = (0.1, 0.1, 0.1, 1)
    bg.inputs['Strength'].default_value = 0.5
    
    links.new(bg.outputs['Background'], output.inputs['Surface'])

def setup_volumetrics():
    # Aggiungi volume alla stanza
    bpy.ops.mesh.primitive_cube_add(size=1)
    volume = bpy.context.active_object
    volume.name = "Room_Volume"
    volume.scale = (2, 2, 1.5)
    volume.location = (0, 0, 1.5)
    
    # Crea il materiale volumetrico
    volume_mat = bpy.data.materials.new(name="Volume_Material")
    volume_mat.use_nodes = True
    nodes = volume_mat.node_tree.nodes
    links = volume_mat.node_tree.links
    
    # Pulisci i nodi esistenti
    nodes.clear()
    
    # Crea i nodi per il volume
    volume_scatter = nodes.new('ShaderNodeVolumeScatter')
    volume_scatter.inputs['Density'].default_value = 0.01
    volume_scatter.inputs['Anisotropy'].default_value = 0.3
    
    output = nodes.new('ShaderNodeOutputMaterial')
    links.new(volume_scatter.outputs['Volume'], output.inputs['Volume'])
    
    # Applica il materiale
    volume.data.materials.append(volume_mat)

def setup_complete_lighting():
    setup_lighting()
    setup_volumetrics()

setup_complete_lighting()