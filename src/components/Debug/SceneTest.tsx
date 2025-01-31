import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function SceneTest() {
  const { scene, camera } = useThree()
  const [debugInfo, setDebugInfo] = useState({
    fps: 0,
    drawCalls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0
  })

  useEffect(() => {
    // Aggiorna le info di debug ogni secondo
    const interval = setInterval(() => {
      const renderer = scene.renderer as THREE.WebGLRenderer
      if (renderer) {
        setDebugInfo({
          fps: Math.round(1000 / renderer.info.render.frame),
          drawCalls: renderer.info.render.calls,
          triangles: renderer.info.render.triangles,
          geometries: renderer.info.memory.geometries,
          textures: renderer.info.memory.textures
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [scene])

  // Mostra le info solo in development
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded font-mono text-sm">
      <div>FPS: {debugInfo.fps}</div>
      <div>Draw Calls: {debugInfo.drawCalls}</div>
      <div>Triangles: {debugInfo.triangles}</div>
      <div>Geometries: {debugInfo.geometries}</div>
      <div>Textures: {debugInfo.textures}</div>
      <div>Camera Pos: {JSON.stringify(camera.position.toArray().map(n => n.toFixed(2)))}</div>
    </div>
  )
}