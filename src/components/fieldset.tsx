import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export interface FieldsetProps extends ComponentProps<'fieldset'> {
  legend: string
}

export const Fieldset = ({ legend, children, ...props }: FieldsetProps) => {
  const className = cn(
    'flex flex-col gap-3 rounded-sm border border-zinc-600 p-3',
    props.className,
  )
  return (
    <fieldset {...props} className={className}>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  )
}
