import type { ReactNode } from 'react'
import { useState } from 'react'
import { SettingsContext } from './settings-context-definition'
import { useUrlSettings } from './use-url-settings'

interface SettingsProviderProps {
  children: ReactNode
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  // Use URL as source of truth for settings
  const url = useUrlSettings()
  // Retain regenNonce for now to drive color regeneration in case other parts depend on it
  const [regenNonce, setRegenNonce] = useState<number>(0)
  const regenerateImage = () => {
    setRegenNonce((prev) => prev + 1)
    url.regenerateImage()
  }

  return (
    <SettingsContext.Provider
      value={{
        pattern: url.pattern,
        setPattern: url.setPattern,
        strokeWidth: url.strokeWidth,
        setStrokeWidth: url.setStrokeWidth,
        verticalHexagons: url.verticalHexagons,
        setVerticalHexagons: url.setVerticalHexagons,
        lightness: url.lightness,
        setLightness: url.setLightness,
        lightnessVariance: url.lightnessVariance,
        setLightnessVariance: url.setLightnessVariance,
        chroma: url.chroma,
        setChroma: url.setChroma,
        chromaVariance: url.chromaVariance,
        setChromaVariance: url.setChromaVariance,
        randomizeColors: url.randomizeColors,
        seed: url.seed,
        setSeed: url.setSeed,
        regenerateImage,
        regenNonce,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
