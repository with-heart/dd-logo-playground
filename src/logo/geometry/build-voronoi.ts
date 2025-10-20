import { Delaunay } from 'd3-delaunay'
import {
  CIRCLE_CENTER_X,
  CIRCLE_CENTER_Y,
  CIRCLE_RADIUS,
  GRID_HEX_BASE_RADIUS,
} from '@/constants'
import { mulberry32 } from '@/math'
import type { Cell, Grid } from './types'

export interface VoronoiCell extends Cell {
  // site (seed) position for reference/debugging
  sx: number
  sy: number
}

export type VoronoiGrid = Grid<VoronoiCell>

export interface BuildVoronoiGridOptions {
  /** Linear scale factor matching other patterns' `cellSize` */
  cellSize: number
  /** Seed for deterministic point generation (ties to Regenerate) */
  seed: number
}

// ViewBox (SVG) bounds used to clip finite Voronoi cells
const VIEWBOX_WIDTH = 33
const VIEWBOX_HEIGHT = 34

// Compute target average cell area based on the hex default so sizes feel comparable
// For a regular hexagon, area = (3 * sqrt(3) / 2) * r^2 where r is the circumradius.
const HEX_AREA_AT_BASE = ((3 * Math.sqrt(3)) / 2) * GRID_HEX_BASE_RADIUS ** 2

// Utility to format numbers similar to other builders
const fmt = (n: number) => Number(n.toFixed(3))

// Sample a point uniformly inside the circle using seeded RNG
const samplePointInCircle = (rng: () => number): [number, number] => {
  const t = 2 * Math.PI * rng()
  const u = rng()
  const r = Math.sqrt(u) * CIRCLE_RADIUS
  const x = CIRCLE_CENTER_X + r * Math.cos(t)
  const y = CIRCLE_CENTER_Y + r * Math.sin(t)
  return [x, y]
}

export function buildVoronoiGrid({
  cellSize,
  seed,
}: BuildVoronoiGridOptions): VoronoiGrid {
  // Number of cells ~ circle area / target cell area, scale by 1 / cellSize^2
  const circleArea = Math.PI * CIRCLE_RADIUS ** 2
  const targetArea = HEX_AREA_AT_BASE * cellSize ** 2
  const pointCount = Math.max(6, Math.round(circleArea / targetArea))

  // Seeded point set so regenerate changes geometry
  const rng = mulberry32(seed || 1)
  const points: Array<[number, number]> = new Array(pointCount)
  for (let i = 0; i < pointCount; i++) points[i] = samplePointInCircle(rng)

  // Build Voronoi from points; clip to the SVG viewBox (circle is clipped later by <clipPath>)
  const delaunay = Delaunay.from(points)
  const voronoi = delaunay.voronoi([0, 0, VIEWBOX_WIDTH, VIEWBOX_HEIGHT])

  // Extract polygons; d3 returns Float64Array iterables per cell
  const polygons: [number, number][][] = []
  for (let i = 0; i < pointCount; i++) {
    const poly = voronoi.cellPolygon(i)
    if (!poly || poly.length < 3) {
      polygons[i] = []
      continue
    }
    // poly includes the first vertex repeated at the end; drop the last
    const verts: [number, number][] = []
    for (let j = 0; j < poly.length - 1; j++) {
      const [x, y] = poly[j] as [number, number]
      verts.push([fmt(x), fmt(y)])
    }
    polygons[i] = verts
  }

  // Build an edge -> cells map using RAW indices to recover neighbors per edge in order
  const keyPt = (x: number, y: number) => `${x.toFixed(6)},${y.toFixed(6)}`
  const keyEdge = (a: [number, number], b: [number, number]) => {
    const ka = keyPt(a[0], a[1])
    const kb = keyPt(b[0], b[1])
    return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`
  }
  const edgeToCells = new Map<string, number[]>()
  for (let i = 0; i < pointCount; i++) {
    const verts = polygons[i]
    if (!verts || verts.length < 3) continue
    for (let j = 0; j < verts.length; j++) {
      const a = verts[j]
      const b = verts[(j + 1) % verts.length]
      const k = keyEdge(a, b)
      const arr = edgeToCells.get(k)
      if (!arr) edgeToCells.set(k, [i])
      else arr.push(i)
    }
  }

  // Map raw site indices -> compact sequential ids
  const idMap = new Map<number, number>()
  let nextId = 0
  for (let i = 0; i < pointCount; i++) {
    const verts = polygons[i]
    if (!verts || verts.length < 3) continue
    idMap.set(i, nextId++)
  }

  const cells: VoronoiCell[] = []
  for (let i = 0; i < pointCount; i++) {
    const verts = polygons[i]
    if (!verts || verts.length < 3) continue
    const id = idMap.get(i)
    if (id == null) continue
  // Path: M x0 y0 L x1 y1 ...
  const [v0x, v0y] = verts[0]
  const rest = verts.slice(1).map((v) => `L ${v[0]} ${v[1]}`).join(' ')
  const path = `M ${v0x} ${v0y} ${rest} Z`
    // Neighbors aligned to each edge; translate raw neighbor ids via idMap
    const neighbors: number[] = []
    for (let j = 0; j < verts.length; j++) {
      const a = verts[j]
      const b = verts[(j + 1) % verts.length]
      const k = keyEdge(a, b)
      const arr = edgeToCells.get(k) || []
      const rawNeighbor = arr.find((cid) => cid !== i)
      const mapped = rawNeighbor != null ? (idMap.get(rawNeighbor) ?? -1) : -1
      neighbors.push(mapped)
    }
    const [sx, sy] = points[i]
    cells.push({
      id,
      path,
      vertices: verts,
      neighbors,
      sx: fmt(sx),
      sy: fmt(sy),
    })
  }

  return cells
}
