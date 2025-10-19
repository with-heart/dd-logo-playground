import { CIRCLE_CENTER_X, CIRCLE_CENTER_Y, CIRCLE_RADIUS } from '@/constants'
import { mulberry32 } from '@/math'
import type { SettingsProperties } from '@/use-settings'
import type { ComponentProps } from 'react'
import { LogoBase } from './base'
import { generateOklchColors } from './colors/generate-colors'
import { oklchToRgb } from './colors/oklch-to-rgb'
import { deriveStrokeRgb } from './colors/stroke-utils'
import { buildHexGrid } from './geometry/build-hex-grid'
import { HexagonPattern } from './patterns/hex'

export const Logo = ({
  settings: {
    chroma,
    chromaVariance,
    lightness,
    lightnessVariance,
    seed,
    verticalHexagons,
    strokeWidth,
  },
  ...props
}: ComponentProps<'svg'> & {
  settings: SettingsProperties
}) => {
  const geometry = buildHexGrid({
    centerX: CIRCLE_CENTER_X,
    centerY: CIRCLE_CENTER_Y,
    circleRadius: CIRCLE_RADIUS,
    hexRadius: 1.2,
    vertical: verticalHexagons,
  })
  const rng = mulberry32(seed || 1)
  const colors = generateOklchColors(
    geometry.cells.length,
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
      {HexagonPattern({
        geometry: geometry,
        colors: colors,
        strokeWidth: strokeWidth,
        toFill: (c) => oklchToRgb(c).fill,
        deriveStroke: (a, b) => deriveStrokeRgb(a, b),
      })}
    </LogoBase>
  )
}
