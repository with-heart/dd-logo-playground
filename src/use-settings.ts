import { useCallback, useMemo } from 'react'
import { clamp, rand, randomSeed } from './math'
import { useSearchParams } from './search-params'

export type Pattern = 'hexagon' | 'triangle' | 'voronoi'

export interface SettingsProperties {
  chroma: number
  chromaVariance: number
  lightness: number
  lightnessVariance: number
  pattern: Pattern
  seed: number
  strokeWidth: number
  verticalHexagons: boolean
  cellSize: number
}

export interface SettingsActions {
  randomizeChroma: () => void
  randomizeColors: () => void
  randomizeLightness: () => void
  regenerateImage: () => void
  setChroma: (chroma: number) => void
  setChromaVariance: (chromaVariance: number) => void
  setLightness: (lightness: number) => void
  setLightnessVariance: (lightnessVariance: number) => void
  setPattern: (pattern: Pattern) => void
  setSeed: (seed: number) => void
  setStrokeWidth: (strokeWidth: number) => void
  setVerticalHexagons: (verticalHexagons: boolean) => void
  setCellSize: (cellSize: number) => void
}

export type UrlSettings = SettingsProperties & SettingsActions

export const useSettings = (): UrlSettings => {
  const [query, setQuery] = useSearchParams()

  const chroma = clamp(query.chroma, 0, 0.45)
  const chromaVariance = clamp(query.chromaVariance, 0, 0.45)
  const lightness = clamp(query.lightness, 0, 1)
  const lightnessVariance = clamp(query.lightnessVariance, 0, 1)
  const strokeWidth = clamp(query.strokeWidth ?? 0.05, 0, 10)
  const cellSize = clamp(query.cellSize ?? 1, 0.25, 2)

  const randomizeChroma = useCallback(() => {
    setQuery({
      chroma: Number(rand(0, 0.4).toFixed(2)),
      chromaVariance: Number(rand(0, 0.4).toFixed(2)),
    })
  }, [setQuery])
  const randomizeLightness = useCallback(() => {
    setQuery({
      lightness: Number(rand(0, 1).toFixed(2)),
      lightnessVariance: Number(rand(0, 1).toFixed(2)),
    })
  }, [setQuery])

  const actions = useMemo<SettingsActions>(
    () => ({
      randomizeChroma,
      randomizeColors: () => {
        randomizeChroma()
        randomizeLightness()
      },
      randomizeLightness,
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
      setCellSize: (cellSize: number) =>
        setQuery({ cellSize }, { history: 'replace' }),
    }),
    [setQuery, randomizeChroma, randomizeLightness],
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
    cellSize,
    ...actions,
  }
}
