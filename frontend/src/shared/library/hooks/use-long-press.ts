import React, { useCallback, useRef, useState } from 'react'

const LONG_PRESS_DURATION = 500

export function useLongPressContextMenu<T>() {
  const [isPressing, setIsPressing] = useState(false)
  const [contextMenuData, setContextMenuData] = useState<{
    message: T | null
    x: number
    y: number
  }>({ message: null, x: 0, y: 0 })
  const timerRef = useRef<number | null>(null)

  const onTouchStart = useCallback(
    (e: React.TouchEvent<HTMLElement>, message: T) => {
      e.stopPropagation()
      const touch = e.touches[0]
      const x = Math.min(touch.clientX, window.innerWidth - 160)
      const y = Math.min(touch.clientY, window.innerHeight - 100)

      timerRef.current = window.setTimeout(() => {
        setContextMenuData({ message, x, y })
        setIsPressing(true)
      }, LONG_PRESS_DURATION)
    },
    [],
  )

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      setIsPressing(false)
    }
  }, [])

  const closeMenu = useCallback(() => {
    setContextMenuData({ message: null, x: 0, y: 0 })
    setIsPressing(false)
  }, [])

  return {
    isPressing,
    contextMenuData,
    setContextMenuData, // Expose setter for external updates (e.g., right-click)
    bind: (message: T) => ({
      onTouchStart: (e: React.TouchEvent<HTMLElement>) =>
        onTouchStart(e, message),
      onTouchEnd: clear,
      onTouchMove: clear,
    }),
    closeMenu,
  }
}
