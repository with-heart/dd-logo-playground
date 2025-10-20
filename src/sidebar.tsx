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
import { DicesIcon, DownloadIcon, RotateCcwIcon } from 'lucide-react'
import type { ReactNode } from 'react'
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
import { useExport } from './exports'
import { useSettings, type Pattern } from './use-settings'

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
  const {
    estimation,
    exportSize,
    exportType,
    onExport,
    setExportSize,
    setExportType,
  } = useExport()

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
    randomizeChroma,
    randomizeColors,
    randomizeLightness,
  } = useSettings()

  const onChangePattern = (p: Pattern) => {
    setPattern(p)
    // When switching away from hexagon, verticalHexagons has no effect; keep it but could reset if desired
    // If you prefer, uncomment next line to always set default
    // if (p !== 'hexagon') setVerticalHexagons(true)
  }

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
          >
            <Button
              size="icon-sm"
              variant="outline"
              title="Randomize lightness"
              onClick={randomizeLightness}
            >
              <DicesIcon />
            </Button>
          </CompoundSliderGroup>

          <CompoundSliderGroup
            name="Chroma"
            baseValue={chroma}
            onBaseChange={setChroma}
            varianceValue={chromaVariance}
            onVarianceChange={setChromaVariance}
            min={CHROMA_MIN}
            max={CHROMA_MAX}
            step={CHROMA_STEP}
          >
            <Button
              size="icon-sm"
              variant="outline"
              title="Randomize chroma"
              onClick={randomizeChroma}
            >
              <DicesIcon />
            </Button>
          </CompoundSliderGroup>

          <Button size="sm" variant="outline" onClick={randomizeColors}>
            <DicesIcon /> Randomize Lightness & Chroma
          </Button>
        </Section>

        <Section title="Tiling">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pattern">Pattern</Label>
            <Select
              value={pattern}
              onValueChange={(v) => onChangePattern(v as Pattern)}
            >
              <SelectTrigger id="pattern" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent id="pattern">
                <SelectItem value="hexagon">Hexagon</SelectItem>
                <SelectItem value="triangle">Triangle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {pattern === 'hexagon' && (
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
          )}

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

          <div aria-live="polite">{estimation}</div>

          <Button size="sm" variant="outline" onClick={onExport}>
            <DownloadIcon />
            Export
          </Button>
        </Section>
      </div>
    </>
  )
}
