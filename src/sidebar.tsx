import { NumberSlider } from './number-slider'
import { useSettings } from './use-settings'

export const Sidebar = () => {
  const {
    pattern,
    setPattern,
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
  } = useSettings()

  return (
    <aside className="sidebar">
      <section>
        <h3>Colors</h3>
        <div className="controls">
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
            max={0.4}
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
        </div>
        <button
          type="button"
          onClick={regenerateOklchPalette}
          className="regenerate"
        >
          🎲 Regenerate Colors
        </button>
      </section>

      <section>
        <h3>Tiling</h3>
        <div className="controls">
          <div>
            <label htmlFor="pattern">Pattern</label>
            <select
              value={pattern}
              onChange={(e) => setPattern(e.target.value as 'hexagon')}
            >
              <option value="hexagon">Hexagon</option>
            </select>
          </div>

          <NumberSlider
            label="Outline Width"
            value={strokeWidth}
            min={0}
            max={0.15}
            step={0.01}
            onChange={setStrokeWidth}
          />

          <label>
            <input
              type="checkbox"
              checked={verticalHexagons}
              onChange={(e) => setVerticalHexagons(e.target.checked)}
            />
            Vertical hexagons (pointy top)
          </label>
        </div>
      </section>
    </aside>
  )
}
