import { useEffect, useId, useState } from 'react'
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
import { estimateImageSize, exportImage } from './exports'
import { NumberSlider } from './number-slider'
import { useSettings } from './use-settings'

export const Sidebar = () => {
  const patternId = useId()
  const exportTypeId = useId()
  const exportSizeId = useId()

  const [exportType, setExportType] = useState<'svg' | 'png'>('png')
  const [exportSize, setExportSize] = useState<number>(128)
  const [estimatedBytes, setEstimatedBytes] = useState<number | null>(null)
  const [estimating, setEstimating] = useState<boolean>(false)

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
    randomizeColors,
  } = useSettings()

  // Human-friendly byte formatter
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    const kb = bytes / 1024
    if (kb < 1024) return `${Math.round(kb)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(2)} MB`
  }

  // Estimate output size when export settings or image change
  useEffect(() => {
    let cancelled = false
    const estimate = async () => {
      if (exportType === 'svg') {
        const bytes = await estimateImageSize({ type: 'svg' })
        if (!cancelled) setEstimatedBytes(bytes)
        return
      }
      setEstimating(true)
      const bytes = await estimateImageSize({ type: 'png', size: exportSize })
      setEstimating(false)
      if (!cancelled) setEstimatedBytes(bytes)
    }

    estimate()
    return () => {
      cancelled = true
    }
  }, [exportType, exportSize])

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
        <button type="button" onClick={randomizeColors}>
          🎲 Randomize Colors
        </button>
        <button type="button" onClick={regenerateImage} className="regenerate">
          🔄 Regenerate Image
        </button>
      </section>

      <section>
        <h3>Tiling</h3>
        <div className="controls">
          <div>
            <label htmlFor={patternId}>Pattern</label>
            <select
              id={patternId}
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
              id={useId()}
              type="checkbox"
              checked={verticalHexagons}
              onChange={(e) => setVerticalHexagons(e.target.checked)}
            />
            Vertical hexagons (pointy top)
          </label>
        </div>
      </section>

      <section>
        <h3>Exports</h3>
        <div className="controls">
          <div>
            <label htmlFor={exportTypeId}>File type</label>
            <select
              id={exportTypeId}
              value={exportType}
              onChange={(e) => setExportType(e.target.value as 'svg' | 'png')}
            >
              <option value="svg">SVG</option>
              <option value="png">PNG</option>
            </select>
          </div>

          {exportType !== 'svg' && (
            <div>
              <label htmlFor={exportSizeId}>Size</label>
              <select
                id={exportSizeId}
                value={exportSize}
                onChange={(e) => setExportSize(parseInt(e.target.value, 10))}
              >
                <option value={64}>64x64</option>
                <option value={128}>128x128</option>
                <option value={256}>256x256</option>
                <option value={512}>512x512</option>
                <option value={1024}>1024x1024</option>
              </select>
            </div>
          )}

          <div aria-live="polite">
            {estimating ?
              'Estimating…'
            : estimatedBytes != null ?
              `Estimated size: ${formatBytes(estimatedBytes)}`
            : 'Estimated size: —'}
          </div>

          <button
            type="button"
            onClick={async () => {
              if (exportType === 'svg') {
                await exportImage({ type: 'svg', filenameBase: 'logo' })
              } else {
                await exportImage({
                  type: 'png',
                  size: exportSize,
                  filenameBase: 'logo',
                })
              }
            }}
          >
            Export
          </button>
        </div>
      </section>
    </aside>
  )
}
