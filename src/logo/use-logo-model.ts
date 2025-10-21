import * as Comlink from 'comlink'
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import { useSettings } from '../use-settings'
import { generateOklchColors, type OklchColor } from './colors/generate-colors'
import { buildGrid } from './grids/build-grid'
import type { Grid } from './grids/types'

// Worker APIs mirror what's exposed in ./workers/*.worker.ts
interface GridWorkerAPI {
  buildGrid: typeof buildGrid
}

interface ColorsWorkerAPI {
  generateOklchColors: typeof generateOklchColors
}

export type LogoSnapshot = {
  grid: Grid
  colors: OklchColor[]
}

/**
 * Compute grid and colors off the main thread while ensuring the React state
 * is always a consistent snapshot (grid + matching colors array).
 *
 * Behavior:
 * - Grid deps change -> recompute grid, then colors sized to that grid, then commit both together.
 * - Only color deps change -> recompute colors for the current grid length and commit colors only.
 * - Stale async results are ignored via generation counters.
 * - Initial snapshot is computed synchronously for immediate display, then kept fresh by workers.
 */
export const useLogoModel = (options?: {
  throttleMs?: number
}): LogoSnapshot => {
  const throttleMs = options?.throttleMs ?? 120
  const {
    // Grid deps
    cellSize,
    pattern,
    seed,
    verticalHexagons,
    // Color deps
    chroma,
    chromaVariance,
    lightness,
    lightnessVariance,
  } = useSettings()

  // Build an initial, consistent snapshot synchronously ONCE so UI can render immediately.
  // Subsequent updates are handled via workers; this avoids re-doing heavy sync work on every change.
  const [snapshot, setSnapshot] = useState<LogoSnapshot>(() => {
    const grid = buildGrid({ cellSize, pattern, seed, verticalHexagons })
    const colors = generateOklchColors(
      grid.length,
      { chroma, chromaVariance, lightness, lightnessVariance },
      seed,
    )
    return { grid, colors }
  })
  const lastGoodRef = useRef<LogoSnapshot>(snapshot)

  // Generations to drop stale async results
  const gridGen = useRef(0)
  const colorGen = useRef(0)
  const gridRecomputing = useRef(false)

  // Stable objects for effects
  const gridInput = useMemo(
    () => ({ cellSize, pattern, seed, verticalHexagons }),
    [cellSize, pattern, seed, verticalHexagons],
  )
  const colorInput = useMemo(
    () => ({ chroma, chromaVariance, lightness, lightnessVariance, seed }),
    [chroma, chromaVariance, lightness, lightnessVariance, seed],
  )
  // Provide a stable event function that always reads the latest colorInput
  // without forcing the grid effect to depend on color inputs.
  const getColorInput = useEffectEvent(() => colorInput)

  // (Throttled) grid recompute handled below via scheduleGrid/runGrid
  // Keep latest grid input and snapshot in refs for throttled runners
  const gridInputRef = useRef(gridInput)
  useEffect(() => {
    gridInputRef.current = gridInput
  }, [gridInput])
  const snapshotRef = useRef(snapshot)
  useEffect(() => {
    snapshotRef.current = snapshot
  }, [snapshot])

  // Mounted flag to avoid state updates after unmount
  const mountedRef = useRef(true)
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Throttle state for grid runs
  const gridTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const gridPendingRef = useRef(false)

  // Grid runner (effect event) uses latest inputs at call time
  const runGrid = useEffectEvent(async () => {
    const myGridGen = ++gridGen.current
    gridRecomputing.current = true
    const currentGridInput = gridInputRef.current

    const gridWorker = new Worker(
      new URL('./workers/grid.worker.ts', import.meta.url),
      { type: 'module' },
    )
    const gridApi = Comlink.wrap<GridWorkerAPI>(gridWorker)
    let colorsWorker: Worker | null = null

    try {
      const newGrid = await gridApi.buildGrid(currentGridInput)
      if (myGridGen !== gridGen.current) return

      colorsWorker = new Worker(
        new URL('./workers/colors.worker.ts', import.meta.url),
        { type: 'module' },
      )
      const colorsApi = Comlink.wrap<ColorsWorkerAPI>(colorsWorker)
      const myColorGen = ++colorGen.current
      const ci = getColorInput()
      const newColors = await colorsApi.generateOklchColors(
        newGrid.length,
        {
          chroma: ci.chroma,
          chromaVariance: ci.chromaVariance,
          lightness: ci.lightness,
          lightnessVariance: ci.lightnessVariance,
        },
        ci.seed,
      )

      if (myGridGen !== gridGen.current || myColorGen !== colorGen.current)
        return

      const next = { grid: newGrid, colors: newColors }
      lastGoodRef.current = next
      if (mountedRef.current) setSnapshot(next)
    } catch (e) {
      console.error(e)
    } finally {
      gridRecomputing.current = false
      if (colorsWorker) colorsWorker.terminate()
      gridWorker.terminate()
    }
  })

  const scheduleGrid = useEffectEvent(() => {
    if (!gridTimerRef.current) {
      // Leading call
      runGrid()
      gridTimerRef.current = setTimeout(() => {
        gridTimerRef.current = null
        if (gridPendingRef.current) {
          gridPendingRef.current = false
          // Trailing call with latest inputs
          runGrid()
        }
      }, throttleMs)
    } else {
      // Within window: note there is a pending trailing run
      gridPendingRef.current = true
    }
  })

  // Effect: when grid deps change, schedule a throttled grid+colors recompute
  // biome-ignore lint/correctness/useExhaustiveDependencies: scheduleGrid is an Effect Event; do not include it
  useEffect(() => {
    scheduleGrid()
    // Only react to grid inputs; colors will be updated inside the throttled runner
  }, [gridInput])

  // (Throttled) color-only recompute handled below via scheduleColors/runColors
  // Throttle state for color-only runs
  const colorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const colorPendingRef = useRef(false)

  const runColors = useEffectEvent(async () => {
    const snap = snapshotRef.current
    if (!snap?.grid?.length) return
    if (gridRecomputing.current) return

    const myColorGen = ++colorGen.current
    const colorsWorker = new Worker(
      new URL('./workers/colors.worker.ts', import.meta.url),
      { type: 'module' },
    )
    const colorsApi = Comlink.wrap<ColorsWorkerAPI>(colorsWorker)
    try {
      const ci = getColorInput()
      const newColors = await colorsApi.generateOklchColors(
        snap.grid.length,
        {
          chroma: ci.chroma,
          chromaVariance: ci.chromaVariance,
          lightness: ci.lightness,
          lightnessVariance: ci.lightnessVariance,
        },
        ci.seed,
      )
      if (myColorGen !== colorGen.current) return
      const next = { grid: snap.grid, colors: newColors }
      lastGoodRef.current = next
      if (mountedRef.current) setSnapshot(next)
    } catch (e) {
      console.error(e)
    } finally {
      colorsWorker.terminate()
    }
  })

  const scheduleColors = useEffectEvent(() => {
    if (!snapshotRef.current?.grid?.length) return
    if (gridRecomputing.current) return
    if (!colorTimerRef.current) {
      // Leading call
      runColors()
      colorTimerRef.current = setTimeout(() => {
        colorTimerRef.current = null
        if (colorPendingRef.current) {
          colorPendingRef.current = false
          // Trailing call
          runColors()
        }
      }, throttleMs)
    } else {
      colorPendingRef.current = true
    }
  })

  // Effect: when only color deps change (and a grid run is not in-flight), schedule throttled colors-only recompute
  // biome-ignore lint/correctness/useExhaustiveDependencies: scheduleColors is an Effect Event; do not include it
  useEffect(() => {
    scheduleColors()
  }, [colorInput, snapshot?.grid])

  // Global cleanup: clear any pending timers on unmount
  useEffect(() => {
    return () => {
      if (gridTimerRef.current) clearTimeout(gridTimerRef.current)
      if (colorTimerRef.current) clearTimeout(colorTimerRef.current)
    }
  }, [])

  // Always provide the best-known consistent snapshot
  return snapshot ?? lastGoodRef.current
}
