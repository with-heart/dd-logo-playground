import type { ComponentProps } from 'react'
import { useSettings } from '../use-settings'
import { LogoBase } from './base'
import { deriveStroke } from './colors/stroke-utils'
import { HexagonPattern } from './patterns/hex'
import { useHexColors } from './use-hex-colors'
import { useHexGeometry } from './use-hex-geometry'

export const Logo = (props: ComponentProps<'svg'>) => {
  const { strokeWidth } = useSettings()
  const geometry = useHexGeometry()
  const colors = useHexColors(geometry.cells.length)

  return (
    <LogoBase {...props}>
      <HexagonPattern
        geometry={geometry}
        colors={colors}
        strokeWidth={strokeWidth}
        toFill={(c) => c.fill}
        deriveStroke={(a, b) => deriveStroke(a, b)}
      />
    </LogoBase>
  )
}
