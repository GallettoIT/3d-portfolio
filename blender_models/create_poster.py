import bpy
import math
import random

def create_poster():
    # Crea il piano base del poster
    bpy.ops.mesh.primitive_plane_add(size=1)
    poster = bpy.context.active_object
    poster.name = "Pulp_Fiction_Poster"
    poster.scale = (0.5, 0.7, 1)
    
    # Aggiungi un po' di geometria per le pieghe
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.subdivide(number_cuts=10)
    bpy.ops.object.mode_set(mode='OBJECT')
    
    # Aggiungi leggere deformazioni casuali per realismo
    for vertex in poster.data.vertices:
        vertex.co.z += random.uniform(0, 0.005)
    
    # Crea il materiale del poster
    poster_mat = bpy.data.materials.new(name="Poster_Material")
    poster_mat.use_nodes = True
    nodes = poster_mat.node_tree.nodes
    links = poster_mat.node_tree.links
    
    # Pulisci i nodi esistenti
    nodes.clear()
    
    # Crea i nodi necessari
    principled = nodes.new('ShaderNodeBsdfPrincipled')
    output = nodes.new('ShaderNodeOutputMaterial')
    tex_coord = nodes.new('ShaderNodeTexCoord')
    tex_image = nodes.new('ShaderNodeTexImage')
    bump = nodes.new('ShaderNodeBump')
    
    # Carica l'immagine del poster (dovrà essere creata separatamente)
    # tex_image.image = bpy.data.images.load("pulp_fiction_poster.jpg")
    
    # Collega i nodi
    links.new(tex_coord.outputs['UV'], tex_image.inputs['Vector'])
    links.new(tex_image.outputs['Color'], principled.inputs['Base Color'])
    links.new(tex_image.outputs['Color'], bump.inputs['Height'])
    links.new(bump.outputs['Normal'], principled.inputs['Normal'])
    links.new(principled.outputs['BSDF'], output.inputs['Surface'])
    
    # Configura il materiale
    principled.inputs['Roughness'].default_value = 0.4
    principled.inputs['Specular'].default_value = 0.2
    
    # Applica il materiale
    poster.data.materials.append(poster_mat)
    
    # Posiziona il poster sulla parete
    poster.location = (1.95, 0, 1.5)
    poster.rotation_euler = (0, -math.pi/2, 0)
    
    # Aggiungi una leggera inclinazione casuale
    poster.rotation_euler.z += random.uniform(-0.02, 0.02)
    
    return poster

def create_poster_frame():
    # Crea il telaio del poster
    bpy.ops.mesh.primitive_cube_add(size=1)
    frame = bpy.context.active_object
    frame.name = "Poster_Frame"
    
    # Scala il telaio per adattarlo al poster
    frame.scale = (0.02, 0.52, 0.72)
    
    # Crea il materiale del telaio
    frame_mat = bpy.data.materials.new(name="Frame_Material")
    frame_mat.use_nodes = True
    nodes = frame_mat.node_tree.nodes
    principled = nodes["Principled BSDF"]
    principled.inputs["Base Color"].default_value = (0.1, 0.1, 0.1, 1)
    principled.inputs["Roughness"].default_value = 0.8
    
    # Applica il materiale
    frame.data.materials.append(frame_mat)
    
    # Posiziona il telaio
    frame.location = (1.94, 0, 1.5)
    frame.rotation_euler = (0, -math.pi/2, 0)
    
    return frame

def create_pulp_fiction_poster():
    poster = create_poster()
    frame = create_poster_frame()
    
    # Raggruppa poster e telaio
    bpy.ops.object.select_all(action='DESELECT')
    poster.select_set(True)
    frame.select_set(True)
    bpy.context.view_layer.objects.active = frame
    bpy.ops.object.join()

create_pulp_fiction_poster()