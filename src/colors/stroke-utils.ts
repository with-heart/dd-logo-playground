import type { OklchColor } from './generate-colors'

export function deriveStroke(
  a: OklchColor,
  b: OklchColor | null,
  blendRatio = 0.3,
  darken = 0.4,
): string {
  const l = a.l * (1 - blendRatio) + (b ? b.l : a.l) * blendRatio
  const c = a.c * (1 - blendRatio) + (b ? b.c : a.c) * blendRatio
  const h = a.h // keep base hue (could average circularly)
  const l2 = Math.max(0, l * (1 - darken))
  const c2 = c * (1 - darken * 0.5)
  return `oklch(${l2} ${c2} ${h})`
}
