import { createContext } from 'react'
import type { ColorPalette } from './constants'

export interface PaletteContextType {
  activePalette: ColorPalette
  setActivePalette: (palette: ColorPalette) => void
  availablePalettes: ColorPalette[]
  strokeWidth: number
  setStrokeWidth: (width: number) => void
  // OKLCH custom palette controls
  oklchLightness: number
  setOklchLightness: (lightness: number) => void
  oklchChroma: number
  setOklchChroma: (chroma: number) => void
  regenerateOklchPalette: () => void
  // General palette regeneration
  regenerateActivePalette: () => void
}

export const PaletteContext = createContext<PaletteContextType | undefined>(
  undefined,
)
