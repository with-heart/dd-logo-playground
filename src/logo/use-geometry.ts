import { useMemo } from 'react'
import {
  CIRCLE_CENTER_X,
  CIRCLE_CENTER_Y,
  CIRCLE_RADIUS,
  HEX_RADIUS,
  TRIANGLE_SIDE,
} from '../constants'
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
          centerX: CIRCLE_CENTER_X,
          centerY: CIRCLE_CENTER_Y,
          circleRadius: CIRCLE_RADIUS,
          triangleSide: TRIANGLE_SIDE,
        }),
      }
    }

    return {
      kind: 'hexagon',
      grid: buildHexGrid({
        centerX: CIRCLE_CENTER_X,
        centerY: CIRCLE_CENTER_Y,
        circleRadius: CIRCLE_RADIUS,
        hexRadius: HEX_RADIUS,
        vertical: verticalHexagons,
      }),
    }
  }, [pattern, verticalHexagons])
}
