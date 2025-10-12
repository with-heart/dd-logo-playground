import type { ReactNode } from 'react'
import { useMemo, useState, useEffect } from 'react'
import type { ColorPalette } from './constants'
import { COLOR_PALETTES, generateOklchPalette } from './constants'
import { PaletteContext } from './palette-context-definition'

// LocalStorage keys for OKLCH values
const OKLCH_STORAGE_KEYS = {
  lightness: 'oklch-lightness',
  chroma: 'oklch-chroma',
  lightnessVariance: 'oklch-lightness-variance',
  chromaVariance: 'oklch-chroma-variance',
} as const

// Helper functions for localStorage
const getStoredNumber = (key: string, defaultValue: number): number => {
  try {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      const parsed = parseFloat(stored)
      return Number.isNaN(parsed) ? defaultValue : parsed
    }
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage:`, error)
  }
  return defaultValue
}

const setStoredNumber = (key: string, value: number): void => {
  try {
    localStorage.setItem(key, value.toString())
  } catch (error) {
    console.warn(`Failed to write ${key} to localStorage:`, error)
  }
}

interface PaletteProviderProps {
  children: ReactNode
}

export const PaletteProvider = ({ children }: PaletteProviderProps) => {
  const [activePalette, setActivePalette] = useState<ColorPalette>(
    COLOR_PALETTES[0],
  )
  const [strokeWidth, setStrokeWidth] = useState<number>(0.05)
  const [verticalHexagons, setVerticalHexagons] = useState<boolean>(false)

  // OKLCH palette state with base values + variance (loaded from localStorage)
  const [oklchLightness, setOklchLightness] = useState<number>(() =>
    getStoredNumber(OKLCH_STORAGE_KEYS.lightness, 0.7)
  )
  const [oklchChroma, setOklchChroma] = useState<number>(() =>
    getStoredNumber(OKLCH_STORAGE_KEYS.chroma, 0.15)
  )
  const [oklchLightnessVariance, setOklchLightnessVariance] = useState<number>(() =>
    getStoredNumber(OKLCH_STORAGE_KEYS.lightnessVariance, 0.1)
  )
  const [oklchChromaVariance, setOklchChromaVariance] = useState<number>(() =>
    getStoredNumber(OKLCH_STORAGE_KEYS.chromaVariance, 0.05)
  )
  const [oklchPaletteVersion, setOklchPaletteVersion] = useState<number>(0)

  // Persist OKLCH values to localStorage when they change
  useEffect(() => {
    setStoredNumber(OKLCH_STORAGE_KEYS.lightness, oklchLightness)
  }, [oklchLightness])

  useEffect(() => {
    setStoredNumber(OKLCH_STORAGE_KEYS.chroma, oklchChroma)
  }, [oklchChroma])

  useEffect(() => {
    setStoredNumber(OKLCH_STORAGE_KEYS.lightnessVariance, oklchLightnessVariance)
  }, [oklchLightnessVariance])

  useEffect(() => {
    setStoredNumber(OKLCH_STORAGE_KEYS.chromaVariance, oklchChromaVariance)
  }, [oklchChromaVariance])

  // Generate OKLCH custom palette
  const customOklchPalette: ColorPalette = useMemo(
    () => ({
      name: 'Custom OKLCH',
      colors: generateOklchPalette(
        oklchLightness,
        oklchChroma,
        oklchLightnessVariance,
        oklchChromaVariance,
        10,
      ),
      isCustom: true,
    }),
    [
      oklchLightness,
      oklchChroma,
      oklchLightnessVariance,
      oklchChromaVariance,
      oklchPaletteVersion,
    ],
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
        oklchLightnessVariance,
        setOklchLightnessVariance,
        oklchChromaVariance,
        setOklchChromaVariance,
        regenerateOklchPalette,
        regenerateActivePalette,
      }}
    >
      {children}
    </PaletteContext.Provider>
  )
}
