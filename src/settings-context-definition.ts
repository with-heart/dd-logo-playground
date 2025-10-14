import { createContext } from 'react'

export interface SettingsContextType {
  // Pattern selection
  pattern: 'hexagon'
  setPattern: (pattern: 'hexagon') => void
  strokeWidth: number
  setStrokeWidth: (width: number) => void
  verticalHexagons: boolean
  setVerticalHexagons: (vertical: boolean) => void
  // Color values (OKLCH controls)
  lightness: number
  setLightness: (v: number) => void
  lightnessVariance: number
  setLightnessVariance: (v: number) => void
  chroma: number
  setChroma: (v: number) => void
  chromaVariance: number
  setChromaVariance: (v: number) => void
  randomizeColors: () => void
  seed: number
  setSeed: (s: number) => void
  regenerateImage: () => void
  regenNonce: number
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
)
