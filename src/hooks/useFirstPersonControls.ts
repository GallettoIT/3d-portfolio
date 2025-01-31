import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3, Euler } from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

const SPEED = 5
const JUMP_FORCE = 4
const GRAVITY = 9.81

export function useFirstPersonControls() {
  const { camera, gl } = useThree()
  const controls = useRef<PointerLockControls | null>(null)
  const moveForward = useRef(false)
  const moveBackward = useRef(false)
  const moveLeft = useRef(false)
  const moveRight = useRef(false)
  const canJump = useRef(true)
  const velocity = useRef(new Vector3())
  const direction = useRef(new Vector3())

  useEffect(() => {
    controls.current = new PointerLockControls(camera, gl.domElement)

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.current = true
          break
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.current = true
          break
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.current = true
          break
        case 'ArrowRight':
        case 'KeyD':
          moveRight.current = true
          break
        case 'Space':
          if (canJump.current) {
            velocity.current.y = JUMP_FORCE
            canJump.current = false
          }
          break
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.current = false
          break
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.current = false
          break
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.current = false
          break
        case 'ArrowRight':
        case 'KeyD':
          moveRight.current = false
          break
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)

    // Click handler per attivare i controlli
    const onClick = () => {
      controls.current?.lock()
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('click', onClick)
      controls.current?.dispose()
    }
  }, [camera, gl])

  useFrame((_, delta) => {
    if (controls.current?.isLocked) {
      // Applica la gravità
      velocity.current.y -= GRAVITY * delta

      // Aggiorna la direzione del movimento
      direction.current.z = Number(moveForward.current) - Number(moveBackward.current)
      direction.current.x = Number(moveRight.current) - Number(moveLeft.current)
      direction.current.normalize()

      // Applica il movimento
      if (moveForward.current || moveBackward.current) {
        velocity.current.z = -direction.current.z * SPEED
      }
      if (moveLeft.current || moveRight.current) {
        velocity.current.x = -direction.current.x * SPEED
      }

      // Muovi la camera
      controls.current.moveRight(-velocity.current.x * delta)
      controls.current.moveForward(-velocity.current.z * delta)

      // Aggiorna la posizione Y
      camera.position.y += velocity.current.y * delta

      // Collisione con il pavimento
      if (camera.position.y < 1.7) {
        velocity.current.y = 0
        camera.position.y = 1.7
        canJump.current = true
      }

      // Limiti della stanza
      const ROOM_SIZE = 1.9
      camera.position.x = Math.max(-ROOM_SIZE, Math.min(ROOM_SIZE, camera.position.x))
      camera.position.z = Math.max(-ROOM_SIZE, Math.min(ROOM_SIZE, camera.position.z))
    }
  })

  return controls
}