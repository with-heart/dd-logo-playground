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

export const Sidebar = () => {
  const {
    activePalette,
    setActivePalette,
    availablePalettes,
    strokeWidth,
    setStrokeWidth,
  } = usePalette()

  return (
    <div className="sidebar">
      <h3>Color Palettes</h3>
      <div className="palette-grid">
        {availablePalettes.map((palette) => (
          <PalettePreview
            key={palette.name}
            palette={palette}
            isActive={activePalette.name === palette.name}
            onClick={() => setActivePalette(palette)}
          />
        ))}
      </div>

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
