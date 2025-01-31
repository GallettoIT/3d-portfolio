import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function PlayerModel() {
  const group = useRef<THREE.Group>()
  // Qui importeremo il modello GLTF del personaggio
  // const { nodes, materials, animations } = useGLTF('/models/player.glb')
  // const { actions } = useAnimations(animations, group)

  useFrame((state) => {
    if (!group.current) return
    
    // Qui gestiremo le animazioni del personaggio
    const time = state.clock.getElapsedTime()
    
    // Esempio di respirazione leggera
    if (group.current.getObjectByName('Chest')) {
      group.current.getObjectByName('Chest').position.y = 
        Math.sin(time * 2) * 0.001 + 0.2
    }
  })

  // Placeholder temporaneo finché non abbiamo il modello
  return (
    <group ref={group}>
      {/* Corpo */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.6, 4, 8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      
      {/* Testa */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#8d5524" />
      </mesh>
      
      {/* Capelli */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  )
}