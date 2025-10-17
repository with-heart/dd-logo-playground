import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { DownloadIcon, RotateCcwIcon, ShuffleIcon } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { CompoundSliderGroup } from './components/compound-slider-group'
import {
  CHROMA_MAX,
  CHROMA_MIN,
  CHROMA_STEP,
  LIGHTNESS_MAX,
  LIGHTNESS_MIN,
  LIGHTNESS_STEP,
  OUTLINE_WIDTH_MAX,
  OUTLINE_WIDTH_MIN,
  OUTLINE_WIDTH_STEP,
} from './constants'
import { estimateImageSize, exportImage } from './exports'
import { useSettings } from './use-settings'

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.round(kb)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

const Section = ({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) => {
  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-lg">{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

export const Sidebar = () => {
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
    regenerateImage,
    lightness,
    setLightness,
    lightnessVariance,
    setLightnessVariance,
    chroma,
    setChroma,
    chromaVariance,
    setChromaVariance,
    randomizeColors,
  } = useSettings()

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
    <>
      <header>
        <Button size="lg" className="w-full" onClick={regenerateImage}>
          <RotateCcwIcon /> Regenerate Image
        </Button>
      </header>

      <div className="flex flex-col gap-6 overflow-y-auto">
        <Section title="Colors">
          <CompoundSliderGroup
            name="Lightness"
            baseValue={lightness}
            onBaseChange={setLightness}
            varianceValue={lightnessVariance}
            onVarianceChange={setLightnessVariance}
            min={LIGHTNESS_MIN}
            max={LIGHTNESS_MAX}
            step={LIGHTNESS_STEP}
          />
          <CompoundSliderGroup
            name="Chroma"
            baseValue={chroma}
            onBaseChange={setChroma}
            varianceValue={chromaVariance}
            onVarianceChange={setChromaVariance}
            min={CHROMA_MIN}
            max={CHROMA_MAX}
            step={CHROMA_STEP}
          />

          <Button size="sm" variant="outline" onClick={randomizeColors}>
            <ShuffleIcon /> Randomize Colors
          </Button>
        </Section>

        <Section title="Tiling">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pattern">Pattern</Label>
            <Select value={pattern} onValueChange={setPattern}>
              <SelectTrigger id="pattern" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent id="pattern">
                <SelectItem value="hexagon">Hexagon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="vertical-hexagons"
              checked={verticalHexagons}
              onCheckedChange={setVerticalHexagons}
            />
            <Label htmlFor="vertical-hexagons">
              Vertical hexagons (pointy top)
            </Label>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <Label id="stroke-width-label">Outline Width</Label>
              <span className="text-xs">{strokeWidth}</span>
            </div>
            <Slider
              aria-labelledby="stroke-width-label"
              value={[strokeWidth]}
              onValueChange={(value) => setStrokeWidth(value[0])}
              min={OUTLINE_WIDTH_MIN}
              max={OUTLINE_WIDTH_MAX}
              step={OUTLINE_WIDTH_STEP}
            />
          </div>
        </Section>

        <Section title="Exports">
          <div className="flex flex-col gap-2">
            <Label htmlFor="file-type">File Type</Label>
            <Select
              value={exportType}
              onValueChange={(value) => setExportType(value as 'svg' | 'png')}
            >
              <SelectTrigger id="file-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="svg">SVG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {exportType !== 'svg' && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="file-size">File Size</Label>
              <Select
                value={exportSize.toString()}
                onValueChange={(value) =>
                  setExportSize(
                    parseInt(value, 10) as 64 | 128 | 256 | 512 | 1024,
                  )
                }
              >
                <SelectTrigger id="file-size" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="64">64x64</SelectItem>
                  <SelectItem value="128">128x128</SelectItem>
                  <SelectItem value="256">256x256</SelectItem>
                  <SelectItem value="512">512x512</SelectItem>
                  <SelectItem value="1024">1024x1024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div aria-live="polite">
            {estimating ?
              'Estimating…'
            : estimatedBytes != null ?
              `Estimated size: ${formatBytes(estimatedBytes)}`
            : 'Estimated size: —'}
          </div>

          <Button
            size="sm"
            variant="outline"
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
            <DownloadIcon />
            Export
          </Button>
        </Section>
      </div>
    </>
  )
}
