// Removed palette types and constants; colors are now generated via OKLCH only.

// OKLCH color utilities
export const oklchToHex = (l: number, c: number, h: number): string => {
  // Convert OKLCH to hex using CSS oklch() function and canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return '#000000'

  // Use oklch CSS color
  ctx.fillStyle = `oklch(${l} ${c} ${h})`
  const color = ctx.fillStyle

  // If the browser doesn't support oklch, fallback to a simple conversion
  if (color === `oklch(${l} ${c} ${h})`) {
    // Fallback: convert to approximate RGB
    const hRad = (h * Math.PI) / 180
    const a = c * Math.cos(hRad)
    const b = c * Math.sin(hRad)

    // Simplified LAB to RGB conversion (approximate)
    const y = (l + 16) / 116
    const x = a / 500 + y
    const z = y - b / 200

    const xyz = [x, y, z].map((t) => {
      const t3 = t * t * t
      return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787
    })

    // XYZ to RGB (sRGB D65)
    let [r, g, b_val] = [
      xyz[0] * 3.2406 - xyz[1] * 1.5372 - xyz[2] * 0.4986,
      -xyz[0] * 0.9689 + xyz[1] * 1.8758 + xyz[2] * 0.0415,
      xyz[0] * 0.0557 - xyz[1] * 0.204 + xyz[2] * 1.057,
    ]

    // Gamma correction
    const gamma = (t: number) =>
      t > 0.0031308 ? 1.055 * Math.pow(t, 1 / 2.4) - 0.055 : 12.92 * t
    r = gamma(r)
    g = gamma(g)
    b_val = gamma(b_val)

    // Clamp and convert to hex
    const toHex = (n: number) =>
      Math.max(0, Math.min(255, Math.round(n * 255)))
        .toString(16)
        .padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b_val)}`
  }

  return color
}

// Legacy OklchRange removed (unused)

export const generateOklchPalette = (
  baseLightness: number,
  baseChroma: number,
  lightnessVariance: number = 0,
  chromaVariance: number = 0,
  count: number = 10,
): string[] => {
  const colors: string[] = []
  const hueStep = 360 / count

  for (let i = 0; i < count; i++) {
    // Generate random values within the variance range around the base values
    // For lightness: base - variance to base + variance, clamped to valid range
    const lightness = Math.min(
      1,
      Math.max(
        0,
        baseLightness + (Math.random() - 0.5) * 2 * lightnessVariance,
      ),
    )
    // For chroma: base - variance to base + variance, clamped to valid range
    const chroma = Math.min(
      0.45,
      Math.max(0, baseChroma + (Math.random() - 0.5) * 2 * chromaVariance),
    )

    // Add some randomness to hue distribution while maintaining good spread
    const baseHue = i * hueStep
    const randomOffset = (Math.random() - 0.5) * 30 // ±15 degrees
    const hue = (baseHue + randomOffset + 360) % 360

    colors.push(oklchToHex(lightness, chroma, hue))
  }

  return colors
}

// All static palettes removed
