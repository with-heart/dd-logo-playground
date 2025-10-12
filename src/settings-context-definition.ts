import { createContext } from 'react'

export interface SettingsContextType {
  // Pattern selection
  pattern: 'hexagon'
  setPattern: (pattern: 'hexagon') => void
  strokeWidth: number
  setStrokeWidth: (width: number) => void
  // Hexagon orientation
  verticalHexagons: boolean
  setVerticalHexagons: (vertical: boolean) => void
  // OKLCH custom color controls with base values + variance
  oklchLightness: number
  setOklchLightness: (lightness: number) => void
  oklchChroma: number
  setOklchChroma: (chroma: number) => void
  oklchLightnessVariance: number
  setOklchLightnessVariance: (variance: number) => void
  oklchChromaVariance: number
  setOklchChromaVariance: (variance: number) => void
  regenerateOklchPalette: () => void
  regenNonce: number
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
)
