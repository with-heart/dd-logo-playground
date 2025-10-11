import { createContext } from 'react'
import type { ColorPalette } from './constants'

export interface PaletteContextType {
  activePalette: ColorPalette
  setActivePalette: (palette: ColorPalette) => void
  availablePalettes: ColorPalette[]
}

export const PaletteContext = createContext<PaletteContextType | undefined>(
  undefined,
)
