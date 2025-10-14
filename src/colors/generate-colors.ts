import { clamp } from '../math'
import type { ColorValues } from '../types'

export interface OklchColor {
  l: number
  c: number
  h: number
  fill: string // oklch(l c h)
}

export function generateOklchColors(
  count: number,
  base: ColorValues,
  rng: () => number = Math.random,
): OklchColor[] {
  const { lightness, chroma, lightnessVariance, chromaVariance } = base
  const arr: OklchColor[] = []
  for (let i = 0; i < count; i++) {
    const lRand = clamp(lightness + (rng() * 2 - 1) * lightnessVariance, 0, 1)
    const cRand = clamp(chroma + (rng() * 2 - 1) * chromaVariance, 0, 0.45)
    const h = rng() * 360
    arr.push({ l: lRand, c: cRand, h, fill: `oklch(${lRand} ${cRand} ${h})` })
  }
  return arr
}
