import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import type { ColorPalette } from './constants'
import { COLOR_PALETTES, generateOklchPalette } from './constants'
import { PaletteContext } from './palette-context-definition'

interface PaletteProviderProps {
  children: ReactNode
}

export const PaletteProvider = ({ children }: PaletteProviderProps) => {
  const [activePalette, setActivePalette] = useState<ColorPalette>(
    COLOR_PALETTES[0],
  )
  const [strokeWidth, setStrokeWidth] = useState<number>(0.05)
  const [verticalHexagons, setVerticalHexagons] = useState<boolean>(false)

  // OKLCH palette state
  const [oklchLightness, setOklchLightness] = useState<number>(0.7)
  const [oklchChroma, setOklchChroma] = useState<number>(0.15)
  const [oklchPaletteVersion, setOklchPaletteVersion] = useState<number>(0)

  // Generate OKLCH custom palette
  const customOklchPalette: ColorPalette = useMemo(
    () => ({
      name: 'Custom OKLCH',
      colors: generateOklchPalette(oklchLightness, oklchChroma, 10),
      isCustom: true,
    }),
    [oklchLightness, oklchChroma, oklchPaletteVersion], // eslint-disable-line react-hooks/exhaustive-deps
  )

  // All available palettes including custom OKLCH
  const allPalettes = useMemo(
    () => [...COLOR_PALETTES, customOklchPalette],
    [customOklchPalette],
  )

  const regenerateOklchPalette = () => {
    setOklchPaletteVersion((prev) => prev + 1)
  }

  const regenerateActivePalette = () => {
    if (activePalette.isCustom && activePalette.name === 'Custom OKLCH') {
      // For OKLCH palette, just regenerate the hues
      regenerateOklchPalette()
    } else {
      // For other palettes, create a new randomized version
      // We'll modify the palette colors by slightly shifting hues or randomizing order
      const newColors = [...activePalette.colors].sort(
        () => Math.random() - 0.5,
      )
      const shuffledPalette: ColorPalette = {
        ...activePalette,
        colors: newColors,
      }
      setActivePalette(shuffledPalette)
    }
  }

  // Update active palette if it's the custom OKLCH palette and parameters changed
  const effectiveActivePalette = useMemo(() => {
    if (activePalette.isCustom && activePalette.name === 'Custom OKLCH') {
      return customOklchPalette
    }
    return activePalette
  }, [activePalette, customOklchPalette])

  return (
    <PaletteContext.Provider
      value={{
        activePalette: effectiveActivePalette,
        setActivePalette,
        availablePalettes: allPalettes,
        strokeWidth,
        setStrokeWidth,
        verticalHexagons,
        setVerticalHexagons,
        oklchLightness,
        setOklchLightness,
        oklchChroma,
        setOklchChroma,
        regenerateOklchPalette,
        regenerateActivePalette,
      }}
    >
      {children}
    </PaletteContext.Provider>
  )
}
