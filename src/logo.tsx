import type { CSSProperties } from 'react'
import { deriveStroke } from './colors/stroke-utils'
import { LogoBase } from './logo.base'
import { useHexColors } from './use-hex-colors'
import { useHexGeometry } from './use-hex-geometry'
import { useSettings } from './use-settings'

export const Logo = ({ style }: { style?: CSSProperties }) => {
  const { strokeWidth } = useSettings()
  const geometry = useHexGeometry()
  const colors = useHexColors(geometry.cells.length)

  return (
    <LogoBase style={style}>
      {geometry.cells.map((cell) => {
        const color = colors[cell.id]
        return (
          <g key={cell.id}>
            <path d={cell.path} fill={color.fill} />
            {cell.vertices.map((v, i) => {
              const next = cell.vertices[(i + 1) % 6]
              const nId = cell.neighbors[i]
              const stroke = deriveStroke(color, nId >= 0 ? colors[nId] : null)
              return (
                <path
                  key={`${cell.id}-${i}`}
                  d={`M ${v[0]} ${v[1]} L ${next[0]} ${next[1]}`}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  fill="none"
                />
              )
            })}
          </g>
        )
      })}
    </LogoBase>
  )
}
