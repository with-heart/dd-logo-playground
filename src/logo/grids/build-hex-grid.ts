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
      const fmt = (n: number) => Number(n.toFixed(3))
      const path =
        `M ${fmt(vertices[0][0])} ${fmt(vertices[0][1])} ` +
        vertices
          .slice(1)
          .map((v) => `L ${fmt(v[0])} ${fmt(v[1])}`)
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

  // Build neighbors by matching shared edges (robust for both orientations)
  const keyPt = (x: number, y: number) => `${x.toFixed(6)},${y.toFixed(6)}`
  const keyEdge = (a: [number, number], b: [number, number]) => {
    const ka = keyPt(a[0], a[1])
    const kb = keyPt(b[0], b[1])
    return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`
  }

  const cells = Array.from(map.values())
  const edgeToCells = new Map<string, number[]>()
  cells.forEach((cell) => {
    const v = cell.vertices
    const edges: Array<[[number, number], [number, number]]> = [
      [v[0], v[1]],
      [v[1], v[2]],
      [v[2], v[3]],
      [v[3], v[4]],
      [v[4], v[5]],
      [v[5], v[0]],
    ]
    edges.forEach((e) => {
      const k = keyEdge(e[0], e[1])
      const arr = edgeToCells.get(k)
      if (!arr) edgeToCells.set(k, [cell.id])
      else arr.push(cell.id)
    })
  })

  cells.forEach((cell) => {
    const v = cell.vertices
    const edges: Array<[[number, number], [number, number]]> = [
      [v[0], v[1]],
      [v[1], v[2]],
      [v[2], v[3]],
      [v[3], v[4]],
      [v[4], v[5]],
      [v[5], v[0]],
    ]
    cell.neighbors = edges.map((e) => {
      const k = keyEdge(e[0], e[1])
      const arr = edgeToCells.get(k) || []
      const neighborId = arr.find((cid) => cid !== cell.id)
      return neighborId != null ? neighborId : -1
    })
  })

  return cells
}
