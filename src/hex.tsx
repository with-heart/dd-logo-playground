const degToRad = (deg: number) => deg * (Math.PI / 180)

const pointsFromSize = (
  width: number,
  height: number,
): [x: number, y: number][] => {
  const [cX, cY] = [width / 2, height / 2]
  const r = Math.min(cX, cY)
  const angle = degToRad(30)

  return [
    [cX + r * Math.cos(angle), cY - r * Math.sin(angle)],
    [cX, cY - r],
    [cX - r * Math.cos(angle), cY - r * Math.sin(angle)],
    [cX - r * Math.cos(angle), cY + r * Math.sin(angle)],
    [cX, cY + r],
    [cX + r * Math.cos(angle), cY + r * Math.sin(angle)],
  ]
}

const formatPoints = (points: [x: number, y: number][]) =>
  points.map(([x, y]) => `${x},${y}`).join(' ')

export const Hex = ({ width, height }: { width: number; height: number }) => (
  <svg className="hex" viewBox={`0 0 ${width} ${height}`} fill="white">
    <title>Hexagon Shape</title>
    <polygon points={formatPoints(pointsFromSize(width, height))} />
  </svg>
)
