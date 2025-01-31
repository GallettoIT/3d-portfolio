import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'

export function CameraControls() {
  const { camera, gl } = useThree()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const speed = 0.1
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          camera.position.z -= speed
          break
        case 'KeyS':
        case 'ArrowDown':
          camera.position.z += speed
          break
        case 'KeyA':
        case 'ArrowLeft':
          camera.position.x -= speed
          break
        case 'KeyD':
        case 'ArrowRight':
          camera.position.x += speed
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [camera])

  return <PointerLockControls />
}