import { createContext } from 'react'

export interface SettingsContextType {
  // Pattern selection
  pattern: 'hexagon'
  setPattern: (pattern: 'hexagon') => void
  strokeWidth: number
  setStrokeWidth: (width: number) => void
  verticalHexagons: boolean
  setVerticalHexagons: (vertical: boolean) => void
  lightness: number
  setLightness: (lightness: number) => void
  chroma: number
  setChroma: (chroma: number) => void
  lightnessVariance: number
  setLightnessVariance: (variance: number) => void
  chromaVariance: number
  setChromaVariance: (variance: number) => void
  regenerateImage: () => void
  randomizeColors: () => void
  regenNonce: number
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
)
