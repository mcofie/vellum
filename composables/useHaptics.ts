export type HapticPattern = 'selection' | 'light' | 'impact' | 'success' | 'error'

const vibrationPatterns: Record<HapticPattern, number | number[]> = {
  selection: 8,
  light: 6,
  impact: 14,
  success: [12, 70, 20],
  error: [24, 50, 24, 50, 24]
}

let iosSwitch: HTMLLabelElement | null = null

// iOS Safari has no Vibration API, but since iOS 18 toggling a native
// `<input type="checkbox" switch>` plays the system haptic. It only fires
// inside a user gesture and has a single strength, so every pattern is one tick.
function tickIosSwitch() {
  // Content outside an open modal dialog is inert, so the switch must live inside it.
  const host = document.querySelector('dialog[open]') ?? document.body
  if (!iosSwitch) {
    iosSwitch = document.createElement('label')
    iosSwitch.setAttribute('aria-hidden', 'true')
    iosSwitch.style.cssText = 'position:fixed;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;'
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.tabIndex = -1
    input.setAttribute('switch', '')
    iosSwitch.append(input)
  }
  if (iosSwitch.parentElement !== host) host.append(iosSwitch)
  iosSwitch.click()
}

export function haptic(pattern: HapticPattern = 'selection') {
  if (typeof window === 'undefined') return

  try {
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(vibrationPatterns[pattern])
    } else if (window.matchMedia('(pointer: coarse)').matches) {
      tickIosSwitch()
    }
  } catch {
    // Haptics are a nicety; never let them break an interaction.
  }
}

export function useHaptics() {
  return { haptic }
}
