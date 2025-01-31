import bpy
import os
import sys

# Aggiungi la directory corrente al path di Python
dir_path = os.path.dirname(os.path.realpath(__file__))
if dir_path not in sys.path:
    sys.path.append(dir_path)

# Importa tutti gli script
import create_room
import create_moka
import create_vinyl_display
import create_poster
import setup_lighting
import create_balcony_and_city
import create_furniture_details

def create_complete_scene():
    # Pulisci la scena
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    
    # Crea la stanza base
    create_room.create_room()
    
    # Aggiungi gli oggetti
    create_moka.create_moka()
    create_vinyl_display.create_vinyl_display()
    create_poster.create_pulp_fiction_poster()
    
    # Aggiungi il balcone e la città
    create_balcony_and_city.create_balcony_scene()
    
    # Aggiungi i mobili e i dettagli
    create_furniture_details.create_all_furniture()
    
    # Configura l'illuminazione
    setup_lighting.setup_complete_lighting()
    
    # Imposta la vista
    for area in bpy.context.screen.areas:
        if area.type == 'VIEW_3D':
            for space in area.spaces:
                if space.type == 'VIEW_3D':
                    space.shading.type = 'MATERIAL'
                    break
    
    # Salva il file
    blend_file_path = os.path.join(dir_path, "complete_room.blend")
    bpy.ops.wm.save_as_mainfile(filepath=blend_file_path)

if __name__ == "__main__":
    create_complete_scene()