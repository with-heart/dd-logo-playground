import { shallowEqual, useSelector } from '@xstate/react'
import { assertEvent, assign, createActor, setup } from 'xstate'
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
} from './constants'
import { clamp, rand, roundTo } from './math'

export interface ColorValues {
  chroma: number
  chromaVariance: number
  lightness: number
  lightnessVariance: number
}

const STORAGE_KEY = 'colors'

const DEFAULT_VALUES: ColorValues = {
  chroma: 0.3,
  chromaVariance: 0.05,
  lightness: 0.9,
  lightnessVariance: 0.05,
}

export const colorsMachine = setup({
  types: {
    context: {} as {
      values: ColorValues
    },
    events: {} as
      | {
          type: 'set'
          field: keyof ColorValues
          value: number
        }
      | { type: 'randomize' },
  },
  actions: {
    randomize: assign(({ context }) => {
      // Random base values within allowed ranges
      let lightness = rand(LIGHTNESS_MIN, LIGHTNESS_MAX)
      let chroma = rand(CHROMA_MIN, CHROMA_MAX)

      // Variance cannot exceed distance to bounds or configured max
      const lightnessVarianceMax = Math.min(
        LIGHTNESS_VARIANCE_MAX,
        lightness - LIGHTNESS_MIN,
        LIGHTNESS_MAX - lightness,
      )
      const chromaVarianceMax = Math.min(
        CHROMA_VARIANCE_MAX,
        chroma - CHROMA_MIN,
        CHROMA_MAX - chroma,
      )

      let lightnessVariance = rand(
        LIGHTNESS_VARIANCE_MIN,
        Math.max(LIGHTNESS_VARIANCE_MIN, lightnessVarianceMax),
      )
      let chromaVariance = rand(
        CHROMA_VARIANCE_MIN,
        Math.max(CHROMA_VARIANCE_MIN, chromaVarianceMax),
      )

      // Align to slider steps and clamp just in case
      lightness = clamp(
        roundTo(lightness, LIGHTNESS_STEP),
        LIGHTNESS_MIN,
        LIGHTNESS_MAX,
      )
      chroma = clamp(roundTo(chroma, CHROMA_STEP), CHROMA_MIN, CHROMA_MAX)
      lightnessVariance = clamp(
        roundTo(lightnessVariance, LIGHTNESS_STEP),
        LIGHTNESS_VARIANCE_MIN,
        lightnessVarianceMax,
      )
      chromaVariance = clamp(
        roundTo(chromaVariance, CHROMA_STEP),
        CHROMA_VARIANCE_MIN,
        chromaVarianceMax,
      )

      return {
        ...context,
        values: {
          chroma,
          chromaVariance,
          lightness,
          lightnessVariance,
        },
      }
    }),
    saveValues: ({ context }) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(context.values))
      } catch {
        // ignore write errors
      }
    },
    set: assign(({ context, event }) => {
      assertEvent(event, 'set')
      return {
        ...context,
        values: {
          ...context.values,
          [event.field]: event.value,
        },
      }
    }),
  },
}).createMachine({
  id: 'colors',
  context: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return {
        values: stored ? (JSON.parse(stored) as ColorValues) : DEFAULT_VALUES,
      }
    } catch {
      return { values: DEFAULT_VALUES }
    }
  },
  on: {
    randomize: { actions: ['randomize', 'saveValues'] },
    set: { actions: ['set', 'saveValues'] },
  },
})

export const colors = createActor(colorsMachine).start()

export const useChroma = () =>
  useSelector(colors, (state) => state.context.values.chroma)
export const useChromaVariance = () =>
  useSelector(colors, (state) => state.context.values.chromaVariance)
export const useLightness = () =>
  useSelector(colors, (state) => state.context.values.lightness)
export const useLightnessVariance = () =>
  useSelector(colors, (state) => state.context.values.lightnessVariance)

export const useColorValues = () =>
  useSelector(colors, (state) => state.context.values, shallowEqual)

export const useSetColorValue = (field: keyof ColorValues) => (value: number) =>
  colors.send({ type: 'set', field, value })
