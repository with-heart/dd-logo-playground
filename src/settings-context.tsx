import type { ReactNode } from 'react'
import { useState } from 'react'
import { SettingsContext } from './settings-context-definition'

interface SettingsProviderProps {
  children: ReactNode
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [pattern, setPattern] = useState<'hexagon'>('hexagon')
  const [strokeWidth, setStrokeWidth] = useState<number>(0.05)
  const [verticalHexagons, setVerticalHexagons] = useState<boolean>(true)

  const [regenNonce, setRegenNonce] = useState<number>(0)

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
        regenerateImage,
        regenNonce,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
