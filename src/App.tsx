import { Canvas } from '@react-three/fiber'
import { Room } from './scenes/Room'
import { Suspense, useState, useEffect } from 'react'
import { LoadingScreen } from './components/LoadingScreen'

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
        >
          <Suspense fallback={null}>
            <Room />
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