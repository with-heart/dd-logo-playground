import type { OklchColor } from './colors/generate-colors'
import type { Grid } from './grids/types'

export type PatternProps = {
  grid: Grid
  colors: OklchColor[]
  strokeWidth: number
  toFill: (c: OklchColor) => string
  deriveStroke: (a: OklchColor, b: OklchColor | null) => string
}

// Works both as a React component (<Pattern ... />) and as a function call
// Pattern({...}) which returns an array of elements, which is helpful for
// satori-based server rendering.
export const Pattern = ({
  grid,
  colors,
  strokeWidth,
  toFill,
  deriveStroke,
}: PatternProps) => {
  // First pass: fills
  const fills = grid.map((cell) => (
    <path
      key={`fill-${cell.id}`}
      d={cell.path}
      fill={toFill(colors[cell.id])}
    />
  ))

  // Second pass: strokes (deduplicated and rendered on top of all fills)
  const strokes = grid.flatMap((cell) => {
    const color = colors[cell.id]
    const vCount = cell.vertices.length
    return cell.vertices.map((v, i) => {
      const next = cell.vertices[(i + 1) % vCount]
      const nId = cell.neighbors[i]
      // Draw border edges, and draw interior edges only once from the lower id cell
      if (nId >= 0 && cell.id > nId) return null
      const stroke = deriveStroke(color, nId >= 0 ? colors[nId] : null)
      return (
        <path
          key={`edge-${cell.id}-${i}`}
          d={`M ${v[0]} ${v[1]} L ${next[0]} ${next[1]}`}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
        />
      )
    })
  })

  return [...fills, ...strokes]
}
