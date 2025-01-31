import bpy
import math
import os

# Pulisci la scena
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

def create_room():
    # Dimensioni della stanza
    width = 6  # Larghezza aumentata
    height = 3
    depth = 8  # Profondità aumentata per il layout rettangolare
    wall_thickness = 0.1

    # Crea il pavimento
    bpy.ops.mesh.primitive_plane_add(size=1)
    floor = bpy.context.active_object
    floor.scale = (width/2, depth/2, 1)
    floor.location = (0, 0, 0)
    floor.name = "Floor"

    # Crea le pareti
    # Parete posteriore
    bpy.ops.mesh.primitive_plane_add(size=1)
    back_wall = bpy.context.active_object
    back_wall.rotation_euler = (math.pi/2, 0, 0)
    back_wall.scale = (width/2, height/2, 1)
    back_wall.location = (0, -depth/2, height/2)
    back_wall.name = "Back_Wall"

    # Parete sinistra
    bpy.ops.mesh.primitive_plane_add(size=1)
    left_wall = bpy.context.active_object
    left_wall.rotation_euler = (math.pi/2, 0, math.pi/2)
    left_wall.scale = (depth/2, height/2, 1)
    left_wall.location = (-width/2, 0, height/2)
    left_wall.name = "Left_Wall"

    # Parete destra
    bpy.ops.mesh.primitive_plane_add(size=1)
    right_wall = bpy.context.active_object
    right_wall.rotation_euler = (math.pi/2, 0, -math.pi/2)
    right_wall.scale = (depth/2, height/2, 1)
    right_wall.location = (width/2, 0, height/2)
    right_wall.name = "Right_Wall"

    # Crea la scrivania
    def create_desk():
        # Piano della scrivania
        bpy.ops.mesh.primitive_cube_add(size=1)
        desk = bpy.context.active_object
        desk.scale = (1.5, 0.8, 0.05)
        desk.location = (0, -depth/4, 0.75)
        desk.name = "Desk"

        # Gambe della scrivania
        leg_width = 0.05
        leg_positions = [
            (1.4, 0.7, 0),
            (-1.4, 0.7, 0),
            (1.4, -0.7, 0),
            (-1.4, -0.7, 0)
        ]

        for i, pos in enumerate(leg_positions):
            bpy.ops.mesh.primitive_cube_add(size=1)
            leg = bpy.context.active_object
            leg.scale = (leg_width, leg_width, 0.75)
            leg.location = (pos[0]/2, pos[1]/2, 0.375)
            leg.name = f"Desk_Leg_{i+1}"

    create_desk()

    # Crea la finestra
    def create_window():
        window_width = 1.2
        window_height = 1.5
        window_depth = wall_thickness
        window_position_z = 1.5

        bpy.ops.mesh.primitive_cube_add(size=1)
        window_frame = bpy.context.active_object
        window_frame.scale = (window_width/2, window_depth/2, window_height/2)
        window_frame.location = (0, -depth/2, window_position_z)
        window_frame.name = "Window_Frame"

        # Aggiungi il vetro
        bpy.ops.mesh.primitive_plane_add(size=1)
        window_glass = bpy.context.active_object
        window_glass.scale = (window_width/2 - 0.05, window_height/2 - 0.05, 1)
        window_glass.rotation_euler = (math.pi/2, 0, 0)
        window_glass.location = (0, -depth/2 + window_depth/2, window_position_z)
        window_glass.name = "Window_Glass"

    create_window()

    # Aggiungi materiali base
    def create_materials():
        # Materiale pavimento
        floor_mat = bpy.data.materials.new(name="Floor_Material")
        floor_mat.use_nodes = True
        floor_mat.node_tree.nodes["Principled BSDF"].inputs[0].default_value = (0.8, 0.6, 0.4, 1)
        floor.data.materials.append(floor_mat)

        # Materiale pareti
        wall_mat = bpy.data.materials.new(name="Wall_Material")
        wall_mat.use_nodes = True
        wall_mat.node_tree.nodes["Principled BSDF"].inputs[0].default_value = (0.9, 0.9, 0.9, 1)
        for wall in [back_wall, left_wall, right_wall]:
            wall.data.materials.append(wall_mat)

    create_materials()

    # Aggiungi illuminazione
    def create_lighting():
        # Luce principale
        bpy.ops.object.light_add(type='SUN', location=(5, 5, 10))
        sun = bpy.context.active_object
        sun.data.energy = 5
        sun.name = "Main_Light"

        # Luce ambientale
        bpy.ops.object.light_add(type='AREA', location=(0, 0, height-0.1))
        ambient = bpy.context.active_object
        ambient.data.energy = 30
        ambient.scale = (width-0.5, depth-0.5, 1)
        ambient.name = "Ambient_Light"

    create_lighting()

create_room()

# Imposta la vista
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        for space in area.spaces:
            if space.type == 'VIEW_3D':
                space.shading.type = 'MATERIAL'
                break

# Salva il file
blend_file_path = os.path.join(os.path.dirname(bpy.data.filepath), "room.blend")
bpy.ops.wm.save_as_mainfile(filepath=blend_file_path)