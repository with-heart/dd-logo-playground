import { useId } from 'react'
import { deriveStroke } from './colors/stroke-utils'
import { CIRCLE_CENTER_X, CIRCLE_CENTER_Y, CIRCLE_RADIUS } from './constants'
import { useHexColors } from './use-hex-colors'
import { useHexGeometry } from './use-hex-geometry'
import { useSettings } from './use-settings'

export const Logo = () => {
  const { strokeWidth } = useSettings()
  const geometry = useHexGeometry()
  const colors = useHexColors(geometry.cells.length)
  const clipPathId = useId()

  return (
    <svg
      id="logo"
      viewBox="0 0 33 34"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <title>Developer DAO Logo</title>

      <defs>
        <clipPath id={clipPathId}>
          <circle cx={CIRCLE_CENTER_X} cy={CIRCLE_CENTER_Y} r={CIRCLE_RADIUS} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipPathId})`}>
        {geometry.cells.map((cell) => {
          const color = colors[cell.id]
          return (
            <g key={cell.id}>
              <path d={cell.path} fill={color.fill} />
              {cell.vertices.map((v, i) => {
                const next = cell.vertices[(i + 1) % 6]
                const nId = cell.neighbors[i]
                const stroke = deriveStroke(
                  color,
                  nId >= 0 ? colors[nId] : null,
                )
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
      </g>

      {/* D */}
      <path
        d="M4.14163 20.9098H7.16583C10.4395 20.9098 12.3674 18.876 12.3674 15.4133C12.3674 11.9506 10.4395 10 7.16583 10H4.14163C3.42339 10 3 10.4385 3 11.187V19.7152C3 20.4713 3.42339 20.9098 4.14163 20.9098ZM5.28327 19.0197V11.8826H6.89365C8.90474 11.8826 10.0388 13.1376 10.0388 15.4209C10.0388 17.7797 8.93498 19.0197 6.89365 19.0197H5.28327Z"
        fill="black"
      />
      {/* _ */}
      <path
        d="M13.1915 23.3669H18.9148C19.4441 23.3669 19.754 23.0645 19.754 22.5428C19.754 22.0212 19.4441 21.7188 18.9148 21.7188H13.1915C12.6623 21.7188 12.3523 22.0212 12.3523 22.5428C12.3523 23.0645 12.6623 23.3669 13.1915 23.3669Z"
        fill="black"
      />
      {/* D */}
      <path
        d="M21.3493 20.9098H24.3735C27.6472 20.9098 29.5751 18.876 29.5751 15.4133C29.5751 11.9506 27.6472 10 24.3735 10H21.3493C20.631 10 20.2077 10.4385 20.2077 11.187V19.7152C20.2077 20.4713 20.631 20.9098 21.3493 20.9098ZM22.4909 19.0197V11.8826H24.1013C26.1124 11.8826 27.2465 13.1376 27.2465 15.4209C27.2465 17.7797 26.1426 19.0197 24.1013 19.0197H22.4909Z"
        fill="black"
      />
    </svg>
  )
}
