import type { ComponentProps } from 'react'
import { GRID_HEX_BASE_RADIUS, GRID_TRIANGLE_BASE_SIDE } from '@/constants'
import { mulberry32 } from '@/math'
import type { SettingsProperties } from '@/use-settings'
import { LogoBase } from './base'
import { generateOklchColors } from './colors/generate-colors'
import { oklchToRgb } from './colors/oklch-to-rgb'
import { deriveStrokeRgb } from './colors/stroke-utils'
import { buildHexGrid } from './geometry/build-hex-grid'
import { buildTriangleGrid } from './geometry/build-triangle-grid'
import { buildVoronoiGrid } from './geometry/build-voronoi'
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
  const geometry =
    pattern === 'triangle'
      ? buildTriangleGrid({
          triangleSide: GRID_TRIANGLE_BASE_SIDE * cellSize,
        })
      : pattern === 'voronoi'
        ? buildVoronoiGrid({ cellSize, seed })
        : buildHexGrid({
            hexRadius: GRID_HEX_BASE_RADIUS * cellSize,
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
