import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import {
  CHROMA_MAX,
  CHROMA_MIN,
  CHROMA_STEP,
  CHROMA_VARIANCE_MAX,
  CHROMA_VARIANCE_MIN,
  LIGHTNESS_MAX,
  LIGHTNESS_MIN,
  LIGHTNESS_STEP,
  LIGHTNESS_VARIANCE_MAX,
  LIGHTNESS_VARIANCE_MIN,
} from './constants'
import { clamp, rand, roundTo } from './math'
import { SettingsContext } from './settings-context-definition'

// LocalStorage keys for OKLCH values
const OKLCH_STORAGE_KEYS = {
  lightness: 'lightness',
  chroma: 'chroma',
  lightnessVariance: 'lightness-variance',
  chromaVariance: 'chroma-variance',
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

  const randomizeColors = () => {
    // Random base values within allowed ranges
    let L = rand(LIGHTNESS_MIN, LIGHTNESS_MAX)
    let C = rand(CHROMA_MIN, CHROMA_MAX)

    // Variance cannot exceed distance to bounds or configured max
    const lVarMax = Math.min(
      LIGHTNESS_VARIANCE_MAX,
      L - LIGHTNESS_MIN,
      LIGHTNESS_MAX - L,
    )
    const cVarMax = Math.min(
      CHROMA_VARIANCE_MAX,
      C - CHROMA_MIN,
      CHROMA_MAX - C,
    )

    let lVar = rand(
      LIGHTNESS_VARIANCE_MIN,
      Math.max(LIGHTNESS_VARIANCE_MIN, lVarMax),
    )
    let cVar = rand(CHROMA_VARIANCE_MIN, Math.max(CHROMA_VARIANCE_MIN, cVarMax))

    // Align to slider steps and clamp just in case
    L = clamp(roundTo(L, LIGHTNESS_STEP), LIGHTNESS_MIN, LIGHTNESS_MAX)
    C = clamp(roundTo(C, CHROMA_STEP), CHROMA_MIN, CHROMA_MAX)
    lVar = clamp(roundTo(lVar, LIGHTNESS_STEP), LIGHTNESS_VARIANCE_MIN, lVarMax)
    cVar = clamp(roundTo(cVar, CHROMA_STEP), CHROMA_VARIANCE_MIN, cVarMax)

    setLightness(L)
    setChroma(C)
    setLightnessVariance(lVar)
    setChromaVariance(cVar)
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
        randomizeColors,
        regenNonce,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
