import bpy
import math
import random

def create_vinyl_with_cover(position, rotation):
    # Crea il disco in vinile
    bpy.ops.mesh.primitive_cylinder_add(radius=0.15, depth=0.002)
    vinyl = bpy.context.active_object
    vinyl.location = position
    vinyl.rotation_euler = rotation
    vinyl.name = "Vinyl_Disc"
    
    # Crea la copertina
    bpy.ops.mesh.primitive_cube_add(size=0.31)
    cover = bpy.context.active_object
    cover.scale = (1, 1, 0.01)
    cover.location = (position[0], position[1], position[2] + 0.002)
    cover.rotation_euler = rotation
    cover.name = "Vinyl_Cover"
    
    # Materiale per il vinile
    vinyl_mat = bpy.data.materials.new(name="Vinyl_Material")
    vinyl_mat.use_nodes = True
    nodes = vinyl_mat.node_tree.nodes
    principled = nodes["Principled BSDF"]
    principled.inputs["Base Color"].default_value = (0.02, 0.02, 0.02, 1)
    principled.inputs["Roughness"].default_value = 0.3
    vinyl.data.materials.append(vinyl_mat)
    
    # Materiale per la copertina
    cover_mat = bpy.data.materials.new(name="Cover_Material")
    cover_mat.use_nodes = True
    nodes = cover_mat.node_tree.nodes
    principled = nodes["Principled BSDF"]
    # Colore casuale per ogni copertina
    color = (random.random(), random.random(), random.random(), 1)
    principled.inputs["Base Color"].default_value = color
    principled.inputs["Roughness"].default_value = 0.8
    cover.data.materials.append(cover_mat)
    
    return vinyl, cover

def create_wall_mount(position):
    # Supporto a parete
    bpy.ops.mesh.primitive_cube_add(size=0.05)
    mount = bpy.context.active_object
    mount.scale = (0.5, 0.1, 0.02)
    mount.location = position
    mount.name = "Vinyl_Mount"
    
    # Materiale per il supporto
    mount_mat = bpy.data.materials.new(name="Mount_Material")
    mount_mat.use_nodes = True
    nodes = mount_mat.node_tree.nodes
    principled = nodes["Principled BSDF"]
    principled.inputs["Base Color"].default_value = (0.1, 0.1, 0.1, 1)
    mount.data.materials.append(mount_mat)
    
    return mount

def create_vinyl_display():
    vinyl_displays = []
    mount_height = 1.8  # Altezza sulla parete
    
    # Crea 5 vinili con supporti
    for i in range(5):
        x_pos = -0.8 + (i * 0.4)  # Spaziatura orizzontale
        
        # Crea il supporto
        mount = create_wall_mount((x_pos, -1.95, mount_height))
        
        # Crea il vinile con leggera rotazione casuale
        rotation = (0, 0, random.uniform(-0.1, 0.1))
        vinyl, cover = create_vinyl_with_cover(
            (x_pos, -1.90, mount_height),
            rotation
        )
        
        vinyl_displays.extend([mount, vinyl, cover])
    
    # Raggruppa tutti gli oggetti
    bpy.ops.object.select_all(action='DESELECT')
    for obj in vinyl_displays:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = vinyl_displays[0]
    bpy.ops.object.group_link(group="Vinyl_Display")

create_vinyl_display()