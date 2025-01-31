import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { Group } from 'three'
import { Computer } from '../components/Computer/Computer'
import { RoomModel } from '../models/Room/RoomModel'
import { useFirstPersonControls } from '../hooks/useFirstPersonControls'

export function Room() {
  const roomRef = useRef<Group>(null)
  const controls = useFirstPersonControls()

  useFrame((state) => {
    if (!roomRef.current) return
    
    // Animazioni ambientali
    const time = state.clock.getElapsedTime()
    
    // Oscillazione luce ambientale
    state.scene.traverse((object) => {
      if (object.type === 'AmbientLight') {
        (object as THREE.AmbientLight).intensity = 0.5 + Math.sin(time) * 0.05
      }
    })
  })

  return (
    <group ref={roomRef}>
      {/* Ambiente */}
      <Environment preset="apartment" />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        position={[0, 3, 0]}
        intensity={0.3}
        angle={0.5}
        penumbra={1}
        castShadow
      />

      {/* Modello della stanza */}
      <RoomModel />

      {/* Computer interattivo */}
      <Computer />

      {/* Ombre */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.4}
        scale={4}
        blur={2}
        far={4}
      />
    </group>
  )
}