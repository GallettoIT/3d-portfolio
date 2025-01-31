import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3, Euler } from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

const SPEED = 2.5
const JUMP_FORCE = 3
const GRAVITY = 9.81
const HEAD_BOB_SPEED = 12
const HEAD_BOB_INTENSITY = 0.015
const CAMERA_HEIGHT = 1.7
const FOOTSTEP_INTERVAL = 0.5

export function useFirstPersonControls() {
  const three = useThree()
  const { camera, gl } = three
  const controls = useRef<PointerLockControls | null>(null)
  const isLocked = useRef(false)
  const moveForward = useRef(false)
  const moveBackward = useRef(false)
  const moveLeft = useRef(false)
  const moveRight = useRef(false)
  const canJump = useRef(true)
  const velocity = useRef(new Vector3())
  const direction = useRef(new Vector3())

  useEffect(() => {
    if (!camera || !gl) return;  // Early return if Canvas context is not ready
    
    controls.current = new PointerLockControls(camera, gl.domElement)

    const onKeyDown = (event: KeyboardEvent) => {
      if (!controls.current?.isLocked) return;  // Don't process keys if controls aren't locked
      
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
      if (controls.current && !controls.current.isLocked) {
        controls.current.lock()
      }
    }
    
    // Handler per quando i controlli vengono bloccati/sbloccati
    const onLockChange = () => {
      isLocked.current = controls.current?.isLocked || false
    }

    document.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onLockChange)
    document.addEventListener('mozpointerlockchange', onLockChange)
    document.addEventListener('webkitpointerlockchange', onLockChange)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('click', onClick)
      document.removeEventListener('pointerlockchange', onLockChange)
      document.removeEventListener('mozpointerlockchange', onLockChange)
      document.removeEventListener('webkitpointerlockchange', onLockChange)
      controls.current?.dispose()
    }
  }, [camera, gl])

  useFrame((_, delta) => {
    if (!controls.current?.isLocked) return

    // Update velocity
    velocity.current.y -= GRAVITY * delta

    // Update direction
    direction.current.z = Number(moveForward.current) - Number(moveBackward.current)
    direction.current.x = Number(moveRight.current) - Number(moveLeft.current)
    direction.current.normalize()

    // Move the camera
    if (moveForward.current || moveBackward.current) {
      camera.translateZ(direction.current.z * SPEED * delta)
    }
    if (moveLeft.current || moveRight.current) {
      camera.translateX(direction.current.x * SPEED * delta)
    }

    // Apply gravity and jumping
    camera.position.y += velocity.current.y * delta

    // Ground check and collision
    if (camera.position.y < CAMERA_HEIGHT) {
      velocity.current.y = 0
      camera.position.y = CAMERA_HEIGHT
      canJump.current = true
    }
  })

  return {
    isLocked: isLocked.current,
    velocity: velocity.current,
    direction: direction.current
  }
}