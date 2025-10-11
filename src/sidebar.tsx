import React from 'react'
import { usePalette } from './use-palette'

export const Sidebar = () => {
  const {
    activePalette,
    setActivePalette,
    availablePalettes,
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
    regenerateActivePalette,
  } = usePalette()

  return (
    <div className="sidebar">
      <div className="control-section">
        <h3>Color Palettes</h3>
        <select
          value={activePalette.name}
          onChange={(e) => {
            const selectedPalette = availablePalettes.find(
              (p) => p.name === e.target.value,
            )
            if (selectedPalette) {
              setActivePalette(selectedPalette)
            }
          }}
          className="palette-select"
        >
          <button type="button">
            {
              activePalette.isCustom && activePalette.name === 'Custom OKLCH' ?
                // Custom preview for OKLCH that updates with slider changes
                <>
                  <div className="color-swatches-inline">
                    <div
                      className="oklch-gradient-preview"
                      style={{
                        background: `linear-gradient(to right,
                        oklch(${oklchLightness} ${oklchChroma} 0),
                        oklch(${oklchLightness} ${oklchChroma} 60),
                        oklch(${oklchLightness} ${oklchChroma} 120),
                        oklch(${oklchLightness} ${oklchChroma} 180),
                        oklch(${oklchLightness} ${oklchChroma} 240),
                        oklch(${oklchLightness} ${oklchChroma} 300))`,
                      }}
                    />
                  </div>
                  <span className="palette-name-inline">
                    {activePalette.name}
                  </span>
                </>
                // Use selectedcontent for regular palettes
              : React.createElement('selectedcontent')
            }
          </button>

          {availablePalettes.map((palette) => (
            <option key={palette.name} value={palette.name}>
              {
                palette.isCustom && palette.name === 'Custom OKLCH' ?
                  // For Custom OKLCH, show a gradient using current lightness and chroma values
                  <>
                    <div className="color-swatches-inline">
                      <div
                        className="oklch-gradient-preview"
                        style={{
                          background: `linear-gradient(to right,
                          oklch(${oklchLightness} ${oklchChroma} 0),
                          oklch(${oklchLightness} ${oklchChroma} 60),
                          oklch(${oklchLightness} ${oklchChroma} 120),
                          oklch(${oklchLightness} ${oklchChroma} 180),
                          oklch(${oklchLightness} ${oklchChroma} 240),
                          oklch(${oklchLightness} ${oklchChroma} 300))`,
                        }}
                      />
                    </div>
                    <span className="palette-name-inline">{palette.name}</span>
                  </>
                  // For regular palettes, show actual color swatches
                : <>
                    <div className="color-swatches-inline">
                      {palette.colors.slice(0, 4).map((color, index) => (
                        <div
                          key={`${color}-${index}`}
                          className="color-swatch-inline"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      {palette.colors.length > 4 && (
                        <span className="more-colors-inline">
                          +{palette.colors.length - 4}
                        </span>
                      )}
                    </div>
                    <span className="palette-name-inline">{palette.name}</span>
                  </>

              }
            </option>
          ))}
        </select>

        {/* Show OKLCH controls only when Custom OKLCH palette is selected */}
        {activePalette.isCustom && activePalette.name === 'Custom OKLCH' && (
          <div className="oklch-controls-section">
            <div className="slider-container">
              <span className="control-label">
                Lightness: {oklchLightness.toFixed(2)}
              </span>
              <input
                type="range"
                min="0.05"
                max="0.99"
                step="0.01"
                value={oklchLightness}
                onChange={(e) => setOklchLightness(Number(e.target.value))}
                className="oklch-slider"
              />
            </div>

            <div className="slider-container">
              <span className="control-label">
                Lightness Variance: ±{oklchLightnessVariance.toFixed(2)}
              </span>
              <input
                type="range"
                min="0"
                max="0.3"
                step="0.01"
                value={oklchLightnessVariance}
                onChange={(e) =>
                  setOklchLightnessVariance(Number(e.target.value))
                }
                className="oklch-slider"
              />
            </div>

            <div className="slider-container">
              <span className="control-label">
                Chroma: {oklchChroma.toFixed(2)}
              </span>
              <input
                type="range"
                min="0.01"
                max="0.45"
                step="0.01"
                value={oklchChroma}
                onChange={(e) => setOklchChroma(Number(e.target.value))}
                className="oklch-slider"
              />
            </div>

            <div className="slider-container">
              <span className="control-label">
                Chroma Variance: ±{oklchChromaVariance.toFixed(2)}
              </span>
              <input
                type="range"
                min="0"
                max="0.2"
                step="0.01"
                value={oklchChromaVariance}
                onChange={(e) => setOklchChromaVariance(Number(e.target.value))}
                className="oklch-slider"
              />
            </div>
          </div>
        )}
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
