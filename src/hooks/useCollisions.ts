import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const WALL_DISTANCE = 0.3 // Distanza minima dalle pareti
const ROOM_SIZE = {
  width: 8,
  height: 3,
  depth: 12
}

export function useCollisions(camera: THREE.Camera) {
  useFrame(() => {
    // Limiti della stanza
    const halfWidth = ROOM_SIZE.width / 2 - WALL_DISTANCE
    const halfDepth = ROOM_SIZE.depth / 2 - WALL_DISTANCE

    // Collisioni con le pareti
    camera.position.x = Math.max(-halfWidth, Math.min(halfWidth, camera.position.x))
    camera.position.z = Math.max(-halfDepth, Math.min(halfDepth, camera.position.z))

    // Collisione con il pavimento e il soffitto
    camera.position.y = Math.max(1.7, Math.min(ROOM_SIZE.height - 0.3, camera.position.y))
  })
}