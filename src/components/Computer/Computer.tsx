import { useRef } from 'react'
import { Group } from 'three'
import { ENVIRONMENT_CONFIG } from '../../config/environment.config'

export function Computer() {
  const group = useRef<Group>(null)

  return (
    <group ref={group} position={[0, 0.5, -2]}>
      {/* Monitor */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 0.6, 0.05]} />
        <meshStandardMaterial 
          color={ENVIRONMENT_CONFIG.materials.metals.color || "#333333"}
          metalness={ENVIRONMENT_CONFIG.materials.metals.metalness}
          roughness={ENVIRONMENT_CONFIG.materials.metals.roughness}
        />
      </mesh>

      {/* Base */}
      <mesh castShadow receiveShadow position={[0, 0.25, 0.1]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Schermo */}
      <mesh position={[0, 0.5, 0.026]}>
        <planeGeometry args={[0.9, 0.5]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  )
}