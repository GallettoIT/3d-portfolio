import { Canvas } from '@react-three/fiber'
import { Room } from './scenes/Room'
import { Suspense } from 'react'
import { LoadingScreen } from './components/LoadingScreen'

export default function App() {
  return (
    <div className="h-screen w-screen">
      <Canvas
        shadows
        camera={{
          position: [0, 2, 5],
          fov: 75
        }}
      >
        <Suspense fallback={null}>
          <Room />
        </Suspense>
      </Canvas>
      <LoadingScreen />
    </div>
  )
}