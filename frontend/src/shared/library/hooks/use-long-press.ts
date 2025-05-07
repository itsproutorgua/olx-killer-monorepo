import { useCallback, useRef, useState } from 'react'

const LONG_PRESS_DURATION = 500

export function useLongPressContextMenu() {
  const [isPressing, setIsPressing] = useState(false)
  const timerRef = useRef<number | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLElement>) => {
    const touch = e.touches[0]
    const x = Math.min(touch.clientX, window.innerWidth - 160)
    const y = Math.min(touch.clientY, window.innerHeight - 100)

    timerRef.current = window.setTimeout(() => {
      e.currentTarget.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
        }),
      )
      setIsPressing(true)
    }, LONG_PRESS_DURATION)
  }, [])

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      setIsPressing(false)
    }
  }, [])

  return {
    isPressing,
    bind: {
      onTouchStart,
      onTouchEnd: clear,
      onTouchMove: clear,
    },
  }
}
