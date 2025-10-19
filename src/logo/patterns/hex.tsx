import type { ComponentProps } from 'react'
import type { OklchColor } from '../colors/generate-colors'
import type { HexGrid } from '../geometry/build-hex-grid'

export type HexagonPatternProps = {
  geometry: HexGrid
  colors: OklchColor[]
  strokeWidth: number
  toFill: (c: OklchColor) => string
  deriveStroke: (a: OklchColor, b: OklchColor | null) => string
} & ComponentProps<'g'>

export const HexagonPattern = ({
  geometry,
  colors,
  strokeWidth,
  toFill,
  deriveStroke,
}: HexagonPatternProps) => {
  return geometry.cells.map((cell) => {
    const color = colors[cell.id]
    return (
      <g key={cell.id}>
        <path d={cell.path} fill={toFill(color)} />
        {cell.vertices.map((v, i) => {
          const next = cell.vertices[(i + 1) % 6]
          const nId = cell.neighbors[i]
          const stroke = deriveStroke(color, nId >= 0 ? colors[nId] : null)
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
  })
}
