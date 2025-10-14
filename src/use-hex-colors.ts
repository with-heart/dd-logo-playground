import { useMemo } from 'react'
import { useColorValues } from './colors.machine'
import { generateOklchColors } from './colors/generate-colors'
import { mulberry32 } from './math'
import { useSettings } from './use-settings'

export const useHexColors = (count: number) => {
  const { regenNonce } = useSettings()
  const { chroma, chromaVariance, lightness, lightnessVariance } =
    useColorValues()

  return useMemo(() => {
    // Seeded RNG so regenNonce produces a distinct palette each trigger while
    // keeping dependency usage explicit for the linter.
    const rng = mulberry32(regenNonce || 1)
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
  }, [count, lightness, chroma, lightnessVariance, chromaVariance, regenNonce])
}
