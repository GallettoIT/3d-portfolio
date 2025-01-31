import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { Group } from 'three'
import { Computer } from '../components/Computer/Computer'
import { RoomStructure } from '../components/Room/Base/RoomStructure'
import { useFirstPersonControls } from '../hooks/useFirstPersonControls'

export function Room() {
  const roomRef = useRef<Group>(null)
  const controls = useFirstPersonControls()

  return (
    <group ref={roomRef}>
      {/* Struttura base della stanza */}
      <RoomStructure />

      {/* Computer interattivo */}
      <Computer />

      {/* Ombre di contatto */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.4}
        scale={12}
        blur={2}
        far={4}
        resolution={1024}
        color="#000000"
      />
    </group>
  )
}