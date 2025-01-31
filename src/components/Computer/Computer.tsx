import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { useInteraction } from '../../hooks/useInteraction'
import { useAnimation } from '../../hooks/useAnimation'

export function Computer() {
  const group = useRef<Group>(null)
  const [isOn, setIsOn] = useState(false)
  const { handleInteraction, isInteracting } = useInteraction()
  const { animate } = useAnimation()

  // Placeholder per il modello 3D del computer
  const computerGeometry = () => (
    <mesh
      castShadow
      receiveShadow
      position={[0, 0.5, 0]}
      onClick={() => {
        setIsOn(true)
        handleInteraction('computer')
        if (group.current) {
          animate(
            group.current,
            group.current.position.clone().setY(0.6),
            undefined,
            { duration: 500 }
          )
        }
      }}
    >
      <boxGeometry args={[1, 0.6, 0.05]} />
      <meshStandardMaterial color={isOn ? '#ffffff' : '#333333'} />
    </mesh>
  )

  // Base/Stand del computer
  const computerStand = () => (
    <mesh castShadow receiveShadow position={[0, 0.25, 0.1]}>
      <boxGeometry args={[0.1, 0.5, 0.1]} />
      <meshStandardMaterial color="#666666" />
    </mesh>
  )

  // Schermo del computer (quando acceso)
  const computerScreen = () => {
    if (!isOn) return null

    return (
      <mesh position={[0, 0.5, 0.026]}>
        <planeGeometry args={[0.9, 0.5]} />
        <meshBasicMaterial color="#000000" />
        {/* Qui andrà il contenuto del sistema operativo */}
      </mesh>
    )
  }

  useFrame((state) => {
    if (!group.current) return

    // Effetto hover
    const time = state.clock.getElapsedTime()
    if (!isInteracting) {
      group.current.position.y = 0.5 + Math.sin(time * 2) * 0.005
    }
  })

  return (
    <group ref={group}>
      {computerGeometry()}
      {computerStand()}
      {computerScreen()}
    </group>
  )
}