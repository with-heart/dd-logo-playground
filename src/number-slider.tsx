import type { ComponentPropsWithoutRef } from 'react'
import { useId } from 'react'

export interface NumberSliderProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'onChange'> {
  label: string
  onChange: (value: number) => void
}

export const NumberSlider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  className = '',
}: NumberSliderProps) => {
  const id = useId()

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    onChange(newValue)
  }

  return (
    <div className={`number-slider ${className}`}>
      <label htmlFor={id}>{label}</label>
      <div>
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
        />
        <span className="value">{value}</span>
      </div>
    </div>
  )
}
