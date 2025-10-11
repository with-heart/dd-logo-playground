import type { ReactNode } from 'react'
import { useState } from 'react'
import type { ColorPalette } from './constants'
import { COLOR_PALETTES } from './constants'
import { PaletteContext } from './palette-context-definition'

interface PaletteProviderProps {
  children: ReactNode
}

export const PaletteProvider = ({ children }: PaletteProviderProps) => {
  const [activePalette, setActivePalette] = useState<ColorPalette>(
    COLOR_PALETTES[0],
  )
  const [strokeWidth, setStrokeWidth] = useState<number>(0.05)

  return (
    <PaletteContext.Provider
      value={{
        activePalette,
        setActivePalette,
        availablePalettes: COLOR_PALETTES,
        strokeWidth,
        setStrokeWidth,
      }}
    >
      {children}
    </PaletteContext.Provider>
  )
}
