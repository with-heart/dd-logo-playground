export interface TriangleCell {
  id: number
  row: number
  col: number
  x: number // base midpoint x
  y: number // base midpoint y (for up: base y; for down: base y)
  up: boolean
  path: string
  vertices: [number, number][] // length 3, ordered [apex, left, right] for up; [apex(bottom), left, right] for down
  neighbors: number[] // length 3 in edge order: [edge 0-1 (left), edge 1-2 (base), edge 2-0 (right)]
}

export interface TriangleGrid {
  cells: TriangleCell[]
}

export interface BuildTriangleGridOptions {
  centerX: number
  centerY: number
  circleRadius: number
  triangleSide: number
}

// Build a grid of equilateral triangles using a half-step lattice so adjacent
// triangles share edges exactly. We index a grid with step dx = s/2, dy = h/2
// and alternate up/down with (row+col)%2.
export function buildTriangleGrid({
  centerX,
  centerY,
  circleRadius,
  triangleSide,
}: BuildTriangleGridOptions): TriangleGrid {
  const s = triangleSide
  const h = (Math.sqrt(3) / 2) * s

  // Basis vectors for triangular lattice parallelogram
  const ax = s
  const ay = 0
  const bx = s / 2
  const by = h

  // Conservative range so the circle is fully covered; add a small buffer
  const gridRadius = circleRadius + s
  const iMax = Math.ceil((2 * gridRadius) / s) + 1
  const jMax = Math.ceil((2 * gridRadius) / h) + 1

  const cells: TriangleCell[] = []

  const keyPt = (x: number, y: number) => `${x.toFixed(6)},${y.toFixed(6)}`
  const keyEdge = (a: [number, number], b: [number, number]) => {
    const ka = keyPt(a[0], a[1])
    const kb = keyPt(b[0], b[1])
    return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`
  }

  const pushTriangle = (verts: [number, number][]) => {
    // Do not clip by centroid here; rely on outer SVG clipPath.
    const cx = (verts[0][0] + verts[1][0] + verts[2][0]) / 3
    const cy = (verts[0][1] + verts[1][1] + verts[2][1]) / 3
    const up = verts[0][1] < (verts[1][1] + verts[2][1]) / 2
    const id = cells.length
    const path = `M ${verts[0][0]} ${verts[0][1]} L ${verts[1][0]} ${verts[1][1]} L ${verts[2][0]} ${verts[2][1]} Z`
    cells.push({
      id,
      row: 0,
      col: 0,
      x: cx,
      y: cy,
      up,
      path,
      vertices: verts,
      neighbors: [-1, -1, -1],
    })
  }

  // Generate triangles from parallelograms
  for (let j = -jMax; j <= jMax; j++) {
    for (let i = -iMax; i <= iMax; i++) {
      const p0x = centerX + i * ax + j * bx
      const p0y = centerY + i * ay + j * by
      const p1x = p0x + ax
      const p1y = p0y + ay
      const p2x = p0x + bx
      const p2y = p0y + by
      const p3x = p1x + bx
      const p3y = p1y + by

      // Up triangle (counter-clockwise)
      pushTriangle([
        [p0x, p0y],
        [p1x, p1y],
        [p2x, p2y],
      ])
      // Down triangle (counter-clockwise)
      pushTriangle([
        [p1x, p1y],
        [p3x, p3y],
        [p2x, p2y],
      ])
    }
  }

  // Build neighbors by matching shared edges
  const edgeToCells = new Map<string, number[]>()
  cells.forEach((cell) => {
    const v = cell.vertices
    const triEdges: Array<[[number, number], [number, number]]> = [
      [v[0], v[1]],
      [v[1], v[2]],
      [v[2], v[0]],
    ]
    triEdges.forEach((e) => {
      const k = keyEdge(e[0], e[1])
      const arr = edgeToCells.get(k)
      if (!arr) edgeToCells.set(k, [cell.id])
      else arr.push(cell.id)
    })
  })

  cells.forEach((cell) => {
    const v = cell.vertices
    const triEdges: Array<[[number, number], [number, number]]> = [
      [v[0], v[1]],
      [v[1], v[2]],
      [v[2], v[0]],
    ]
    cell.neighbors = triEdges.map((e) => {
      const k = keyEdge(e[0], e[1])
      const arr = edgeToCells.get(k) || []
      const neighborId = arr.find((cid) => cid !== cell.id)
      return neighborId != null ? neighborId : -1
    })
  })

  return { cells }
}
