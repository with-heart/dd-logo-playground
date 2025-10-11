export interface ColorPalette {
  name: string
  colors: string[]
  isCustom?: boolean
}

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

export const generateOklchPalette = (
  lightness: number,
  chroma: number,
  count: number = 10,
): string[] => {
  const colors: string[] = []
  const hueStep = 360 / count

  for (let i = 0; i < count; i++) {
    // Add some randomness to hue distribution while maintaining good spread
    const baseHue = i * hueStep
    const randomOffset = (Math.random() - 0.5) * 30 // ±15 degrees
    const hue = (baseHue + randomOffset + 360) % 360

    colors.push(oklchToHex(lightness, chroma, hue))
  }

  return colors
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: 'Vibrant',
    colors: [
      '#FF6B6B', // Red-pink
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#96CEB4', // Mint green
      '#FFEAA7', // Yellow
      '#DDA0DD', // Plum
      '#98D8C8', // Light teal
      '#F7DC6F', // Light yellow
      '#BB8FCE', // Light purple
      '#85C1E9', // Light blue
    ],
  },
  {
    name: 'Ocean',
    colors: [
      '#006994', // Deep blue
      '#13A8A8', // Teal
      '#36CFC9', // Cyan
      '#5CDBD3', // Light cyan
      '#87E8DE', // Lighter cyan
      '#B5F5EC', // Very light cyan
      '#0050B3', // Navy blue
      '#096DD9', // Blue
      '#40A9FF', // Light blue
      '#69C0FF', // Lighter blue
    ],
  },
  {
    name: 'Sunset',
    colors: [
      '#FF4D4F', // Red
      '#FF7A45', // Orange-red
      '#FFA940', // Orange
      '#FFD666', // Yellow-orange
      '#FADB14', // Yellow
      '#F759AB', // Pink
      '#AD4E00', // Brown
      '#D4380D', // Red-orange
      '#FA8C16', // Orange
      '#FAAD14', // Golden yellow
    ],
  },
  {
    name: 'Forest',
    colors: [
      '#135200', // Deep green
      '#389E0D', // Green
      '#52C41A', // Light green
      '#73D13D', // Lime green
      '#95DE64', // Light lime
      '#B7EB8F', // Very light green
      '#237804', // Forest green
      '#52C41A', // Bright green
      '#73D13D', // Spring green
      '#95DE64', // Pale green
    ],
  },
  {
    name: 'Purple Rain',
    colors: [
      '#391085', // Deep purple
      '#531DAB', // Purple
      '#722ED1', // Medium purple
      '#9254DE', // Light purple
      '#B37FEB', // Lighter purple
      '#D3ADF7', // Very light purple
      '#10239E', // Indigo
      '#1890FF', // Blue
      '#40A9FF', // Light blue
      '#69C0FF', // Pale blue
    ],
  },
  {
    name: 'Grayscale',
    colors: [
      '#000000', // Black
      '#262626', // Very dark gray
      '#434343', // Dark gray
      '#595959', // Medium gray
      '#8C8C8C', // Gray
      '#BFBFBF', // Light gray
      '#D9D9D9', // Very light gray
      '#F0F0F0', // Off white
      '#FAFAFA', // Almost white
      '#FFFFFF', // White
    ],
  },
]

// Default palette for backward compatibility
export const COLORS = COLOR_PALETTES[0].colors
