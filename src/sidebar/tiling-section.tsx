import { Fieldset } from '@/components/fieldset'
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
import {
  CELL_SIZE_MAX,
  CELL_SIZE_MIN,
  CELL_SIZE_STEP,
  OUTLINE_WIDTH_MAX,
  OUTLINE_WIDTH_MIN,
  OUTLINE_WIDTH_STEP,
} from '@/constants'
import { type Pattern, useSettings } from '@/use-settings'
import { Section } from './section'

export const TilingSection = () => {
  const {
    pattern,
    setPattern,
    strokeWidth,
    setStrokeWidth,
    verticalHexagons,
    setVerticalHexagons,
    cellSize,
    setCellSize,
  } = useSettings()
  return (
    <Section title="Tiling">
      <div className="flex flex-col gap-2">
        <Label htmlFor="pattern">Pattern</Label>
        <Select value={pattern} onValueChange={(v) => setPattern(v as Pattern)}>
          <SelectTrigger id="pattern" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent id="pattern">
            <SelectItem value="hexagon">Hexagon</SelectItem>
            <SelectItem value="triangle">Triangle</SelectItem>
            <SelectItem value="voronoi">Voronoi</SelectItem>
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

      <Fieldset legend="Cells">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <Label id="cell-size-label">Size</Label>
            <span className="text-xs">{cellSize.toFixed(2)}x</span>
          </div>
          <Slider
            aria-labelledby="cell-size-label"
            value={[cellSize]}
            onValueChange={(value) => setCellSize(value[0])}
            min={CELL_SIZE_MIN}
            max={CELL_SIZE_MAX}
            step={CELL_SIZE_STEP}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <Label id="stroke-width-label">Stroke Width</Label>
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
      </Fieldset>
    </Section>
  )
}
