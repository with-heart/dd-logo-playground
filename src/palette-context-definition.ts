import { createContext } from 'react'

export interface PaletteContextType {
  strokeWidth: number
  setStrokeWidth: (width: number) => void
  // Hexagon orientation
  verticalHexagons: boolean
  setVerticalHexagons: (vertical: boolean) => void
  // OKLCH custom palette controls with base values + variance
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

export const PaletteContext = createContext<PaletteContextType | undefined>(
  undefined,
)
