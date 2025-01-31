import { useRef, useEffect } from 'react'
import { ContactShadows, Environment } from '@react-three/drei'
import { Group } from 'three'
import { Computer } from '../components/Computer/Computer'
import { RoomStructure } from '../components/Room/Base/RoomStructure'
import { useFirstPersonControls } from '../hooks/useFirstPersonControls'
import { ENVIRONMENT_CONFIG } from '../config/environment.config'

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
      {/* Luci di base */}
      <ambientLight 
        intensity={ENVIRONMENT_CONFIG.lighting.ambient.intensity} 
        color={ENVIRONMENT_CONFIG.lighting.ambient.color} 
      />
      <directionalLight 
        position={ENVIRONMENT_CONFIG.lighting.window.position} 
        intensity={ENVIRONMENT_CONFIG.lighting.window.intensity}
        color={ENVIRONMENT_CONFIG.lighting.window.color}
        castShadow
      />
      
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

      {/* Environment - renderizzato per ultimo e con preset semplice */}
      <Environment preset="sunset" />
    </>
  )
}