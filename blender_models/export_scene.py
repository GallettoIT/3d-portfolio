import bpy
import os

def optimize_scene():
    # Ottimizza le mesh
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            # Rimuovi i doppi vertici
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.mode_set(mode='EDIT')
            bpy.ops.mesh.remove_doubles()
            bpy.ops.mesh.tris_convert_to_quads()
            bpy.ops.object.mode_set(mode='OBJECT')
            
            # Applica le trasformazioni
            bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

def bake_lighting():
    # Bake delle texture di illuminazione
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            # Crea una nuova texture per il baking
            bake_tex = bpy.data.textures.new(name=f"{obj.name}_bake", type='IMAGE')
            bake_img = bpy.data.images.new(name=f"{obj.name}_bake", width=1024, height=1024)
            
            # Bake dell'illuminazione
            bpy.ops.object.bake(type='COMBINED')

def export_scene():
    # Ottimizza prima dell'esportazione
    optimize_scene()
    bake_lighting()
    
    # Percorso di esportazione
    export_path = os.path.join(os.path.dirname(bpy.data.filepath), "room.glb")
    
    # Impostazioni di esportazione
    bpy.ops.export_scene.gltf(
        filepath=export_path,
        export_format='GLB',
        use_selection=False,
        export_materials=True,
        export_textures=True,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_lights=True
    )

if __name__ == "__main__":
    export_scene()