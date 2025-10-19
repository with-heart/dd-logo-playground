import { useMemo } from 'react'
import { CIRCLE_CENTER_X, CIRCLE_CENTER_Y, CIRCLE_RADIUS } from '../constants'
import { useSettings } from '../use-settings'
import { buildHexGrid } from './geometry/build-hex-grid'

export const useHexGeometry = () => {
  const { verticalHexagons } = useSettings()

  return useMemo(
    () =>
      buildHexGrid({
        centerX: CIRCLE_CENTER_X,
        centerY: CIRCLE_CENTER_Y,
        circleRadius: CIRCLE_RADIUS,
        hexRadius: 1.2,
        vertical: verticalHexagons,
      }),
    [verticalHexagons],
  )
}
