import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene3D } from './Scene3D'

export function Room() {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 1.7, 0],
        fov: 75
      }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      }}
      dpr={[1, 2]} // Responsive pixel ratio
    >
      <color attach="background" args={['#f0f0f0']} />
      <fog attach="fog" args={['#f0f0f0', 0, 20]} />
      
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>
    </Canvas>
  )
}