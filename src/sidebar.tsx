// Sidebar UI for Custom OKLCH controls only
import { NumberSlider } from './NumberSlider'
import { usePalette } from './use-palette'

export const Sidebar = () => {
  const {
    strokeWidth,
    setStrokeWidth,
    verticalHexagons,
    setVerticalHexagons,
    oklchLightness,
    setOklchLightness,
    oklchChroma,
    setOklchChroma,
    oklchLightnessVariance,
    setOklchLightnessVariance,
    oklchChromaVariance,
    setOklchChromaVariance,
    regenerateOklchPalette,
  } = usePalette()

  return (
    <div className="sidebar">
      <div className="control-section">
        <h3>Colors</h3>
        <div className="oklch-controls-section">
          <NumberSlider
            label="Lightness"
            value={oklchLightness}
            min={0.05}
            max={0.99}
            step={0.01}
            onChange={setOklchLightness}
          />

          <NumberSlider
            label="Lightness Variance"
            value={oklchLightnessVariance}
            min={0}
            max={0.3}
            step={0.01}
            onChange={setOklchLightnessVariance}
          />

          <NumberSlider
            label="Chroma"
            value={oklchChroma}
            min={0.01}
            max={0.45}
            step={0.01}
            onChange={setOklchChroma}
          />

          <NumberSlider
            label="Chroma Variance"
            value={oklchChromaVariance}
            min={0}
            max={0.2}
            step={0.01}
            onChange={setOklchChromaVariance}
          />
          <button
            type="button"
            onClick={regenerateOklchPalette}
            className="regenerate-button-main"
          >
            🎲 Regenerate Colors
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Outline Width</h3>
        <NumberSlider
          label="Width"
          value={strokeWidth}
          min={0}
          max={0.15}
          step={0.01}
          onChange={setStrokeWidth}
        />
      </div>

      <div className="control-section">
        <h3>Hexagon Orientation</h3>
        <div className="checkbox-container">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={verticalHexagons}
              onChange={(e) => setVerticalHexagons(e.target.checked)}
              className="orientation-checkbox"
            />
            Vertical hexagons (pointy top)
          </label>
        </div>
      </div>
    </div>
  )
}
