import { useMemo } from 'react'
import { clamp, rand, randomSeed } from './math'
import { useSearchParams } from './search-params'

export type Pattern = 'hexagon'

export interface SettingsProperties {
  chroma: number
  chromaVariance: number
  lightness: number
  lightnessVariance: number
  pattern: Pattern
  seed: number
  strokeWidth: number
  verticalHexagons: boolean
}

export interface SettingsActions {
  randomizeColors: () => void
  regenerateImage: () => void
  setChroma: (chroma: number) => void
  setChromaVariance: (chromaVariance: number) => void
  setLightness: (lightness: number) => void
  setLightnessVariance: (lightnessVariance: number) => void
  setPattern: (pattern: Pattern) => void
  setSeed: (seed: number) => void
  setStrokeWidth: (strokeWidth: number) => void
  setVerticalHexagons: (verticalHexagons: boolean) => void
}

export type UrlSettings = SettingsProperties & SettingsActions

export const useSettings = (): UrlSettings => {
  const [query, setQuery] = useSearchParams()

  const chroma = clamp(query.chroma, 0, 0.45)
  const chromaVariance = clamp(query.chromaVariance, 0, 0.45)
  const lightness = clamp(query.lightness, 0, 1)
  const lightnessVariance = clamp(query.lightnessVariance, 0, 1)
  const strokeWidth = clamp(query.strokeWidth ?? 0.05, 0, 10)

  const actions = useMemo<SettingsActions>(
    () => ({
      randomizeColors: () => {
        const l = rand(0, 1)
        const c = rand(0, 0.4)
        const lvMax = Math.min(0.3, l, 1 - l)
        const cvMax = Math.min(0.2, c, 0.45 - c)
        const lv = clamp(rand(0.01, Math.max(0.01, lvMax)), 0, lvMax)
        const cv = clamp(rand(0.01, Math.max(0.01, cvMax)), 0, cvMax)

        setQuery({
          chroma: Number(c.toFixed(2)),
          chromaVariance: Number(cv.toFixed(2)),
          lightness: Number(l.toFixed(2)),
          lightnessVariance: Number(lv.toFixed(2)),
          seed: randomSeed(),
        })
      },
      regenerateImage: () => setQuery({ seed: randomSeed() }),
      setChroma: (chroma: number) =>
        setQuery({ chroma }, { history: 'replace' }),
      setChromaVariance: (chromaVariance: number) =>
        setQuery({ chromaVariance }, { history: 'replace' }),
      setLightness: (lightness: number) =>
        setQuery({ lightness }, { history: 'replace' }),
      setLightnessVariance: (lightnessVariance: number) =>
        setQuery({ lightnessVariance }, { history: 'replace' }),
      setPattern: (pattern: Pattern) => setQuery({ pattern }),
      setSeed: (seed: number) => setQuery({ seed }),
      setStrokeWidth: (strokeWidth: number) =>
        setQuery({ strokeWidth }, { history: 'replace' }),
      setVerticalHexagons: (verticalHexagons: boolean) =>
        setQuery({ verticalHexagons }, { history: 'replace' }),
    }),
    [setQuery],
  )

  return {
    chroma,
    chromaVariance,
    lightness,
    lightnessVariance,
    pattern: query.pattern,
    // biome-ignore lint/style/noNonNullAssertion: undefined seed is caught at page level
    seed: query.seed!,
    strokeWidth,
    verticalHexagons: query.verticalHexagons,
    ...actions,
  }
}
