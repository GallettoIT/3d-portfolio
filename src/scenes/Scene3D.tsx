import { useRef, useEffect } from 'react'
import { ContactShadows, Environment } from '@react-three/drei'
import { Group } from 'three'
import { Computer } from '../components/Computer/Computer'
import { RoomStructure } from '../components/Room/Base/RoomStructure'
import { useFirstPersonControls } from '../hooks/useFirstPersonControls'

export function Scene3D() {
  const roomRef = useRef<Group>(null)

  // Inizializza i controlli dopo che la scena è pronta
  useEffect(() => {
    const controls = useFirstPersonControls()
    return () => {
      // Cleanup dei controlli se necessario
    }
  }, [])

  return (
    <>
      {/* Ambiente - renderizzato per primo */}
      <Environment preset="sunset" />
      
      {/* Luci di base */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
      
      <group ref={roomRef}>
        {/* Struttura base della stanza */}
        <RoomStructure />

        {/* Computer interattivo */}
        <Computer />

        {/* Ombre di contatto - renderizzate per ultime */}
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