import type { SearchParams } from 'nuqs'
import { parseAsInteger } from 'nuqs/server'

const first = (searchParams: SearchParams, key: string) =>
  (Array.isArray(searchParams[key]) ?
    searchParams[key]?.[0]
  : searchParams[key]) ?? undefined

/**
 * If seed is missing, returns a canonical URL (querystring) that and adds a new
 * seed. Otherwise returns null (no redirect required).
 */
export function ensureCanonicalUrl(searchParams: SearchParams): string | null {
  const seedParsed = parseAsInteger.parse(first(searchParams, 's') ?? '')
  if (typeof seedParsed === 'number' && !Number.isNaN(seedParsed)) {
    return null
  }

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
  u.set('s', String(seed))
  return `?${u.toString()}`
}
