import { CIRCLE_CENTER_X, CIRCLE_CENTER_Y, CIRCLE_RADIUS } from '@/constants'
import type { Cell, Grid } from './types'

export interface HexCell extends Cell {
  row: number
  col: number
  cx: number
  cy: number
}

export type HexGrid = Grid<HexCell>

export interface BuildGridOptions {
  hexRadius: number
  vertical: boolean
}

export function buildHexGrid({
  hexRadius,
  vertical,
}: BuildGridOptions): HexGrid {
  // Spacing differs by orientation
  let horizontalSpacing: number
  let verticalSpacing: number

  if (vertical) {
    const hexWidth = hexRadius * Math.sqrt(3)
    const hexHeight = hexRadius * 2
    horizontalSpacing = hexWidth
    verticalSpacing = hexHeight * 0.75
  } else {
    const hexWidth = hexRadius * 2
    const hexHeight = hexRadius * Math.sqrt(3)
    horizontalSpacing = hexWidth * 0.75
    verticalSpacing = hexHeight
  }

  const gridRadius = CIRCLE_RADIUS + hexRadius
  const rows = Math.ceil((2 * gridRadius) / verticalSpacing)
  const cols = Math.ceil((2 * gridRadius) / horizontalSpacing)

  const map = new Map<string, HexCell>()
  let idCounter = 0

  const angleOffset = vertical ? Math.PI / 6 : 0

  for (let row = -rows; row <= rows; row++) {
    for (let col = -cols; col <= cols; col++) {
      let cx: number
      let cy: number
      if (vertical) {
        cx =
          CIRCLE_CENTER_X +
          col * horizontalSpacing +
          (row % 2) * (horizontalSpacing / 2)
        cy = CIRCLE_CENTER_Y + row * verticalSpacing
      } else {
        cx = CIRCLE_CENTER_X + col * horizontalSpacing
        cy =
          CIRCLE_CENTER_Y +
          row * verticalSpacing +
          (col % 2) * (verticalSpacing / 2)
      }

      const dist = Math.hypot(cx - CIRCLE_CENTER_X, cy - CIRCLE_CENTER_Y)
      if (dist > CIRCLE_RADIUS + hexRadius) continue

      const vertices: [number, number][] = []
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + angleOffset
        vertices.push([
          cx + hexRadius * Math.cos(angle),
          cy + hexRadius * Math.sin(angle),
        ])
      }
      const path =
        `M ${vertices[0][0]} ${vertices[0][1]} ` +
        vertices
          .slice(1)
          .map((v) => `L ${v[0]} ${v[1]}`)
          .join(' ') +
        ' Z'

      map.set(`${row},${col}`, {
        id: idCounter++,
        row,
        col,
        cx,
        cy,
        path,
        vertices,
        neighbors: new Array(6).fill(-1),
      })
    }
  }

  // Neighbor offsets (clockwise starting top-right for horizontal orientation logic adapts on vertical?)
  const getNeighborOffsets = (colIdx: number): Array<[number, number]> => {
    const isEvenCol = colIdx % 2 === 0
    return isEvenCol ?
        [
          [0, 1],
          [1, 1],
          [1, 0],
          [0, -1],
          [-1, 0],
          [-1, 1],
        ]
      : [
          [1, 0],
          [1, -1],
          [0, -1],
          [0, -2],
          [-1, -1],
          [-1, 0],
        ]
  }

  for (const cell of map.values()) {
    const offsets = getNeighborOffsets(cell.col)
    cell.neighbors = offsets.map(([dRow, dCol]) => {
      const key = `${cell.row + dRow},${cell.col + dCol}`
      const n = map.get(key)
      return n ? n.id : -1
    })
  }

  return Array.from(map.values())
}
