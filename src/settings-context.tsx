import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { SettingsContext } from './settings-context-definition'

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

interface SettingsProviderProps {
  children: ReactNode
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [strokeWidth, setStrokeWidth] = useState<number>(0.05)
  const [verticalHexagons, setVerticalHexagons] = useState<boolean>(false)

  // OKLCH color state with base values + variance (loaded from localStorage)
  const [oklchLightness, setOklchLightness] = useState<number>(() =>
    getStoredNumber(OKLCH_STORAGE_KEYS.lightness, 0.7),
  )
  const [oklchChroma, setOklchChroma] = useState<number>(() =>
    getStoredNumber(OKLCH_STORAGE_KEYS.chroma, 0.15),
  )
  const [oklchLightnessVariance, setOklchLightnessVariance] = useState<number>(
    () => getStoredNumber(OKLCH_STORAGE_KEYS.lightnessVariance, 0.1),
  )
  const [oklchChromaVariance, setOklchChromaVariance] = useState<number>(() =>
    getStoredNumber(OKLCH_STORAGE_KEYS.chromaVariance, 0.05),
  )
  const [regenNonce, setRegenNonce] = useState<number>(0)

  // Persist OKLCH values to localStorage when they change
  useEffect(() => {
    setStoredNumber(OKLCH_STORAGE_KEYS.lightness, oklchLightness)
  }, [oklchLightness])

  useEffect(() => {
    setStoredNumber(OKLCH_STORAGE_KEYS.chroma, oklchChroma)
  }, [oklchChroma])

  useEffect(() => {
    setStoredNumber(
      OKLCH_STORAGE_KEYS.lightnessVariance,
      oklchLightnessVariance,
    )
  }, [oklchLightnessVariance])

  useEffect(() => {
    setStoredNumber(OKLCH_STORAGE_KEYS.chromaVariance, oklchChromaVariance)
  }, [oklchChromaVariance])

  const regenerateOklchPalette = () => {
    setRegenNonce((prev) => prev + 1)
  }

  return (
    <SettingsContext.Provider
      value={{
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
        regenNonce,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
