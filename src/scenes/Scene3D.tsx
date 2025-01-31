import { useRef } from 'react'
import { ContactShadows } from '@react-three/drei'
import { Group } from 'three'
import { Computer } from '../components/Computer/Computer'
import { RoomStructure } from '../components/Room/Base/RoomStructure'
import { CameraControls } from '../components/Controls/CameraControls'
import { ENVIRONMENT_CONFIG } from '../config/environment.config'

// Componente di debug per visualizzare le coordinate
function DebugAxes() {
  return (
    <group>
      <axesHelper args={[5]} />
      <gridHelper args={[10, 10]} />
    </group>
  )
}

export function Scene3D() {
  const roomRef = useRef<Group>(null)

  return (
    <>
      {/* Debug helpers */}
      {process.env.NODE_ENV === 'development' && <DebugAxes />}

      {/* Controlli camera */}
      <CameraControls />

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
      
      {/* Contenuto della scena */}
      <group ref={roomRef}>
        <RoomStructure />
        <Computer />
      </group>

      {/* Effetti */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.4}
        scale={12}
        blur={2}
        far={4}
        resolution={1024}
        color="#000000"
      />
    </>
  )
}