import { useState, useCallback } from 'react'
import { Object3D } from 'three'

type InteractionState = {
  isInteracting: boolean
  activeObject: string | null
  hoveredObject: string | null
}

export const useInteraction = () => {
  const [state, setState] = useState<InteractionState>({
    isInteracting: false,
    activeObject: null,
    hoveredObject: null
  })

  const handleInteraction = useCallback((objectId: string) => {
    setState(prev => ({
      ...prev,
      isInteracting: true,
      activeObject: objectId
    }))
  }, [])

  const handleHover = useCallback((objectId: string | null) => {
    setState(prev => ({
      ...prev,
      hoveredObject: objectId
    }))
  }, [])

  const resetInteraction = useCallback(() => {
    setState({
      isInteracting: false,
      activeObject: null,
      hoveredObject: null
    })
  }, [])

  return {
    ...state,
    handleInteraction,
    handleHover,
    resetInteraction
  }
}