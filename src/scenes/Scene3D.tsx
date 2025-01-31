import { useRef } from 'react'
import { ContactShadows, Environment } from '@react-three/drei'
import { Group } from 'three'
import { Computer } from '../components/Computer/Computer'
import { RoomStructure } from '../components/Room/Base/RoomStructure'
import { useFirstPersonControls } from '../hooks/useFirstPersonControls'

export function Scene3D() {
  const roomRef = useRef<Group>(null)
  const controls = useFirstPersonControls()

  return (
    <>
      <Environment preset="sunset" />
      
      <group ref={roomRef}>
        <RoomStructure />
        <Computer />
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
    </>
  )
}