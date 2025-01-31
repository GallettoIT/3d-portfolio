import { useRef, useEffect, Suspense } from 'react'
import { ContactShadows, Environment } from '@react-three/drei'
import { Group } from 'three'
import { Computer } from '../components/Computer/Computer'
import { RoomStructure } from '../components/Room/Base/RoomStructure'
import { useFirstPersonControls } from '../hooks/useFirstPersonControls'
import { ENVIRONMENT_CONFIG } from '../config/environment.config'

// Componente separato per l'environment
function EnvironmentWrapper() {
  return (
    <Suspense fallback={null}>
      <Environment preset="sunset" />
    </Suspense>
  )
}

export function Scene3D() {
  const roomRef = useRef<Group>(null)
  useFirstPersonControls() // Ora ritorna i controlli ma non li memorizziamo

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

      <EnvironmentWrapper />
    </>
  )
}