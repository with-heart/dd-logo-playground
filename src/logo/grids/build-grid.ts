import { GRID_HEX_BASE_RADIUS, GRID_TRIANGLE_BASE_SIDE } from '@/constants'
import type { SettingsProperties } from '@/use-settings'
import { buildHexGrid } from './build-hex-grid'
import { buildTriangleGrid } from './build-triangle-grid'
import { buildVoronoiGrid } from './build-voronoi'

export const buildGrid = ({
  cellSize,
  pattern,
  seed,
  verticalHexagons,
}: Pick<
  SettingsProperties,
  'cellSize' | 'pattern' | 'seed' | 'verticalHexagons'
>) => {
  switch (pattern) {
    case 'voronoi':
      return buildVoronoiGrid({
        cellSize,
        seed,
      })
    case 'triangle':
      return buildTriangleGrid({
        triangleSide: GRID_TRIANGLE_BASE_SIDE * cellSize,
      })
    default:
      return buildHexGrid({
        hexRadius: GRID_HEX_BASE_RADIUS * cellSize,
        vertical: verticalHexagons,
      })
  }
}
