// Utilities for exporting the current logo as SVG or PNG

import { useCallback, useEffect, useState } from 'react'

export type ExportType = 'svg' | 'png'

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.round(kb)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

export const useExport = () => {
  const [exportType, setExportType] = useState<'svg' | 'png'>('png')
  const [exportSize, setExportSize] = useState<number>(128)
  const [estimatedBytes, setEstimatedBytes] = useState<number | null>(null)
  const [estimating, setEstimating] = useState<boolean>(false)

  const onExport = useCallback(async () => {
    if (exportType === 'svg') {
      await exportImage({ type: 'svg', filenameBase: 'logo' })
    } else {
      await exportImage({
        type: 'png',
        size: exportSize,
        filenameBase: 'logo',
      })
    }
  }, [exportType, exportSize])

  const estimation =
    estimating ? 'Estimating...'
    : estimatedBytes != null ? `Estimated size: ${formatBytes(estimatedBytes)}`
    : 'Estimated size: -'

  // Observe the current SVG (and reattach if it is replaced) and estimate size
  // when the image content or export settings change, without reacting to
  // unrelated DOM changes elsewhere.
  useEffect(() => {
    let cancelled = false
    let timeout: ReturnType<typeof setTimeout> | null = null
    const schedule = () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(async () => {
        if (cancelled) return
        setEstimating(true)
        if (exportType === 'svg') {
          const bytes = await estimateImageSize({ type: 'svg' })
          if (!cancelled) {
            setEstimatedBytes(bytes)
            setEstimating(false)
          }
          return
        }
        const bytes = await estimateImageSize({ type: 'png', size: exportSize })
        if (!cancelled) {
          setEstimatedBytes(bytes)
          setEstimating(false)
        }
      }, 150)
    }

    // Observer for the current #logo element
    let svgEl: SVGSVGElement | null = null
    let svgObserver: MutationObserver | null = null
    const attachToSvg = () => {
      const el = queryCurrentSVG()
      if (!el || el === svgEl) return
      // Detach previous observer if any
      if (svgObserver) svgObserver.disconnect()
      svgEl = el
      svgObserver = new MutationObserver(() => {
        schedule()
      })
      svgObserver.observe(svgEl, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      })
      // Estimate immediately upon attaching to a (new) SVG
      schedule()
    }

    // Attach to current SVG if present now
    attachToSvg()

    // Watch for #logo element being replaced/added later
    const bodyObserver = new MutationObserver(() => {
      attachToSvg()
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelled = true
      if (svgObserver) svgObserver.disconnect()
      bodyObserver.disconnect()
      if (timeout) clearTimeout(timeout)
    }
  }, [exportType, exportSize])

  return {
    estimation,
    onExport,
    exportType,
    setExportType,
    exportSize,
    setExportSize,
  }
}

const queryCurrentSVG = (): SVGSVGElement | null => {
  return document.querySelector('#logo') as SVGSVGElement | null
}

const ensureNamespaces = (svg: SVGSVGElement) => {
  if (!svg.getAttribute('xmlns'))
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  if (!svg.getAttribute('xmlns:xlink'))
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
}

export const serializeCurrentSVG = (): string | null => {
  const svg = queryCurrentSVG()
  if (!svg) return null
  const clone = svg.cloneNode(true) as SVGSVGElement
  ensureNamespaces(clone)
  const serializer = new XMLSerializer()
  const xml = serializer.serializeToString(clone)
  return `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`
}

const getViewBoxSize = (svg: SVGSVGElement): { w: number; h: number } => {
  const vb = svg.getAttribute('viewBox')
  if (vb) {
    const parts = vb.split(/\s+/).map(Number)
    if (parts.length === 4) return { w: parts[2], h: parts[3] }
  }
  // Fallbacks
  const w = svg.width?.baseVal?.value || 100
  const h = svg.height?.baseVal?.value || 100
  return { w, h }
}

export const estimateImageSize = async (options: {
  type: ExportType
  size?: number
}): Promise<number | null> => {
  const svg = queryCurrentSVG()
  if (!svg) return null
  const svgText = serializeCurrentSVG()
  if (!svgText) return null

  if (options.type === 'svg') {
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
    return blob.size
  }

  const size = options.size ?? 128
  const { w: vbW, h: vbH } = getViewBoxSize(svg)

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.clearRect(0, 0, size, size)

  const scale = size / Math.max(vbW, vbH)
  const destW = vbW * scale
  const destH = vbH * scale
  const dx = (size - destW) / 2
  const dy = (size - destH) / 2

  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  await new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, dx, dy, destW, destH)
      URL.revokeObjectURL(url)
      resolve()
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve()
    }
    img.src = url
  })

  const outBlob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png'),
  )
  return outBlob?.size ?? null
}

export const exportImage = async (options: {
  type: ExportType
  size?: number
  filenameBase?: string
}) => {
  const svg = queryCurrentSVG()
  if (!svg) return
  const svgText = serializeCurrentSVG()
  if (!svgText) return

  const filenameBase = options.filenameBase ?? 'logo'

  if (options.type === 'svg') {
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filenameBase}.svg`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    return
  }

  const size = options.size ?? 128
  const { w: vbW, h: vbH } = getViewBoxSize(svg)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, size, size)

  const scale = size / Math.max(vbW, vbH)
  const destW = vbW * scale
  const destH = vbH * scale
  const dx = (size - destW) / 2
  const dy = (size - destH) / 2

  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  await new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, dx, dy, destW, destH)
      URL.revokeObjectURL(url)
      resolve()
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve()
    }
    img.src = url
  })

  const outBlob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png'),
  )
  if (!outBlob) return

  const outUrl = URL.createObjectURL(outBlob)
  const a = document.createElement('a')
  a.href = outUrl
  a.download = `${filenameBase}-${size}.png`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(outUrl)
}
