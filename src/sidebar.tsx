import { useId } from 'react'
import type { ColorPalette } from './constants'
import { usePalette } from './use-palette'

const PalettePreview = ({
  palette,
  isActive,
  onClick,
}: {
  palette: ColorPalette
  isActive: boolean
  onClick: () => void
}) => (
  <button
    type="button"
    className={`palette-preview ${isActive ? 'active' : ''}`}
    onClick={onClick}
    title={`Switch to ${palette.name} palette`}
  >
    <div className="palette-name">{palette.name}</div>
    <div className="color-swatches">
      {palette.colors.slice(0, 6).map((color) => (
        <div
          key={color}
          className="color-swatch"
          style={{ backgroundColor: color }}
        />
      ))}
      {palette.colors.length > 6 && (
        <div className="more-colors">+{palette.colors.length - 6}</div>
      )}
    </div>
  </button>
)

const CustomOklchPalettePreview = ({
  palette,
  isActive,
  onClick,
  oklchLightness,
  setOklchLightness,
  oklchChroma,
  setOklchChroma,
}: {
  palette: ColorPalette
  isActive: boolean
  onClick: () => void
  oklchLightness: number
  setOklchLightness: (value: number) => void
  oklchChroma: number
  setOklchChroma: (value: number) => void
}) => {
  const lightnessId = useId()
  const chromaId = useId()

  return (
    <div className={`palette-preview custom-oklch ${isActive ? 'active' : ''}`}>
      <button
        type="button"
        className="palette-header"
        onClick={onClick}
        title={`Switch to ${palette.name} palette`}
      >
        <div className="palette-name">{palette.name}</div>
        <div className="color-swatches">
          {palette.colors.slice(0, 6).map((color) => (
            <div
              key={color}
              className="color-swatch"
              style={{ backgroundColor: color }}
            />
          ))}
          {palette.colors.length > 6 && (
            <div className="more-colors">+{palette.colors.length - 6}</div>
          )}
        </div>
      </button>

      <div className="oklch-controls">
        <div className="slider-container">
          <label htmlFor={lightnessId} className="control-label">
            Lightness: {oklchLightness.toFixed(2)}
          </label>
          <input
            id={lightnessId}
            type="range"
            min="0.3"
            max="0.9"
            step="0.01"
            value={oklchLightness}
            onChange={(e) => setOklchLightness(Number(e.target.value))}
            className="oklch-slider"
          />
        </div>

        <div className="slider-container">
          <label htmlFor={chromaId} className="control-label">
            Chroma: {oklchChroma.toFixed(2)}
          </label>
          <input
            id={chromaId}
            type="range"
            min="0.05"
            max="0.25"
            step="0.01"
            value={oklchChroma}
            onChange={(e) => setOklchChroma(Number(e.target.value))}
            className="oklch-slider"
          />
        </div>
      </div>
    </div>
  )
}

export const Sidebar = () => {
  const {
    activePalette,
    setActivePalette,
    availablePalettes,
    strokeWidth,
    setStrokeWidth,
    oklchLightness,
    setOklchLightness,
    oklchChroma,
    setOklchChroma,
    regenerateActivePalette,
  } = usePalette()

  return (
    <div className="sidebar">
      <h3>Color Palettes</h3>
      <div className="palette-grid">
        {availablePalettes.map((palette) => {
          if (palette.isCustom && palette.name === 'Custom OKLCH') {
            return (
              <CustomOklchPalettePreview
                key={palette.name}
                palette={palette}
                isActive={activePalette.name === palette.name}
                onClick={() => setActivePalette(palette)}
                oklchLightness={oklchLightness}
                setOklchLightness={setOklchLightness}
                oklchChroma={oklchChroma}
                setOklchChroma={setOklchChroma}
              />
            )
          }
          return (
            <PalettePreview
              key={palette.name}
              palette={palette}
              isActive={activePalette.name === palette.name}
              onClick={() => setActivePalette(palette)}
            />
          )
        })}
      </div>

      <button
        type="button"
        onClick={regenerateActivePalette}
        className="regenerate-button-main"
      >
        🎲 Regenerate Colors
      </button>

      <div className="control-section">
        <h3>Outline Width</h3>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="0.15"
            step="0.01"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="stroke-width-slider"
          />
          <div className="slider-value">
            {strokeWidth === 0 ? 'None' : strokeWidth.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}
