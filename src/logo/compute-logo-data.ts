import { mulberry32 } from '@/math'
import type { ColorValues } from '@/types'
import { generateOklchColors, type OklchColor } from './colors/generate-colors'
import {
  type BuildGridOptions,
  buildHexGrid,
  type HexGrid,
} from './geometry/build-hex-grid'

export type GeometryOptions = Parameters<typeof buildHexGrid>[0]
export type ColorOptions = Parameters<typeof generateOklchColors>[0]

export interface LogoSettings {
  grid: BuildGridOptions
  colorValues: ColorValues
  seed?: number
}

export interface LogoData {
  geometry: HexGrid
  colors: OklchColor[]
}

export function computeLogoData(settings: LogoSettings): LogoData {
  const geometry = buildHexGrid(settings.grid)
  const colors = generateOklchColors(
    geometry.cells.length,
    settings.colorValues,
    mulberry32(settings.seed || 1),
  )

  return { geometry, colors }
}
