import { useMemo } from 'react'
import { mulberry32 } from '../math'
import { useSettings } from '../use-settings'
import { generateOklchColors } from './colors/generate-colors'

export const useHexColors = (count: number) => {
  const { chroma, chromaVariance, lightness, lightnessVariance, seed } =
    useSettings()

  return useMemo(() => {
    const rng = mulberry32(seed || 1)
    return generateOklchColors(
      count,
      {
        lightness,
        chroma,
        lightnessVariance,
        chromaVariance,
      },
      rng,
    )
  }, [count, lightness, chroma, lightnessVariance, chromaVariance, seed])
}
