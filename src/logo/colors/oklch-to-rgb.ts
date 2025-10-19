import type { OklchColor } from './generate-colors'

export interface RgbColor {
  r: number
  g: number
  b: number
  fill: string // rgb(r,g b)
}

export function oklchToRgb({ l, c, h }: OklchColor): RgbColor {
  const hr = (h * Math.PI) / 180

  // OKLCH → OKLab
  const a = c * Math.cos(hr)
  const b = c * Math.sin(hr)

  // OKLab → linear RGB
  const L = l
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l3 = l_ ** 3
  const m3 = m_ ** 3
  const s3 = s_ ** 3

  const rLinear = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
  const gLinear = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
  const bLinear = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3

  // sign-preserving linear RGB → sRGB
  const toSrgb = (x: number) => {
    const ax = Math.abs(x)
    if (ax <= 0.0031308) return 12.92 * x
    return Math.sign(x) * (1.055 * Math.pow(ax, 1 / 2.4) - 0.055)
  }

  const clamp = (x: number) => Math.min(Math.max(x, 0), 1)

  const r = clamp(toSrgb(rLinear))
  const g = clamp(toSrgb(gLinear))
  const b_ = clamp(toSrgb(bLinear))

  return {
    r,
    g,
    b: b_,
    fill: `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b_ * 255)})`,
  }
}
