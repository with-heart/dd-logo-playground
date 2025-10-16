import type { SearchParams } from 'nuqs'
import {
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsStringEnum,
} from 'nuqs/server'

const first = (searchParams: SearchParams, key: string) =>
  (Array.isArray(searchParams[key]) ?
    searchParams[key]?.[0]
  : searchParams[key]) ?? undefined

const DEFAULTS = {
  pat: 'hexagon' as const,
  v: true,
  sw: 0.05,
  l: 0.9,
  lv: 0.05,
  c: 0.3,
  cv: 0.05,
}

/**
 * If seed is missing, returns a canonical URL (querystring) that fills defaults
 * and adds a new seed. Otherwise returns null (no redirect required).
 */
export function ensureCanonicalUrl(searchParams: SearchParams): string | null {
  const sParsed = parseAsInteger.parse(first(searchParams, 's') ?? '')
  if (typeof sParsed === 'number' && !Number.isNaN(sParsed)) {
    return null
  }

  const pat =
    parseAsStringEnum(['hexagon'] as const).parse(
      first(searchParams, 'pat') ?? '',
    ) ?? DEFAULTS.pat
  const v = parseAsBoolean.parse(first(searchParams, 'v') ?? '') ?? DEFAULTS.v
  const sw = parseAsFloat.parse(first(searchParams, 'sw') ?? '') ?? DEFAULTS.sw
  const l = parseAsFloat.parse(first(searchParams, 'l') ?? '') ?? DEFAULTS.l
  const lv = parseAsFloat.parse(first(searchParams, 'lv') ?? '') ?? DEFAULTS.lv
  const c = parseAsFloat.parse(first(searchParams, 'c') ?? '') ?? DEFAULTS.c
  const cv = parseAsFloat.parse(first(searchParams, 'cv') ?? '') ?? DEFAULTS.cv

  // Generate a 32-bit seed (prefer Web Crypto)
  let seed = 0
  try {
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    seed = buf[0] >>> 0
  } catch {
    seed = Math.floor(Math.random() * 0xffffffff) >>> 0
  }

  const u = new URLSearchParams()
  u.set('pat', pat)
  u.set('v', v ? '1' : '0')
  u.set('sw', String(sw))
  u.set('l', String(l))
  u.set('lv', String(lv))
  u.set('c', String(c))
  u.set('cv', String(cv))
  u.set('s', String(seed))
  return `?${u.toString()}`
}
