import {
  CIRCLE_CENTER_X,
  CIRCLE_CENTER_Y,
  CIRCLE_RADIUS,
  HEX_RADIUS,
  TRIANGLE_SIDE,
} from '@/constants'
import { mulberry32 } from '@/math'
import type { SettingsProperties } from '@/use-settings'
import type { ComponentProps } from 'react'
import { LogoBase } from './base'
import { generateOklchColors } from './colors/generate-colors'
import { oklchToRgb } from './colors/oklch-to-rgb'
import { deriveStrokeRgb } from './colors/stroke-utils'
import { buildHexGrid } from './geometry/build-hex-grid'
import { buildTriangleGrid } from './geometry/build-triangle-grid'
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
  },
  ...props
}: ComponentProps<'svg'> & {
  settings: SettingsProperties
}) => {
  const geometry =
    pattern === 'triangle' ?
      buildTriangleGrid({
        centerX: CIRCLE_CENTER_X,
        centerY: CIRCLE_CENTER_Y,
        circleRadius: CIRCLE_RADIUS,
        triangleSide: TRIANGLE_SIDE,
      })
    : buildHexGrid({
        centerX: CIRCLE_CENTER_X,
        centerY: CIRCLE_CENTER_Y,
        circleRadius: CIRCLE_RADIUS,
        hexRadius: HEX_RADIUS,
        vertical: verticalHexagons,
      })
  const rng = mulberry32(seed || 1)
  const colors = generateOklchColors(
    geometry.length,
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
        geometry,
        colors,
        strokeWidth: strokeWidth,
        toFill: (c) => oklchToRgb(c).fill,
        deriveStroke: (a, b) => deriveStrokeRgb(a, b),
      })}
    </LogoBase>
  )
}
