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
