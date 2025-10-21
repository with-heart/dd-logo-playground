import type { ComponentProps } from 'react'
import { Pattern } from '@/logo/pattern'
import { useSettings } from '../use-settings'
import { LogoBase } from './base'
import { deriveStroke } from './colors/stroke-utils'
import { useLogoModel } from './use-logo-model'

export const Logo = (props: ComponentProps<'svg'>) => {
  const { strokeWidth } = useSettings()
  const { grid, colors } = useLogoModel()

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
