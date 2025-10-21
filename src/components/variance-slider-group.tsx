import type { ReactNode } from 'react'
import { Fieldset } from './fieldset'
import { Label } from './ui/label'
import { Slider } from './ui/slider'

export interface VarianceSliderGroupProps {
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

export const VarianceSliderGroup = ({
  name,
  min,
  max,
  step,
  baseValue,
  onBaseChange,
  varianceValue,
  onVarianceChange,
  children,
}: VarianceSliderGroupProps) => {
  return (
    <Fieldset legend={name}>
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
    </Fieldset>
  )
}
