import { useMemo } from 'react'
import { GRID_HEX_BASE_RADIUS, GRID_TRIANGLE_BASE_SIDE } from '../constants'
import { useSettings } from '../use-settings'
import { buildHexGrid, type HexGrid } from './geometry/build-hex-grid'
import {
  buildTriangleGrid,
  type TriangleGrid,
} from './geometry/build-triangle-grid'

export type Geometry =
  | { kind: 'hexagon'; grid: HexGrid }
  | { kind: 'triangle'; grid: TriangleGrid }

export const useGeometry = () => {
  const { verticalHexagons, pattern } = useSettings()

  return useMemo<Geometry>(() => {
    if (pattern === 'triangle') {
      return {
        kind: 'triangle',
        grid: buildTriangleGrid({
          triangleSide: GRID_TRIANGLE_BASE_SIDE,
        }),
      }
    }

    return {
      kind: 'hexagon',
      grid: buildHexGrid({
        hexRadius: GRID_HEX_BASE_RADIUS,
        vertical: verticalHexagons,
      }),
    }
  }, [pattern, verticalHexagons])
}
