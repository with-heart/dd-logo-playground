// Utilities for exporting the current logo as SVG or PNG

export type ExportType = 'svg' | 'png'

const queryCurrentSVG = (): SVGSVGElement | null => {
  return document.querySelector('.renderer svg') as SVGSVGElement | null
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
