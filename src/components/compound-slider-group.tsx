import type { ReactNode } from 'react'
import { Label } from './ui/label'
import { Slider } from './ui/slider'

export interface CompoundSliderGroupProps {
  name: string
  min: number
  max: number
  step: number
  baseValue: number
  onBaseChange: (base: number) => void
  varianceValue: number
  onVarianceChange: (variance: number) => void
  children?: ReactNode
}

export const CompoundSliderGroup = ({
  name,
  min,
  max,
  step,
  baseValue,
  onBaseChange,
  varianceValue,
  onVarianceChange,
  children,
}: CompoundSliderGroupProps) => {
  return (
    <fieldset className="group flex flex-col gap-3 rounded-sm border border-zinc-600 p-3">
      <legend>{name}</legend>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Label>Base</Label>
          <span className="text-xs">{baseValue.toFixed(2)}</span>
        </div>
        <Slider
          value={[baseValue]}
          min={min}
          max={max}
          step={step}
          onValueChange={(values) => onBaseChange(values[0])}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Label>Variance</Label>
          <span className="text-xs">{varianceValue.toFixed(2)}</span>
        </div>
        <Slider
          value={[varianceValue]}
          min={min}
          max={max}
          step={step}
          onValueChange={(values) => onVarianceChange(values[0])}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          = {baseValue.toFixed(2)} ± {varianceValue.toFixed(2)}
        </div>
        {children}
      </div>
    </fieldset>
  )
}
