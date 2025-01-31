import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'

export function LoadingScreen() {
  const { progress, loaded, total } = useProgress()
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setShow(false)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [progress])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4 text-2xl font-bold text-white">
          Loading... {Math.round(progress)}%
        </div>
        <div className="text-sm text-gray-400">
          {loaded} / {total} assets loaded
        </div>
        <div className="mt-4 h-1 w-48 bg-gray-700">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}