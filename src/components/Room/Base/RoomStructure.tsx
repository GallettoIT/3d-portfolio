import { useMemo } from 'react'
import * as THREE from 'three'
import { ENVIRONMENT_CONFIG } from '../../../config/environment.config'

const ROOM_SIZE = {
  width: 8,
  height: 3,
  depth: 12
}

export function RoomStructure() {
  const materials = useMemo(() => ({
    wall: new THREE.MeshStandardMaterial({
      color: ENVIRONMENT_CONFIG.materials.walls.color,
      roughness: ENVIRONMENT_CONFIG.materials.walls.roughness,
      metalness: ENVIRONMENT_CONFIG.materials.walls.metalness
    }),
    floor: new THREE.MeshStandardMaterial({
      color: ENVIRONMENT_CONFIG.materials.floor.color,
      roughness: ENVIRONMENT_CONFIG.materials.floor.roughness,
      metalness: ENVIRONMENT_CONFIG.materials.floor.metalness
    })
  }), [])

  return (
    <group>
      {/* Pavimento */}
      <mesh 
        receiveShadow 
        rotation-x={-Math.PI / 2} 
        position={[0, 0, 0]}
      >
        <planeGeometry args={[ROOM_SIZE.width, ROOM_SIZE.depth]} />
        <primitive object={materials.floor} />
      </mesh>

      {/* Pareti */}
      {/* Parete posteriore */}
      <mesh 
        receiveShadow 
        position={[0, ROOM_SIZE.height/2, -ROOM_SIZE.depth/2]}
      >
        <boxGeometry args={[ROOM_SIZE.width, ROOM_SIZE.height, 0.2]} />
        <primitive object={materials.wall} />
      </mesh>

      {/* Parete sinistra */}
      <mesh 
        receiveShadow 
        position={[-ROOM_SIZE.width/2, ROOM_SIZE.height/2, 0]} 
        rotation={[0, Math.PI / 2, 0]}
      >
        <boxGeometry args={[ROOM_SIZE.depth, ROOM_SIZE.height, 0.2]} />
        <primitive object={materials.wall} />
      </mesh>

      {/* Parete destra */}
      <mesh 
        receiveShadow 
        position={[ROOM_SIZE.width/2, ROOM_SIZE.height/2, 0]} 
        rotation={[0, -Math.PI / 2, 0]}
      >
        <boxGeometry args={[ROOM_SIZE.depth, ROOM_SIZE.height, 0.2]} />
        <primitive object={materials.wall} />
      </mesh>
    </group>
  )
}