import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3, Euler } from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

const SPEED = 2.5
const JUMP_FORCE = 3
const GRAVITY = 9.81
const CAMERA_HEIGHT = 1.7

export function useFirstPersonControls() {
  const { camera, gl } = useThree()
  const controlsRef = useRef<PointerLockControls | null>(null)
  const moveForward = useRef(false)
  const moveBackward = useRef(false)
  const moveLeft = useRef(false)
  const moveRight = useRef(false)
  const canJump = useRef(true)
  const velocity = useRef(new Vector3())

  useEffect(() => {
    if (!camera || !gl) return

    // Inizializza i controlli
    controlsRef.current = new PointerLockControls(camera, gl.domElement)

    const onKeyDown = (event: KeyboardEvent) => {
      if (!controlsRef.current?.isLocked) return

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

    const onClick = () => {
      if (controlsRef.current && !controlsRef.current.isLocked) {
        controlsRef.current.lock()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('click', onClick)
      controlsRef.current?.dispose()
    }
  }, [camera, gl])

  useFrame((_, delta) => {
    if (!controlsRef.current?.isLocked) return

    velocity.current.y -= GRAVITY * delta

    const direction = new Vector3()

    if (moveForward.current) direction.z -= 1
    if (moveBackward.current) direction.z += 1
    if (moveLeft.current) direction.x -= 1
    if (moveRight.current) direction.x += 1

    if (direction.length() > 0) {
      direction.normalize()
      camera.position.addScaledVector(direction.applyEuler(camera.rotation), SPEED * delta)
    }

    camera.position.y += velocity.current.y * delta

    if (camera.position.y < CAMERA_HEIGHT) {
      velocity.current.y = 0
      camera.position.y = CAMERA_HEIGHT
      canJump.current = true
    }
  })

  return controlsRef.current
}