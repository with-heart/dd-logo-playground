import { CIRCLE_CENTER_X, CIRCLE_CENTER_Y, CIRCLE_RADIUS } from '@/constants'
import { mulberry32 } from '@/math'
import type { SettingsProperties } from '@/use-settings'
import type { ComponentProps } from 'react'
import { LogoBase } from './base'
import { generateOklchColors } from './colors/generate-colors'
import { oklchToRgb } from './colors/oklch-to-rgb'
import { deriveStrokeRgb } from './colors/stroke-utils'
import { buildHexGrid } from './geometry/build-hex-grid'

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
      {geometry.cells.map((cell) => {
        const color = colors[cell.id]
        return (
          <g key={cell.id}>
            <path d={cell.path} fill={oklchToRgb(color).fill} />
            {cell.vertices.map((v, i) => {
              const next = cell.vertices[(i + 1) % 6]
              const nId = cell.neighbors[i]
              const stroke = deriveStrokeRgb(
                color,
                nId >= 0 ? colors[nId] : null,
              )
              return (
                <path
                  key={`${cell.id}-${i}`}
                  d={`M ${v[0]} ${v[1]} L ${next[0]} ${next[1]}`}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  fill="none"
                />
              )
            })}
          </g>
        )
      })}
    </LogoBase>
  )
}
