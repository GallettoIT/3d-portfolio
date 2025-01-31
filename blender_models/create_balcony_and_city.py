import bpy
import math
import random

def create_city_buildings():
    buildings = []
    for i in range(30):  # Crea 30 edifici
        # Posizione casuale ma organizzata
        x = random.uniform(-20, 20)
        y = random.uniform(-30, -10)  # Sempre davanti al balcone
        height = random.uniform(5, 30)  # Altezza variabile
        
        # Crea l'edificio
        bpy.ops.mesh.primitive_cube_add()
        building = bpy.context.active_object
        building.scale = (
            random.uniform(2, 4),  # Larghezza
            random.uniform(2, 4),  # Profondità
            height/2  # Altezza
        )
        building.location = (x, y, height/2)
        
        # Materiale dell'edificio
        mat = bpy.data.materials.new(name=f"Building_Mat_{i}")
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        principled = nodes["Principled BSDF"]
        
        # Colori notturni con luci alle finestre
        base_color = (
            random.uniform(0.05, 0.15),
            random.uniform(0.05, 0.15),
            random.uniform(0.05, 0.2),
            1
        )
        principled.inputs["Base Color"].default_value = base_color
        principled.inputs["Emission"].default_value = (
            random.uniform(0.1, 0.3),
            random.uniform(0.1, 0.3),
            random.uniform(0.1, 0.4),
            1
        )
        principled.inputs["Emission Strength"].default_value = 0.5
        
        building.data.materials.append(mat)
        buildings.append(building)
    
    return buildings

def create_balcony():
    # Piano del balcone
    bpy.ops.mesh.primitive_cube_add()
    floor = bpy.context.active_object
    floor.scale = (3, 1, 0.1)
    floor.location = (0, -depth/2 - 1, 0)  # depth viene dalla stanza principale
    
    # Ringhiera
    railing_height = 1
    posts = []
    for x in [-2.8, -1.4, 0, 1.4, 2.8]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.05)
        post = bpy.context.active_object
        post.scale = (1, 1, railing_height)
        post.location = (x, -depth/2 - 1, railing_height)
        posts.append(post)
    
    # Barre orizzontali
    for z in [0.3, 0.6, 0.9]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.02)
        bar = bpy.context.active_object
        bar.scale = (3, 1, 1)
        bar.location = (0, -depth/2 - 1, z)
        bar.rotation_euler = (0, math.pi/2, 0)
        posts.append(bar)
    
    # Materiale metallico per la ringhiera
    metal_mat = bpy.data.materials.new(name="Railing_Metal")
    metal_mat.use_nodes = True
    nodes = metal_mat.node_tree.nodes
    principled = nodes["Principled BSDF"]
    principled.inputs["Metallic"].default_value = 1.0
    principled.inputs["Roughness"].default_value = 0.2
    
    for post in posts:
        post.data.materials.append(metal_mat)
    
    return floor, posts

def create_city_atmosphere():
    # Crea la nebbia volumetrica
    bpy.ops.mesh.primitive_cube_add(size=100)
    atmosphere = bpy.context.active_object
    atmosphere.location = (0, -20, 25)
    
    # Materiale volumetrico per l'atmosfera
    vol_mat = bpy.data.materials.new(name="City_Atmosphere")
    vol_mat.use_nodes = True
    nodes = vol_mat.node_tree.nodes
    links = vol_mat.node_tree.links
    
    # Pulisci i nodi esistenti
    nodes.clear()
    
    # Crea i nodi per l'atmosfera
    volume_scatter = nodes.new('ShaderNodeVolumeScatter')
    volume_scatter.inputs['Density'].default_value = 0.01
    volume_scatter.inputs['Anisotropy'].default_value = 0.3
    volume_scatter.inputs['Color'].default_value = (0.1, 0.12, 0.15, 1)
    
    output = nodes.new('ShaderNodeOutputMaterial')
    links.new(volume_scatter.outputs['Volume'], output.inputs['Volume'])
    
    atmosphere.data.materials.append(vol_mat)
    
    # Aggiungi luci della città
    for _ in range(20):
        bpy.ops.object.light_add(type='POINT')
        light = bpy.context.active_object
        light.location = (
            random.uniform(-20, 20),
            random.uniform(-30, -10),
            random.uniform(5, 20)
        )
        light.data.energy = random.uniform(100, 500)
        light.data.color = (
            random.uniform(0.8, 1),
            random.uniform(0.8, 1),
            random.uniform(0.8, 1)
        )

def create_balcony_scene():
    buildings = create_city_buildings()
    floor, posts = create_balcony()
    create_city_atmosphere()
    
    # Raggruppa tutti gli elementi
    bpy.ops.object.select_all(action='DESELECT')
    for obj in buildings + posts + [floor]:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = buildings[0]
    bpy.ops.object.join()