import bpy
import math
import random

def create_ikea_sofa():
    # Base del divano
    bpy.ops.mesh.primitive_cube_add()
    base = bpy.context.active_object
    base.scale = (1.2, 0.8, 0.4)
    base.location = (2, -1, 0.4)
    
    # Schienale
    bpy.ops.mesh.primitive_cube_add()
    back = bpy.context.active_object
    back.scale = (1.2, 0.2, 0.4)
    back.location = (2, -1.6, 0.8)
    
    # Cuscini della seduta
    cushions = []
    for x in [-0.5, 0.5]:
        bpy.ops.mesh.primitive_cube_add()
        cushion = bpy.context.active_object
        cushion.scale = (0.55, 0.7, 0.1)
        cushion.location = (2 + x, -1, 0.5)
        
        # Deforma leggermente i cuscini per realismo
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.subdivide(number_cuts=2)
        bpy.ops.object.mode_set(mode='OBJECT')
        for vertex in cushion.data.vertices:
            vertex.co.z += random.uniform(0, 0.05)
        
        cushions.append(cushion)
    
    # Materiale del divano
    sofa_mat = bpy.data.materials.new(name="Sofa_Fabric")
    sofa_mat.use_nodes = True
    nodes = sofa_mat.node_tree.nodes
    principled = nodes["Principled BSDF"]
    # Colore grigio IKEA tipico
    principled.inputs["Base Color"].default_value = (0.6, 0.6, 0.6, 1)
    principled.inputs["Roughness"].default_value = 0.9
    
    for obj in [base, back] + cushions:
        obj.data.materials.append(sofa_mat)
    
    return [base, back] + cushions

def create_desk_details():
    # Posacenere con blunt
    def create_ashtray():
        bpy.ops.mesh.primitive_cylinder_add(radius=0.1, depth=0.05)
        ashtray = bpy.context.active_object
        ashtray.location = (0.6, -0.3, 0.82)
        
        # Blunt
        bpy.ops.mesh.primitive_cylinder_add(radius=0.01, depth=0.08)
        blunt = bpy.context.active_object
        blunt.rotation_euler = (0, math.pi/4, 0)
        blunt.location = (0.62, -0.32, 0.85)
        
        # Materiale posacenere (vetro)
        glass_mat = bpy.data.materials.new(name="Glass_Material")
        glass_mat.use_nodes = True
        nodes = glass_mat.node_tree.nodes
        principled = nodes["Principled BSDF"]
        principled.inputs["Base Color"].default_value = (0.8, 0.8, 0.8, 1)
        principled.inputs["Metallic"].default_value = 0.9
        principled.inputs["Roughness"].default_value = 0.1
        principled.inputs["Transmission"].default_value = 0.8
        ashtray.data.materials.append(glass_mat)
        
        # Materiale blunt
        blunt_mat = bpy.data.materials.new(name="Blunt_Material")
        blunt_mat.use_nodes = True
        nodes = blunt_mat.node_tree.nodes
        principled = nodes["Principled BSDF"]
        principled.inputs["Base Color"].default_value = (0.2, 0.15, 0.1, 1)
        blunt.data.materials.append(blunt_mat)
        
        return [ashtray, blunt]
    
    # Altri dettagli da ragazzo
    def create_misc_items():
        items = []
        
        # Tazza di caffè mezza piena
        bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.08)
        cup = bpy.context.active_object
        cup.location = (0.3, -0.4, 0.82)
        items.append(cup)
        
        # Appunti sparsi
        for _ in range(3):
            bpy.ops.mesh.primitive_plane_add(size=0.2)
            paper = bpy.context.active_object
            paper.location = (
                random.uniform(-0.5, 0.5),
                random.uniform(-0.5, 0),
                0.82
            )
            paper.rotation_euler = (0, 0, random.uniform(-0.3, 0.3))
            items.append(paper)
        
        # Cuffie
        bpy.ops.mesh.primitive_torus_add(major_radius=0.1, minor_radius=0.02)
        headphones = bpy.context.active_object
        headphones.location = (-0.4, -0.3, 0.82)
        items.append(headphones)
        
        return items
    
    # Crea tutti i dettagli
    ashtray_objects = create_ashtray()
    misc_objects = create_misc_items()
    
    return ashtray_objects + misc_objects

def create_wall_carving():
    # Crea un piano per la texture del muro
    bpy.ops.mesh.primitive_plane_add(size=0.3)
    carving = bpy.context.active_object
    carving.location = (-2.9, 0, 1.5)  # Posizione nascosta sul muro
    carving.rotation_euler = (0, math.pi/2, 0)
    
    # Aggiungi dettagli con displacement
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.subdivide(number_cuts=30)
    bpy.ops.object.mode_set(mode='OBJECT')
    
    # Materiale con effetto inciso
    carving_mat = bpy.data.materials.new(name="Carving_Material")
    carving_mat.use_nodes = True
    nodes = carving_mat.node_tree.nodes
    links = carving_mat.node_tree.links
    
    # Crea i nodi per l'effetto inciso
    noise = nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 50
    noise.inputs['Detail'].default_value = 2
    
    bump = nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.2
    
    principled = nodes["Principled BSDF"]
    principled.inputs["Base Color"].default_value = (0.8, 0.8, 0.8, 1)
    principled.inputs["Roughness"].default_value = 0.9
    
    links.new(noise.outputs['Color'], bump.inputs['Height'])
    links.new(bump.outputs['Normal'], principled.inputs['Normal'])
    
    carving.data.materials.append(carving_mat)
    
    return carving

def create_all_furniture():
    sofa = create_ikea_sofa()
    desk_items = create_desk_details()
    carving = create_wall_carving()
    
    # Raggruppa tutti gli oggetti
    bpy.ops.object.select_all(action='DESELECT')
    for obj in sofa + desk_items + [carving]:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = sofa[0]
    bpy.ops.object.join()