import * as Comlink from 'comlink'
import { useEffect, useMemo, useRef, useState } from 'react'
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
export const useLogoModel = (): LogoSnapshot => {
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

  // Build an initial, consistent snapshot synchronously so UI can render immediately
  const initialSnapshot = useMemo<LogoSnapshot>(() => {
    const grid = buildGrid({ cellSize, pattern, seed, verticalHexagons })
    const colors = generateOklchColors(
      grid.length,
      { chroma, chromaVariance, lightness, lightnessVariance },
      seed,
    )
    return { grid, colors }
    // Intentionally include all inputs: this only seeds initial state; workers will take over updates.
  }, [
    cellSize,
    pattern,
    seed,
    verticalHexagons,
    chroma,
    chromaVariance,
    lightness,
    lightnessVariance,
  ])

  const [snapshot, setSnapshot] = useState<LogoSnapshot>(initialSnapshot)
  const lastGoodRef = useRef<LogoSnapshot>(initialSnapshot)

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

  // Keep latest color base values in a ref so grid effect can pick up latest
  // values without depending on them (avoids unnecessary grid recomputes)
  const colorInputRef = useRef(colorInput)
  useEffect(() => {
    colorInputRef.current = colorInput
  }, [colorInput])

  // Effect: when grid deps change, recompute grid, then colors sized to that grid, then commit atomically
  useEffect(() => {
    let cancelled = false
    const myGridGen = ++gridGen.current
    gridRecomputing.current = true

    const gridWorker = new Worker(
      new URL('./workers/grid.worker.ts', import.meta.url),
      { type: 'module' },
    )
    const gridApi = Comlink.wrap<GridWorkerAPI>(gridWorker)

    ;(async () => {
      try {
        const newGrid = await gridApi.buildGrid(gridInput)
        if (cancelled || myGridGen !== gridGen.current) return

        const colorsWorker = new Worker(
          new URL('./workers/colors.worker.ts', import.meta.url),
          { type: 'module' },
        )
        const colorsApi = Comlink.wrap<ColorsWorkerAPI>(colorsWorker)
        const myColorGen = ++colorGen.current
        const colorInput = colorInputRef.current
        const newColors = await colorsApi.generateOklchColors(
          newGrid.length,
          {
            chroma: colorInput.chroma,
            chromaVariance: colorInput.chromaVariance,
            lightness: colorInput.lightness,
            lightnessVariance: colorInput.lightnessVariance,
          },
          colorInput.seed,
        )
        colorsWorker.terminate()

        if (
          cancelled ||
          myGridGen !== gridGen.current ||
          myColorGen !== colorGen.current
        )
          return

        const next = { grid: newGrid, colors: newColors }
        lastGoodRef.current = next
        setSnapshot(next)
      } catch (e) {
        // Ignore; keep last good snapshot
        console.error(e)
      } finally {
        gridRecomputing.current = false
        gridWorker.terminate()
      }
    })()

    return () => {
      cancelled = true
      gridWorker.terminate()
    }
    // Only react to grid inputs; colors will be updated by a separate effect if they change independently
  }, [gridInput])

  // Effect: when only color deps change, recompute colors for current grid length and commit colors-only
  useEffect(() => {
    if (!snapshot?.grid?.length) return
    // If a grid recompute is in-flight, let the grid effect commit both together
    if (gridRecomputing.current) return

    let cancelled = false
    const myColorGen = ++colorGen.current
    const colorsWorker = new Worker(
      new URL('./workers/colors.worker.ts', import.meta.url),
      { type: 'module' },
    )
    const colorsApi = Comlink.wrap<ColorsWorkerAPI>(colorsWorker)

    ;(async () => {
      try {
        const newColors = await colorsApi.generateOklchColors(
          snapshot.grid.length,
          {
            chroma: colorInput.chroma,
            chromaVariance: colorInput.chromaVariance,
            lightness: colorInput.lightness,
            lightnessVariance: colorInput.lightnessVariance,
          },
          colorInput.seed,
        )
        if (cancelled || myColorGen !== colorGen.current) return
        const next = { grid: snapshot.grid, colors: newColors }
        lastGoodRef.current = next
        setSnapshot(next)
      } catch (e) {
        // Ignore; keep last good snapshot
        console.error(e)
      } finally {
        colorsWorker.terminate()
      }
    })()

    return () => {
      cancelled = true
      colorsWorker.terminate()
    }
  }, [colorInput, snapshot?.grid])

  // Always provide the best-known consistent snapshot
  return snapshot ?? lastGoodRef.current
}
