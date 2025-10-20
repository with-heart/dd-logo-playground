import type { OklchColor } from './colors/generate-colors'

type Cell = {
  id: number
  path: string
  vertices: [number, number][]
  neighbors: number[]
}

type AnyGrid = {
  cells: Cell[]
}

export type PatternProps = {
  geometry: AnyGrid
  colors: OklchColor[]
  strokeWidth: number
  toFill: (c: OklchColor) => string
  deriveStroke: (a: OklchColor, b: OklchColor | null) => string
}

// Works both as a React component (<Pattern ... />) and as a function call
// Pattern({...}) which returns an array of elements, which is helpful for
// satori-based server rendering.
export const Pattern = ({
  geometry,
  colors,
  strokeWidth,
  toFill,
  deriveStroke,
}: PatternProps) => {
  return geometry.cells.map((cell) => {
    const color = colors[cell.id]
    const vCount = cell.vertices.length
    return (
      <g key={cell.id}>
        <path d={cell.path} fill={toFill(color)} />
        {cell.vertices.map((v, i) => {
          const next = cell.vertices[(i + 1) % vCount]
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
