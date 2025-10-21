import type { ComponentProps } from 'react'
import { Pattern } from '@/logo/pattern'
import { useGrid } from '@/logo/use-grid'
import { useSettings } from '../use-settings'
import { LogoBase } from './base'
import { deriveStroke } from './colors/stroke-utils'
import { useColors } from './use-colors'

export const Logo = (props: ComponentProps<'svg'>) => {
  const { strokeWidth } = useSettings()
  const grid = useGrid()
  const colors = useColors(grid.length)

  return (
    <LogoBase {...props}>
      <Pattern
        grid={grid}
        colors={colors}
        strokeWidth={strokeWidth}
        toFill={(c) => c.fill}
        deriveStroke={deriveStroke}
      />
    </LogoBase>
  )
}
