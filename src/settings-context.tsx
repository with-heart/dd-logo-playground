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
  const [pattern, setPattern] = useState<'hexagon'>('hexagon')
  const [strokeWidth, setStrokeWidth] = useState<number>(0.05)
  const [verticalHexagons, setVerticalHexagons] = useState<boolean>(true)

  // OKLCH color state with base values + variance (loaded from localStorage)
  const [lightness, setLightness] = useState<number>(() =>
    getStoredNumber(OKLCH_STORAGE_KEYS.lightness, 0.9),
  )
  const [chroma, setChroma] = useState<number>(() =>
    getStoredNumber(OKLCH_STORAGE_KEYS.chroma, 0.3),
  )
  const [lightnessVariance, setLightnessVariance] = useState<number>(() =>
    getStoredNumber(OKLCH_STORAGE_KEYS.lightnessVariance, 0.05),
  )
  const [chromaVariance, setChromaVariance] = useState<number>(() =>
    getStoredNumber(OKLCH_STORAGE_KEYS.chromaVariance, 0.05),
  )
  const [regenNonce, setRegenNonce] = useState<number>(0)

  useEffect(() => {
    setStoredNumber(OKLCH_STORAGE_KEYS.lightness, lightness)
  }, [lightness])

  useEffect(() => {
    setStoredNumber(OKLCH_STORAGE_KEYS.chroma, chroma)
  }, [chroma])

  useEffect(() => {
    setStoredNumber(OKLCH_STORAGE_KEYS.lightnessVariance, lightnessVariance)
  }, [lightnessVariance])

  useEffect(() => {
    setStoredNumber(OKLCH_STORAGE_KEYS.chromaVariance, chromaVariance)
  }, [chromaVariance])

  const regenerateImage = () => {
    setRegenNonce((prev) => prev + 1)
  }

  return (
    <SettingsContext.Provider
      value={{
        pattern,
        setPattern,
        strokeWidth,
        setStrokeWidth,
        verticalHexagons,
        setVerticalHexagons,
        lightness,
        setLightness,
        chroma,
        setChroma,
        lightnessVariance,
        setLightnessVariance,
        chromaVariance,
        setChromaVariance,
        regenerateImage,
        regenNonce,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
