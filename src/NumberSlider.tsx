import type React from 'react'
import { useState, useEffect } from 'react'

interface NumberSliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  className?: string
}

export const NumberSlider: React.FC<NumberSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(value.toString())
  const [isEditing, setIsEditing] = useState(false)

  // Sync input value when prop value changes
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toFixed(2))
    }
  }, [value, isEditing])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    onChange(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputFocus = () => {
    setIsEditing(true)
    setInputValue(value.toString())
  }

  const handleInputBlur = () => {
    setIsEditing(false)
    const numValue = parseFloat(inputValue)
    
    if (!Number.isNaN(numValue)) {
      // Clamp to min/max bounds
      const clampedValue = Math.min(max, Math.max(min, numValue))
      onChange(clampedValue)
    } else {
      // Reset to current value if invalid
      setInputValue(value.toFixed(2))
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
    if (e.key === 'Escape') {
      setInputValue(value.toFixed(2))
      e.currentTarget.blur()
    }
  }

  return (
    <div className={`number-slider ${className}`}>
      <div className="number-slider-header">
        <span className="number-slider-label">{label}</span>
      </div>
      <div className="number-slider-controls">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="number-slider-range"
        />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className="number-slider-input"
        />
      </div>
    </div>
  )
}