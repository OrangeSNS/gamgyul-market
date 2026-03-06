import { useState, useRef, useEffect } from 'react'

interface UseKeyboardHeightResult {
  keyboardOffset: number
  bottomBarH: number
  bottomBarRef: React.RefObject<HTMLDivElement>
}

export function useKeyboardHeight(): UseKeyboardHeightResult {
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const [keyboardOffset, setKeyboardOffset] = useState(0)
  const [bottomBarH, setBottomBarH] = useState(0)

  useEffect(() => {
    const measureBar = () => {
      setBottomBarH(bottomBarRef.current?.getBoundingClientRect().height ?? 0)
    }
    measureBar()

    const vv = window.visualViewport
    if (!vv) return

    const onViewportChange = () => {
      setKeyboardOffset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop))
      measureBar()
    }

    vv.addEventListener('resize', onViewportChange)
    vv.addEventListener('scroll', onViewportChange)
    window.addEventListener('resize', measureBar)

    onViewportChange()

    return () => {
      vv.removeEventListener('resize', onViewportChange)
      vv.removeEventListener('scroll', onViewportChange)
      window.removeEventListener('resize', measureBar)
    }
  }, [])

  return { keyboardOffset, bottomBarH, bottomBarRef }
}
