import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function RoomModel({ isInteractive = true }) {
  const group = useRef<THREE.Group>()
  // Qui importeremo il modello GLTF
  // const { nodes, materials } = useGLTF('/models/room.glb')

  useFrame((state) => {
    if (!group.current) return
    
    // Animazioni ambiente
    const time = state.clock.getElapsedTime()
    
    // Animazione vapore moka
    if (group.current.getObjectByName('coffee_steam')) {
      group.current.getObjectByName('coffee_steam').position.y = 
        Math.sin(time * 2) * 0.02 + 0.2
    }

    // Effetti luminosi
    if (group.current.getObjectByName('desk_lamp')) {
      const lamp = group.current.getObjectByName('desk_lamp')
      lamp.intensity = 1 + Math.sin(time) * 0.1
    }
  })

  // Placeholder temporaneo finché non abbiamo il modello
  return (
    <group ref={group}>
      {/* Stanza base */}
      <mesh position={[0, 1.5, 0]} receiveShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#e0e0e0" side={THREE.BackSide} />
      </mesh>

      {/* Scrivania */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Moka placeholder */}
      <mesh position={[0.5, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.15, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Poster placeholder */}
      <mesh position={[1.95, 1.5, 0]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[1, 1.5]} />
        <meshStandardMaterial color="#ff9999" />
      </mesh>

      {/* Vinili placeholder */}
      {[-1, -0.5, 0, 0.5, 1].map((x, i) => (
        <mesh key={i} position={[x, 2, -1.95]} rotation={[0, 0, Math.random() * 0.2 - 0.1]}>
          <boxGeometry args={[0.3, 0.3, 0.01]} />
          <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 50%)`} />
        </mesh>
      ))}

      {/* Falce e martello placeholder */}
      <group position={[-1.95, 1.5, 0]} rotation={[0, Math.PI/2, 0]}>
        <mesh castShadow>
          <torusGeometry args={[0.3, 0.02, 16, 100, Math.PI]} />
          <meshStandardMaterial color="#cc0000" />
        </mesh>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.04, 0.6, 0.04]} />
          <meshStandardMaterial color="#cc0000" />
        </mesh>
      </group>

      {/* Libri e disordine */}
      {[...Array(5)].map((_, i) => (
        <group key={i} position={[-0.5 + Math.random() * 0.2, 0.45 + i * 0.03, -0.2 + Math.random() * 0.1]} 
               rotation={[0, Math.random() * 0.2 - 0.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.2, 0.03, 0.15]} />
            <meshStandardMaterial color={`hsl(${Math.random() * 60 + 20}, 70%, 50%)`} />
          </mesh>
        </group>
      ))}

      {/* Post-it e note */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} 
              position={[
                -0.7 + Math.random() * 1.4,
                1 + Math.random() * 1,
                1.95
              ]}
              rotation={[0, 0, Math.random() * 0.5 - 0.25]}>
          <planeGeometry args={[0.1, 0.1]} />
          <meshStandardMaterial color={`hsl(${Math.random() * 60 + 40}, 70%, 80%)`} />
        </mesh>
      ))}
    </group>
  )
}