import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const GRAVITY = 9.81
const TERMINAL_VELOCITY = 20

export function usePhysics(camera: THREE.Camera) {
  const velocity = useRef(new THREE.Vector3())
  const isGrounded = useRef(true)

  useFrame((_, delta) => {
    // Applica gravità
    if (!isGrounded.current) {
      velocity.current.y -= GRAVITY * delta
      // Limita la velocità di caduta
      velocity.current.y = Math.max(velocity.current.y, -TERMINAL_VELOCITY)
    }

    // Aggiorna la posizione
    camera.position.add(velocity.current.multiplyScalar(delta))

    // Controlla collisione con il terreno
    if (camera.position.y < 1.7) {
      camera.position.y = 1.7
      velocity.current.y = 0
      isGrounded.current = true
    }
  })

  const jump = () => {
    if (isGrounded.current) {
      velocity.current.y = 5
      isGrounded.current = false
    }
  }

  return { jump, isGrounded: isGrounded.current }
}