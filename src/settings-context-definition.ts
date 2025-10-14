import { createContext } from 'react'

export interface SettingsContextType {
  // Pattern selection
  pattern: 'hexagon'
  setPattern: (pattern: 'hexagon') => void
  strokeWidth: number
  setStrokeWidth: (width: number) => void
  verticalHexagons: boolean
  setVerticalHexagons: (vertical: boolean) => void
  regenerateImage: () => void
  regenNonce: number
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
)
