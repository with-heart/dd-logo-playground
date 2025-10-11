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

  return (
    <PaletteContext.Provider
      value={{
        activePalette,
        setActivePalette,
        availablePalettes: COLOR_PALETTES,
      }}
    >
      {children}
    </PaletteContext.Provider>
  )
}
