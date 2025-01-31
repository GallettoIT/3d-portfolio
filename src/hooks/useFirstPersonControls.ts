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
  const { camera, gl } = useThree()
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
      if (controls.current && !controls.current.isLocked) {
        controls.current.lock()
      }
    }
    
    // Handler per quando i controlli vengono bloccati/sbloccati
    const onLockChange = () => {
      console.log('Lock changed:', controls.current?.isLocked)
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

  const lastFootstep = useRef(0)
  const headBobPhase = useRef(0)

  useFrame((state, delta) => {
    if (controls.current?.isLocked) {
      // Applica la gravità
      velocity.current.y -= GRAVITY * delta

      // Aggiorna la direzione del movimento
      direction.current.z = Number(moveForward.current) - Number(moveBackward.current)
      direction.current.x = Number(moveRight.current) - Number(moveLeft.current)
      direction.current.normalize()

      // Calcola la velocità effettiva
      const isMoving = moveForward.current || moveBackward.current || moveLeft.current || moveRight.current
      const currentSpeed = isMoving ? SPEED : 0

      // Applica il movimento con accelerazione/decelerazione
      velocity.current.x = THREE.MathUtils.lerp(
        velocity.current.x,
        -direction.current.x * currentSpeed,
        0.1
      )
      velocity.current.z = THREE.MathUtils.lerp(
        velocity.current.z,
        -direction.current.z * currentSpeed,
        0.1
      )

      // Muovi la camera
      controls.current.moveRight(-velocity.current.x * delta)
      controls.current.moveForward(-velocity.current.z * delta)

      // Aggiorna la posizione Y
      camera.position.y += velocity.current.y * delta

      // Head bobbing
      if (isMoving && canJump.current) {
        headBobPhase.current += delta * HEAD_BOB_SPEED
        const bobOffset = Math.sin(headBobPhase.current) * HEAD_BOB_INTENSITY
        camera.position.y = CAMERA_HEIGHT + bobOffset

        // Footstep sound timing
        if (state.clock.getElapsedTime() - lastFootstep.current > FOOTSTEP_INTERVAL) {
          // Qui potremmo aggiungere il suono dei passi
          lastFootstep.current = state.clock.getElapsedTime()
        }
      } else {
        // Reset head bob quando fermi
        headBobPhase.current = 0
        if (canJump.current) {
          camera.position.y = THREE.MathUtils.lerp(camera.position.y, CAMERA_HEIGHT, 0.1)
        }
      }

      // Collisione con il pavimento
      if (camera.position.y < CAMERA_HEIGHT) {
        velocity.current.y = 0
        camera.position.y = CAMERA_HEIGHT
        canJump.current = true
      }

      // Limiti della stanza con smussamento
      const ROOM_SIZE = 1.9
      const WALL_SMOOTHING = 0.1
      
      if (Math.abs(camera.position.x) > ROOM_SIZE - WALL_SMOOTHING) {
        camera.position.x = THREE.MathUtils.lerp(
          camera.position.x,
          Math.sign(camera.position.x) * (ROOM_SIZE - WALL_SMOOTHING),
          0.2
        )
      }
      
      if (Math.abs(camera.position.z) > ROOM_SIZE - WALL_SMOOTHING) {
        camera.position.z = THREE.MathUtils.lerp(
          camera.position.z,
          Math.sign(camera.position.z) * (ROOM_SIZE - WALL_SMOOTHING),
          0.2
        )
      }
    }
  })

  return controls
}