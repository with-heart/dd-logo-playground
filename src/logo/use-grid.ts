import { useMemo } from 'react'
import { useSettings } from '../use-settings'
import { buildGrid } from './grids/build-grid'
import type { Grid } from './grids/types'

export const useGrid = (): Grid => {
  const { verticalHexagons, pattern, cellSize, seed } = useSettings()

  return useMemo<Grid>(
    () =>
      buildGrid({
        cellSize,
        pattern,
        seed,
        verticalHexagons,
      }),
    [pattern, verticalHexagons, cellSize, seed],
  )
}
