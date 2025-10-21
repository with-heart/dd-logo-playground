import type { ComponentProps } from 'react'
import { mulberry32 } from '@/math'
import type { SettingsProperties } from '@/use-settings'
import { LogoBase } from './base'
import { generateOklchColors } from './colors/generate-colors'
import { oklchToRgb } from './colors/oklch-to-rgb'
import { deriveStrokeRgb } from './colors/stroke-utils'
import { buildGrid } from './grids/build-grid'
import { Pattern } from './pattern'

export const Logo = ({
  settings: {
    chroma,
    chromaVariance,
    lightness,
    lightnessVariance,
    seed,
    verticalHexagons,
    strokeWidth,
    pattern,
    cellSize,
  },
  ...props
}: ComponentProps<'svg'> & {
  settings: SettingsProperties
}) => {
  const grid = buildGrid({
    cellSize,
    pattern,
    seed,
    verticalHexagons,
  })
  const rng = mulberry32(seed || 1)
  const colors = generateOklchColors(
    grid.length,
    {
      lightness,
      chroma,
      lightnessVariance,
      chromaVariance,
    },
    rng,
  )

  return (
    <LogoBase {...props}>
      {Pattern({
        grid,
        colors,
        strokeWidth: strokeWidth,
        toFill: (c) => oklchToRgb(c).fill,
        deriveStroke: (a, b) => deriveStrokeRgb(a, b),
      })}
    </LogoBase>
  )
}
