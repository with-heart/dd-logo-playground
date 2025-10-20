import { DicesIcon } from 'lucide-react'
import { CompoundSliderGroup } from '@/components/compound-slider-group'
import { Button } from '@/components/ui/button'
import {
  CHROMA_MAX,
  CHROMA_MIN,
  CHROMA_STEP,
  LIGHTNESS_MAX,
  LIGHTNESS_MIN,
  LIGHTNESS_STEP,
} from '@/constants'
import { useSettings } from '@/use-settings'
import { Section } from './section'

export const ColorsSection = () => {
  const {
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

  return (
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
  )
}
