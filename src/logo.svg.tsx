import { useId } from 'react'
import { usePalette } from './use-palette'

// Helper function to generate hexagon path
const createHexagonPath = (cx: number, cy: number, radius: number): string => {
  const points: [number, number][] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
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

// Helper function to generate hexagon grid coordinates
const generateHexagonGrid = (
  centerX: number,
  centerY: number,
  radius: number,
  hexRadius: number,
  colors: string[],
): Array<{ x: number; y: number; color: string }> => {
  const hexagons: Array<{ x: number; y: number; color: string }> = []

  // Calculate hex grid dimensions
  const hexWidth = hexRadius * 2
  const hexHeight = hexRadius * Math.sqrt(3)
  const horizontalSpacing = hexWidth * 0.75
  const verticalSpacing = hexHeight

  // Generate grid to cover the circular area
  const gridRadius = radius + hexRadius
  const rows = Math.ceil((2 * gridRadius) / verticalSpacing)
  const cols = Math.ceil((2 * gridRadius) / horizontalSpacing)

  for (let row = -rows; row <= rows; row++) {
    for (let col = -cols; col <= cols; col++) {
      const x = centerX + col * horizontalSpacing
      const y =
        centerY + row * verticalSpacing + (col % 2) * (verticalSpacing / 2)

      // Only include hexagons that are within or intersect the circle
      const distanceFromCenter = Math.sqrt(
        (x - centerX) ** 2 + (y - centerY) ** 2,
      )
      if (distanceFromCenter <= radius + hexRadius) {
        const randomColorIndex = Math.floor(Math.random() * colors.length)
        hexagons.push({
          x,
          y,
          color: colors[randomColorIndex],
        })
      }
    }
  }

  return hexagons
}

export const Logo = () => {
  const centerX = 16.29
  const centerY = 16.685
  const circleRadius = 16.29
  const hexRadius = 1.2

  const { activePalette } = usePalette()
  const clipPathId = useId()
  const hexagons = generateHexagonGrid(
    centerX,
    centerY,
    circleRadius,
    hexRadius,
    activePalette.colors,
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
        {hexagons.map((hex) => (
          <path
            key={`hex-${hex.x}-${hex.y}`}
            d={createHexagonPath(hex.x, hex.y, hexRadius)}
            fill={hex.color}
            opacity="0.8"
          />
        ))}
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
