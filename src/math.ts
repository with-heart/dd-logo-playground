/**
 * Clamp `number` between `min` and `max`.
 *
 * If `number` is less than `min`, return `min`. If `number` is greater than
 * `max`, return `max`. Otherwise, return `number`.
 */
export const clamp = (number: number, min: number, max: number) =>
  Math.min(max, Math.max(min, number))

/** Round `number` to the nearest multiple of `step`. */
export const roundTo = (number: number, step: number) =>
  Math.round(number / step) * step

/** Generate a random number between `min` and `max`. */
export const rand = (min: number, max: number) =>
  Math.random() * (max - min) + min

/** Mulberry32 pseudorandom number generator implementation. */
export const mulberry32 = (seed: number) => {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}
