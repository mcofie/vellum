import type { Ref } from 'vue'

interface SheetDragOptions {
  enabled: () => boolean
  onDismiss: () => void
}

const dismissDistance = 110
const dismissVelocity = 0.55 // px per ms

// Drag-down-to-dismiss for a bottom sheet. A drag only starts when the sheet is
// scrolled to the top and the finger moves mostly downward, so scrolling and taps
// inside the sheet behave normally.
export function useSheetDrag(sheet: Ref<HTMLElement | null>, { enabled, onDismiss }: SheetDragOptions) {
  let startX = 0
  let startY = 0
  let startTime = 0
  let offset = 0
  let candidate = false
  let dragging = false
  let passedThreshold = false

  function setOffset(value: number, animate: boolean) {
    const el = sheet.value
    if (!el) return
    el.style.transition = animate ? 'transform 260ms cubic-bezier(.32, .72, 0, 1)' : 'none'
    el.style.transform = value ? `translateY(${value}px)` : ''
  }

  function onTouchStart(event: TouchEvent) {
    const el = sheet.value
    candidate = Boolean(el && enabled() && el.scrollTop <= 0 && event.touches.length === 1)
    dragging = false
    passedThreshold = false
    offset = 0
    startX = event.touches[0]!.clientX
    startY = event.touches[0]!.clientY
    startTime = performance.now()
  }

  function onTouchMove(event: TouchEvent) {
    if (!candidate) return
    const dx = event.touches[0]!.clientX - startX
    const dy = event.touches[0]!.clientY - startY

    if (!dragging) {
      if (dy < -4 || Math.abs(dx) > Math.abs(dy)) {
        candidate = false
        return
      }
      if (dy < 8) return
      dragging = true
    }

    event.preventDefault()
    offset = Math.max(0, dy)
    setOffset(offset, false)

    if (!passedThreshold && offset > dismissDistance) {
      passedThreshold = true
      haptic('selection')
    } else if (passedThreshold && offset <= dismissDistance) {
      passedThreshold = false
    }
  }

  function onTouchEnd() {
    if (!dragging) return
    dragging = false
    candidate = false
    const el = sheet.value
    const velocity = offset / Math.max(1, performance.now() - startTime)

    if (el && (offset > dismissDistance || velocity > dismissVelocity)) {
      haptic('light')
      setOffset(el.offsetHeight, true)
      window.setTimeout(() => {
        onDismiss()
        setOffset(0, false)
      }, 240)
    } else {
      setOffset(0, true)
    }
  }

  onMounted(() => {
    const el = sheet.value
    if (!el) return
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchEnd)
  })

  onBeforeUnmount(() => {
    const el = sheet.value
    if (!el) return
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchmove', onTouchMove)
    el.removeEventListener('touchend', onTouchEnd)
    el.removeEventListener('touchcancel', onTouchEnd)
  })
}
