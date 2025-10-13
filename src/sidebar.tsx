import {
  CHROMA_MAX,
  CHROMA_MIN,
  CHROMA_STEP,
  CHROMA_VARIANCE_MAX,
  CHROMA_VARIANCE_MIN,
  LIGHTNESS_MAX,
  LIGHTNESS_MIN,
  LIGHTNESS_STEP,
  LIGHTNESS_VARIANCE_MAX,
  LIGHTNESS_VARIANCE_MIN,
  OUTLINE_WIDTH_MAX,
  OUTLINE_WIDTH_MIN,
  OUTLINE_WIDTH_STEP,
} from './constants'
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
    lightness,
    setLightness,
    chroma,
    setChroma,
    lightnessVariance,
    setLightnessVariance,
    chromaVariance,
    setChromaVariance,
    regenerateImage,
  } = useSettings()

  return (
    <aside className="sidebar">
      <section>
        <h3>Colors</h3>
        <div className="controls">
          <NumberSlider
            label="Lightness"
            value={lightness}
            min={LIGHTNESS_MIN}
            max={LIGHTNESS_MAX}
            step={LIGHTNESS_STEP}
            onChange={setLightness}
          />
          <NumberSlider
            label="Lightness Variance"
            value={lightnessVariance}
            min={LIGHTNESS_VARIANCE_MIN}
            max={LIGHTNESS_VARIANCE_MAX}
            step={LIGHTNESS_STEP}
            onChange={setLightnessVariance}
          />
          <NumberSlider
            label="Chroma"
            value={chroma}
            min={CHROMA_MIN}
            max={CHROMA_MAX}
            step={CHROMA_STEP}
            onChange={setChroma}
          />
          <NumberSlider
            label="Chroma Variance"
            value={chromaVariance}
            min={CHROMA_VARIANCE_MIN}
            max={CHROMA_VARIANCE_MAX}
            step={CHROMA_STEP}
            onChange={setChromaVariance}
          />
        </div>
        <button type="button" onClick={regenerateImage} className="regenerate">
          🔄 Regenerate Image
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
            min={OUTLINE_WIDTH_MIN}
            max={OUTLINE_WIDTH_MAX}
            step={OUTLINE_WIDTH_STEP}
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
