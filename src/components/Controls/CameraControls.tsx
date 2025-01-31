import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import { usePhysics } from '../../hooks/usePhysics'

export function CameraControls() {
  const { camera } = useThree()
  const [isLocked, setIsLocked] = useState(false)
  const { jump } = usePhysics(camera)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isLocked) return

      const speed = 0.1
      const forward = new THREE.Vector3()
      const right = new THREE.Vector3()

      // Ottieni la direzione in cui la camera sta guardando
      camera.getWorldDirection(forward)
      forward.y = 0 // Mantieni il movimento orizzontale
      forward.normalize()
      right.crossVectors(camera.up, forward).normalize()

      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          camera.position.addScaledVector(forward, speed)
          break
        case 'KeyS':
        case 'ArrowDown':
          camera.position.addScaledVector(forward, -speed)
          break
        case 'KeyA':
        case 'ArrowLeft':
          camera.position.addScaledVector(right, -speed)
          break
        case 'KeyD':
        case 'ArrowRight':
          camera.position.addScaledVector(right, speed)
          break
        case 'Space':
          jump()
          break
      }
    }

    const handleLockChange = () => {
      setIsLocked(document.pointerLockElement !== null)
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerlockchange', handleLockChange)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerlockchange', handleLockChange)
    }
  }, [camera, isLocked, jump])

  return (
    <PointerLockControls 
      onLock={() => setIsLocked(true)}
      onUnlock={() => setIsLocked(false)}
    />
  )
}