import {
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs'
import { useMemo } from 'react'
import { clamp, randomSeed } from './math'

export type Pattern = 'hexagon'

export interface UrlSettings {
  pattern: Pattern
  setPattern: (p: Pattern) => void
  strokeWidth: number
  setStrokeWidth: (v: number) => void
  verticalHexagons: boolean
  setVerticalHexagons: (v: boolean) => void

  lightness: number
  setLightness: (v: number) => void
  lightnessVariance: number
  setLightnessVariance: (v: number) => void
  chroma: number
  setChroma: (v: number) => void
  chromaVariance: number
  setChromaVariance: (v: number) => void

  seed: number
  setSeed: (s: number) => void

  randomizeColors: () => void
  regenerateImage: () => void
}

export const useUrlSettings = (): UrlSettings => {
  const [q, setQ] = useQueryStates(
    {
      pat: parseAsStringEnum(['hexagon'] as const).withDefault('hexagon'),
      sw: parseAsFloat.withDefault(0.05).withOptions({ history: 'replace' }),
      v: parseAsBoolean.withDefault(true),
      l: parseAsFloat.withDefault(0.9).withOptions({ history: 'replace' }),
      lv: parseAsFloat.withDefault(0.05).withOptions({ history: 'replace' }),
      c: parseAsFloat.withDefault(0.3).withOptions({ history: 'replace' }),
      cv: parseAsFloat.withDefault(0.05).withOptions({ history: 'replace' }),
      s: parseAsInteger
        .withDefault(randomSeed())
        .withOptions({ history: 'replace' }),
    },
    { shallow: false },
  )

  const pattern = (q.pat ?? 'hexagon') as Pattern
  const strokeWidth = clamp(q.sw ?? 0.05, 0, 10)
  const verticalHexagons = !!q.v
  const lightness = clamp(q.l ?? 0.9, 0, 1)
  const lightnessVariance = clamp(q.lv ?? 0.05, 0, 1)
  const chroma = clamp(q.c ?? 0.3, 0, 0.45)
  const chromaVariance = clamp(q.cv ?? 0.05, 0, 0.45)
  const seed = (q.s ?? randomSeed()) >>> 0

  const actions = useMemo(
    () => ({
      setPattern: (pat: Pattern) => setQ({ pat }),
      setStrokeWidth: (sw: number) => setQ({ sw }, { history: 'replace' }),
      setVerticalHexagons: (v: boolean) => setQ({ v }),

      setLightness: (l: number) => setQ({ l }, { history: 'replace' }),
      setLightnessVariance: (lv: number) =>
        setQ({ lv }, { history: 'replace' }),
      setChroma: (c: number) => setQ({ c }, { history: 'replace' }),
      setChromaVariance: (cv: number) => setQ({ cv }, { history: 'replace' }),

      setSeed: (s: number) => setQ({ s }),

      randomizeColors: () => {
        const rand = (min: number, max: number) =>
          Math.random() * (max - min) + min
        const l = clamp(rand(0.2, 0.95), 0, 1)
        const c = clamp(rand(0.02, 0.4), 0, 0.45)
        const lvMax = Math.min(0.3, l, 1 - l)
        const cvMax = Math.min(0.2, c, 0.45 - c)
        const lv = clamp(rand(0.01, Math.max(0.01, lvMax)), 0, lvMax)
        const cv = clamp(rand(0.01, Math.max(0.01, cvMax)), 0, cvMax)
        setQ(
          {
            l: Number(l.toFixed(2)),
            c: Number(c.toFixed(2)),
            lv: Number(lv.toFixed(2)),
            cv: Number(cv.toFixed(2)),
            s: randomSeed(),
          },
          { history: 'push' },
        )
      },

      regenerateImage: () => setQ({ s: randomSeed() }, { history: 'push' }),
    }),
    [setQ],
  )

  return {
    pattern,
    setPattern: actions.setPattern,
    strokeWidth,
    setStrokeWidth: actions.setStrokeWidth,
    verticalHexagons,
    setVerticalHexagons: actions.setVerticalHexagons,

    lightness,
    setLightness: actions.setLightness,
    lightnessVariance,
    setLightnessVariance: actions.setLightnessVariance,
    chroma,
    setChroma: actions.setChroma,
    chromaVariance,
    setChromaVariance: actions.setChromaVariance,

    seed,
    setSeed: actions.setSeed,

    randomizeColors: actions.randomizeColors,
    regenerateImage: actions.regenerateImage,
  }
}
