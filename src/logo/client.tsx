import { Pattern } from '@/logo/pattern'
import { useGeometry } from '@/logo/use-geometry'
import type { ComponentProps } from 'react'
import { useSettings } from '../use-settings'
import { LogoBase } from './base'
import { deriveStroke } from './colors/stroke-utils'
import { useColors } from './use-colors'

export const Logo = (props: ComponentProps<'svg'>) => {
  const { strokeWidth } = useSettings()
  const geometry = useGeometry()
  const colors = useColors(geometry.grid.length)

  return (
    <LogoBase {...props}>
      <Pattern
        geometry={geometry.grid}
        colors={colors}
        strokeWidth={strokeWidth}
        toFill={(c) => c.fill}
        deriveStroke={deriveStroke}
      />
    </LogoBase>
  )
}
