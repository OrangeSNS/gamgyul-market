import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  images: string[]
  className?: string
  /** 이미지 비율 유지용: 예) "aspect-[343/228]" or "aspect-video" */
  aspectClassName?: string
  /** dots 보여줄지 */
  showDots?: boolean
  /** 업로드 페이지에서만 쓰는 옵션: X 버튼(썸네일 삭제) */
  onRemove?: (index: number) => void
}

export default function ImageCarousel({
  images,
  className = '',
  aspectClassName = 'aspect-[343/228]',
  showDots = true,
  onRemove,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const count = images.length
  const canSlide = count > 1

  const snapPoints = useMemo(() => {
    // index -> left position
    return images.map((_, i) => i)
  }, [images])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const handleScroll = () => {
      const w = el.clientWidth || 1
      const next = Math.round(el.scrollLeft / w)
      setActive(Math.max(0, Math.min(next, count - 1)))
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => el.removeEventListener('scroll', handleScroll)
  }, [count])

  const goTo = (idx: number) => {
    const el = scrollerRef.current
    if (!el) return
    const w = el.clientWidth
    el.scrollTo({ left: w * idx, behavior: 'smooth' })
  }

  // 간단 드래그 스와이프(마우스/터치)
  const isDown = useRef(false)
  const startX = useRef(0)
  const startScroll = useRef(0)

  const onPointerDown = (e: React.PointerEvent) => {
    if (!canSlide) return
    const el = scrollerRef.current
    if (!el) return
    isDown.current = true
    startX.current = e.clientX
    startScroll.current = el.scrollLeft
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDown.current) return
    const el = scrollerRef.current
    if (!el) return
    const dx = e.clientX - startX.current
    el.scrollLeft = startScroll.current - dx
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDown.current) return
    isDown.current = false
    const el = scrollerRef.current
    if (!el) return
    const w = el.clientWidth || 1
    const next = Math.round(el.scrollLeft / w)
    goTo(Math.max(0, Math.min(next, count - 1)))
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  }

  if (count === 0) return null

  return (
    <div className={className}>
      <div
        className={[
          'relative overflow-hidden rounded-2xl bg-gray-100',
          aspectClassName,
        ].join(' ')}
      >
        <div
          ref={scrollerRef}
          className={[
            'h-full w-full flex overflow-x-auto',
            'snap-x snap-mandatory',
            'scrollbar-hide',
            canSlide ? 'cursor-grab active:cursor-grabbing' : '',
          ].join(' ')}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {images.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className="relative h-full w-full flex-none snap-center"
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />

              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  aria-label={`이미지 ${idx + 1} 삭제`}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/35 text-white"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* dots */}
        {showDots && count > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {snapPoints.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`이미지 ${i + 1}로 이동`}
                className={[
                  'h-2 w-2 rounded-full transition',
                  i === active ? 'bg-[#F28C45]' : 'bg-white/80',
                ].join(' ')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}