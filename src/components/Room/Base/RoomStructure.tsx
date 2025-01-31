import { useMemo } from 'react'
import * as THREE from 'three'
import { ENVIRONMENT_CONFIG } from '../../../config/environment.config'

export function RoomStructure() {
  // Materiali
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
        <planeGeometry args={[8, 12]} />
        <primitive object={materials.floor} />
      </mesh>

      {/* Pareti */}
      <mesh 
        receiveShadow 
        position={[0, 1.5, -6]}
      >
        <boxGeometry args={[8, 3, 0.2]} />
        <primitive object={materials.wall} />
      </mesh>

      <mesh 
        receiveShadow 
        position={[-4, 1.5, 0]} 
        rotation={[0, Math.PI / 2, 0]}
      >
        <boxGeometry args={[12, 3, 0.2]} />
        <primitive object={materials.wall} />
      </mesh>

      <mesh 
        receiveShadow 
        position={[4, 1.5, 0]} 
        rotation={[0, -Math.PI / 2, 0]}
      >
        <boxGeometry args={[12, 3, 0.2]} />
        <primitive object={materials.wall} />
      </mesh>
    </group>
  )
}