import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { LoadingScreen } from './components/LoadingScreen'
import { Scene3D } from './scenes/Scene3D'

export default function App() {
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="fullscreen">
        <Canvas
          shadows
          camera={{
            position: [0, 1.7, 0],
            fov: 75
          }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#f0f0f0']} />
          <fog attach="fog" args={['#f0f0f0', 0, 20]} />
          
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>
      
      {showControls && (
        <div className={`controls-hint ${!showControls ? 'fade-out' : ''}`}>
          Click per attivare i controlli<br />
          WASD/Frecce per muoversi | Mouse per guardare | Spazio per saltare
        </div>
      )}
      
      <LoadingScreen />
    </>
  )
}