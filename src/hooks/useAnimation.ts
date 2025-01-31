import { useFrame } from '@react-three/fiber'
import { useRef, useCallback } from 'react'
import { Object3D, Vector3, Euler } from 'three'
import { MathUtils } from 'three'
const { lerp } = MathUtils

type AnimationConfig = {
  duration?: number
  easing?: (t: number) => number
}

export const useAnimation = () => {
  // Verifica che siamo all'interno di un contesto Canvas
  try {
    useFrame(() => {})
  } catch (e) {
    console.warn('useAnimation deve essere usato all'interno di un componente Canvas')
    return { animate: () => {} }
  }

  const animationRef = useRef<{
    target: Object3D | null
    startPos: Vector3 | null
    endPos: Vector3 | null
    startRot: Euler | null
    endRot: Euler | null
    startTime: number
    duration: number
    easing: (t: number) => number
    onComplete?: () => void
  }>({
    target: null,
    startPos: null,
    endPos: null,
    startRot: null,
    endRot: null,
    startTime: 0,
    duration: 1000,
    easing: t => t
  })

  const animate = useCallback((
    target: Object3D,
    endPos?: Vector3,
    endRot?: Euler,
    config: AnimationConfig = {}
  ) => {
    if (!target) return

    animationRef.current = {
      target,
      startPos: target.position.clone(),
      endPos: endPos?.clone() || target.position.clone(),
      startRot: target.rotation.clone(),
      endRot: endRot?.clone() || target.rotation.clone(),
      startTime: Date.now(),
      duration: config.duration || 1000,
      easing: config.easing || (t => t)
    }
  }, [])

  useFrame(() => {
    const anim = animationRef.current
    if (!anim.target || !anim.startPos || !anim.endPos) return

    const elapsed = Date.now() - anim.startTime
    const progress = Math.min(elapsed / anim.duration, 1)
    const easedProgress = anim.easing(progress)

    if (anim.startPos && anim.endPos) {
      anim.target.position.set(
        lerp(anim.startPos.x, anim.endPos.x, easedProgress),
        lerp(anim.startPos.y, anim.endPos.y, easedProgress),
        lerp(anim.startPos.z, anim.endPos.z, easedProgress)
      )
    }

    if (anim.startRot && anim.endRot) {
      anim.target.rotation.set(
        lerp(anim.startRot.x, anim.endRot.x, easedProgress),
        lerp(anim.startRot.y, anim.endRot.y, easedProgress),
        lerp(anim.startRot.z, anim.endRot.z, easedProgress)
      )
    }

    if (progress >= 1) {
      anim.onComplete?.()
      animationRef.current = {
        ...animationRef.current,
        target: null,
        startPos: null,
        endPos: null,
        startRot: null,
        endRot: null
      }
    }
  })

  return { animate }
}