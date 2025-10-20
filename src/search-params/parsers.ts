import {
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsStringEnum,
  type UrlKeys,
} from 'nuqs/server'

export const urlSearchParamsParsers = {
  seed: parseAsInteger,
  pattern: parseAsStringEnum(['hexagon', 'triangle'] as const).withDefault(
    'hexagon',
  ),
  chroma: parseAsFloat.withDefault(0.3).withOptions({ history: 'replace' }),
  chromaVariance: parseAsFloat
    .withDefault(0.05)
    .withOptions({ history: 'replace' }),
  lightness: parseAsFloat.withDefault(0.9).withOptions({ history: 'replace' }),
  lightnessVariance: parseAsFloat
    .withDefault(0.05)
    .withOptions({ history: 'replace' }),
  strokeWidth: parseAsFloat
    .withDefault(0.05)
    .withOptions({ history: 'replace' }),
  verticalHexagons: parseAsBoolean
    .withDefault(true)
    .withOptions({ history: 'replace' }),
}

export const urlSearchParamsUrlKeys: UrlKeys<typeof urlSearchParamsParsers> = {
  seed: 's',
  pattern: 'p',
  chroma: 'c',
  chromaVariance: 'cv',
  lightness: 'l',
  lightnessVariance: 'lv',
  strokeWidth: 'sw',
  verticalHexagons: 'v',
}
