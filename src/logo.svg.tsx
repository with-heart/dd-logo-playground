import type { JSX } from 'react'
import { useId } from 'react'
import { useColorValues } from './colors.machine'
import { useSettings } from './use-settings'

const oklchToHex = (l: number, c: number, h: number): string => {
  // Convert OKLCH to hex using CSS oklch() function and canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return '#000000'

  // Use oklch CSS color
  ctx.fillStyle = `oklch(${l} ${c} ${h})`
  const color = ctx.fillStyle

  // If the browser doesn't support oklch, fallback to a simple conversion
  if (color === `oklch(${l} ${c} ${h})`) {
    // Fallback: convert to approximate RGB
    const hRad = (h * Math.PI) / 180
    const a = c * Math.cos(hRad)
    const b = c * Math.sin(hRad)

    // Simplified LAB to RGB conversion (approximate)
    const y = (l + 16) / 116
    const x = a / 500 + y
    const z = y - b / 200

    const xyz = [x, y, z].map((t) => {
      const t3 = t * t * t
      return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787
    })

    // XYZ to RGB (sRGB D65)
    let [r, g, b_val] = [
      xyz[0] * 3.2406 - xyz[1] * 1.5372 - xyz[2] * 0.4986,
      -xyz[0] * 0.9689 + xyz[1] * 1.8758 + xyz[2] * 0.0415,
      xyz[0] * 0.0557 - xyz[1] * 0.204 + xyz[2] * 1.057,
    ]

    // Gamma correction
    const gamma = (t: number) =>
      t > 0.0031308 ? 1.055 * (t ** 1 / 2.4) - 0.055 : 12.92 * t
    r = gamma(r)
    g = gamma(g)
    b_val = gamma(b_val)

    // Clamp and convert to hex
    const toHex = (n: number) =>
      Math.max(0, Math.min(255, Math.round(n * 255)))
        .toString(16)
        .padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b_val)}`
  }

  return color
}

// Helper function to generate hexagon path
const createHexagonPath = (
  cx: number,
  cy: number,
  radius: number,
  vertical: boolean = false,
): string => {
  const points: [number, number][] = []
  const angleOffset = vertical ? Math.PI / 6 : 0 // 30 degree offset for vertical orientation
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + angleOffset
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    points.push([x, y])
  }
  return (
    `M ${points[0][0]} ${points[0][1]} ` +
    points
      .slice(1)
      .map(([x, y]) => `L ${x} ${y}`)
      .join(' ') +
    ' Z'
  )
}

// Generate hexagon points for individual side rendering
const getHexagonPoints = (
  cx: number,
  cy: number,
  radius: number,
  vertical: boolean = false,
): [number, number][] => {
  const points: [number, number][] = []
  const angleOffset = vertical ? Math.PI / 6 : 0 // 30 degree offset for vertical orientation
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + angleOffset
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    points.push([x, y])
  }
  return points
}

// Create individual side paths with contextual stroke colors
const createHexagonWithOutlines = (
  hex: HexagonData,
  radius: number,
  strokeWidth: number,
  vertical: boolean = false,
): JSX.Element => {
  const points = getHexagonPoints(hex.x, hex.y, radius, vertical)
  const hexKey = `hex-${hex.x}-${hex.y}`

  return (
    <g key={hexKey}>
      {/* Fill hexagon */}
      <path
        d={createHexagonPath(hex.x, hex.y, radius, vertical)}
        fill={hex.color}
      />

      {/* Individual side strokes with contextual colors */}
      {points.map((point, i) => {
        const nextPoint = points[(i + 1) % 6]
        const neighborColor = hex.neighbors[i]

        // Calculate stroke color based on current hex and neighbor
        let strokeColor: string
        if (neighborColor) {
          // Blend the current hex color with neighbor color, then darken
          const blendedColor = blendColors(hex.color, neighborColor, 0.3)
          strokeColor = darkenColor(blendedColor, 0.4)
        } else {
          // No neighbor, just darken the current hex color
          strokeColor = darkenColor(hex.color, 0.5)
        }

        return (
          <path
            key={`${hexKey}-side-${point[0]}-${point[1]}-${nextPoint[0]}-${nextPoint[1]}`}
            d={`M ${point[0]} ${point[1]} L ${nextPoint[0]} ${nextPoint[1]}`}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
        )
      })}
    </g>
  )
}

interface HexagonData {
  x: number
  y: number
  color: string
  row: number
  col: number
  neighbors: string[] // Array of 6 neighbor colors (or empty string if no neighbor)
}

// Color utility functions
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ?
      [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0]
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

const blendColors = (
  color1: string,
  color2: string,
  ratio: number = 0.5,
): string => {
  const [r1, g1, b1] = hexToRgb(color1)
  const [r2, g2, b2] = hexToRgb(color2)

  const r = Math.round(r1 * (1 - ratio) + r2 * ratio)
  const g = Math.round(g1 * (1 - ratio) + g2 * ratio)
  const b = Math.round(b1 * (1 - ratio) + b2 * ratio)

  return rgbToHex(r, g, b)
}

const darkenColor = (color: string, factor: number = 0.3): string => {
  const [r, g, b] = hexToRgb(color)
  return rgbToHex(
    Math.round(r * (1 - factor)),
    Math.round(g * (1 - factor)),
    Math.round(b * (1 - factor)),
  )
}

// Get hexagon neighbors in clockwise order starting from top-right
const getHexagonNeighborOffsets = (col: number): Array<[number, number]> => {
  const isEvenCol = col % 2 === 0
  return isEvenCol ?
      [
        [0, 1], // top-right
        [1, 1], // right
        [1, 0], // bottom-right
        [0, -1], // bottom-left
        [-1, 0], // left
        [-1, 1], // top-left
      ]
    : [
        [1, 0], // top-right
        [1, -1], // right
        [0, -1], // bottom-right
        [0, -2], // bottom-left
        [-1, -1], // left
        [-1, 0], // top-left
      ]
}

// Helper function to generate hexagon grid with neighbor relationships
const generateHexagonGrid = (
  centerX: number,
  centerY: number,
  radius: number,
  hexRadius: number,
  colors: string[],
  vertical: boolean = false,
  isCustomOklch: boolean = false,
  oklchLightness?: number,
  oklchChroma?: number,
  oklchLightnessVariance?: number,
  oklchChromaVariance?: number,
): HexagonData[] => {
  // First pass: create hexagons with grid positions
  const hexMap = new Map<string, HexagonData>()

  // Calculate hex grid dimensions based on orientation
  let horizontalSpacing: number
  let verticalSpacing: number

  if (vertical) {
    // For vertical hexagons (pointy top), swap the spacing calculations
    const hexWidth = hexRadius * Math.sqrt(3)
    const hexHeight = hexRadius * 2
    horizontalSpacing = hexWidth
    verticalSpacing = hexHeight * 0.75
  } else {
    // For horizontal hexagons (pointy sides) - original calculation
    const hexWidth = hexRadius * 2
    const hexHeight = hexRadius * Math.sqrt(3)
    horizontalSpacing = hexWidth * 0.75
    verticalSpacing = hexHeight
  }

  // Generate grid to cover the circular area
  const gridRadius = radius + hexRadius
  const rows = Math.ceil((2 * gridRadius) / verticalSpacing)
  const cols = Math.ceil((2 * gridRadius) / horizontalSpacing)

  for (let row = -rows; row <= rows; row++) {
    for (let col = -cols; col <= cols; col++) {
      let x: number
      let y: number

      if (vertical) {
        // For vertical hexagons, offset rows instead of columns
        x =
          centerX +
          col * horizontalSpacing +
          (row % 2) * (horizontalSpacing / 2)
        y = centerY + row * verticalSpacing
      } else {
        // For horizontal hexagons - original calculation
        x = centerX + col * horizontalSpacing
        y = centerY + row * verticalSpacing + (col % 2) * (verticalSpacing / 2)
      }

      // Only include hexagons that are within or intersect the circle
      const distanceFromCenter = Math.sqrt(
        (x - centerX) ** 2 + (y - centerY) ** 2,
      )
      if (distanceFromCenter <= radius + hexRadius) {
        let hexColor: string

        if (
          isCustomOklch &&
          oklchLightness !== undefined &&
          oklchChroma !== undefined &&
          oklchLightnessVariance !== undefined &&
          oklchChromaVariance !== undefined
        ) {
          // Generate random lightness, chroma, and hue for each hexagon using base ± variance
          const randomLightness = Math.min(
            1,
            Math.max(
              0,
              oklchLightness +
                (Math.random() - 0.5) * 2 * oklchLightnessVariance,
            ),
          )
          const randomChroma = Math.min(
            0.45,
            Math.max(
              0,
              oklchChroma + (Math.random() - 0.5) * 2 * oklchChromaVariance,
            ),
          )
          const randomHue = Math.random() * 360
          hexColor = oklchToHex(randomLightness, randomChroma, randomHue)
        } else {
          // Use the traditional palette approach
          const randomColorIndex = Math.floor(Math.random() * colors.length)
          hexColor = colors[randomColorIndex]
        }

        const hex: HexagonData = {
          x,
          y,
          color: hexColor,
          row,
          col,
          neighbors: [],
        }
        hexMap.set(`${row},${col}`, hex)
      }
    }
  }

  // Second pass: populate neighbor relationships
  for (const hex of hexMap.values()) {
    const neighborOffsets = getHexagonNeighborOffsets(hex.col)
    hex.neighbors = neighborOffsets.map(([dRow, dCol]) => {
      const neighborKey = `${hex.row + dRow},${hex.col + dCol}`
      const neighbor = hexMap.get(neighborKey)
      return neighbor ? neighbor.color : ''
    })
  }

  return Array.from(hexMap.values())
}

export const Logo = () => {
  const centerX = 16.29
  const centerY = 16.685
  const circleRadius = 16.29
  const hexRadius = 1.2

  const { strokeWidth, verticalHexagons } = useSettings()
  const { chroma, chromaVariance, lightness, lightnessVariance } =
    useColorValues()

  const clipPathId = useId()

  const hexagons = generateHexagonGrid(
    centerX,
    centerY,
    circleRadius,
    hexRadius,
    [],
    verticalHexagons,
    true,
    lightness,
    chroma,
    lightnessVariance,
    chromaVariance,
  )

  return (
    <svg
      className="logo"
      viewBox="0 0 33 34"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <title>Developer DAO Logo</title>

      <defs>
        {/** Circular clipping mask */}
        <clipPath id={clipPathId}>
          <circle cx={centerX} cy={centerY} r={circleRadius} />
        </clipPath>
      </defs>

      {/** Hexagon grid background */}
      <g clipPath={`url(#${clipPathId})`}>
        {hexagons.map((hex) =>
          createHexagonWithOutlines(
            hex,
            hexRadius,
            strokeWidth,
            verticalHexagons,
          ),
        )}
      </g>

      {/** D */}
      <path
        d="M4.14163 20.9098H7.16583C10.4395 20.9098 12.3674 18.876 12.3674 15.4133C12.3674 11.9506 10.4395 10 7.16583 10H4.14163C3.42339 10 3 10.4385 3 11.187V19.7152C3 20.4713 3.42339 20.9098 4.14163 20.9098ZM5.28327 19.0197V11.8826H6.89365C8.90474 11.8826 10.0388 13.1376 10.0388 15.4209C10.0388 17.7797 8.93498 19.0197 6.89365 19.0197H5.28327Z"
        fill="black"
      />
      {/** _ */}
      <path
        d="M13.1915 23.3669H18.9148C19.4441 23.3669 19.754 23.0645 19.754 22.5428C19.754 22.0212 19.4441 21.7188 18.9148 21.7188H13.1915C12.6623 21.7188 12.3523 22.0212 12.3523 22.5428C12.3523 23.0645 12.6623 23.3669 13.1915 23.3669Z"
        fill="black"
      />
      {/** D */}
      <path
        d="M21.3493 20.9098H24.3735C27.6472 20.9098 29.5751 18.876 29.5751 15.4133C29.5751 11.9506 27.6472 10 24.3735 10H21.3493C20.631 10 20.2077 10.4385 20.2077 11.187V19.7152C20.2077 20.4713 20.631 20.9098 21.3493 20.9098ZM22.4909 19.0197V11.8826H24.1013C26.1124 11.8826 27.2465 13.1376 27.2465 15.4209C27.2465 17.7797 26.1426 19.0197 24.1013 19.0197H22.4909Z"
        fill="black"
      />
    </svg>
  )
}
