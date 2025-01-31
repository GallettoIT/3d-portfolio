import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment, ContactShadows, OrbitControls } from '@react-three/drei'
import { Group } from 'three'
import { Computer } from '../components/Computer/Computer'

export function Room() {
  const roomRef = useRef<Group>(null)

  // Funzione per creare una parete
  const Wall = ({ position, rotation, size = [4, 3, 0.1] }: any) => (
    <mesh position={position} rotation={rotation} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>
  )

  // Funzione per creare il pavimento
  const Floor = () => (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[4, 4]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  )

  // Funzione per creare la scrivania
  const Desk = () => (
    <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
      <boxGeometry args={[1.5, 0.05, 0.8]} />
      <meshStandardMaterial color="#8b4513" />
      <mesh position={[0.65, -0.375, 0.35]} castShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[-0.65, -0.375, 0.35]} castShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0.65, -0.375, -0.35]} castShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[-0.65, -0.375, -0.35]} castShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    </mesh>
  )

  useFrame((state) => {
    if (!roomRef.current) return
    
    // Qui possiamo aggiungere animazioni ambientali
    const time = state.clock.getElapsedTime()
    // Esempio: leggera oscillazione della luce ambientale
    state.scene.traverse((object) => {
      if (object.type === 'AmbientLight') {
        object.intensity = 0.5 + Math.sin(time) * 0.05
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

      {/* Controlli della camera */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />

      {/* Struttura della stanza */}
      <Wall position={[0, 1.5, -2]} rotation={[0, 0, 0]} />
      <Wall position={[-2, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[2, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <Floor />

      {/* Mobili */}
      <Desk />
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