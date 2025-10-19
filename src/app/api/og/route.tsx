import { generateOklchColors } from '@/colors/generate-colors'
import { oklchToRgb } from '@/colors/oklch-to-rgb'
import { deriveStrokeRgb } from '@/colors/stroke-utils'
import { CIRCLE_CENTER_X, CIRCLE_CENTER_Y, CIRCLE_RADIUS } from '@/constants'
import { buildHexGrid } from '@/geometry/build-hex-grid'
import { LogoBase } from '@/logo.base'
import { mulberry32, randomSeed } from '@/math'
import { loadSearchParams } from '@/search-params'
import type { SettingsProperties } from '@/use-settings'
import { ImageResponse } from 'next/og'

const colors = {
  bg: '#3f3f47',
  boxes: '#060003',
}

const logoStyle = {
  width: '600px',
  height: '600px',
}

const Logo = ({
  chroma,
  chromaVariance,
  lightness,
  lightnessVariance,
  seed,
  verticalHexagons,
  strokeWidth,
}: SettingsProperties) => {
  const geometry = buildHexGrid({
    centerX: CIRCLE_CENTER_X,
    centerY: CIRCLE_CENTER_Y,
    circleRadius: CIRCLE_RADIUS,
    hexRadius: 1.2,
    vertical: verticalHexagons,
  })
  const rng = mulberry32(seed || 1)
  const colors = generateOklchColors(
    geometry.cells.length,
    {
      lightness,
      chroma,
      lightnessVariance,
      chromaVariance,
    },
    rng,
  )

  return (
    <LogoBase style={logoStyle}>
      {geometry.cells.map((cell) => {
        const color = colors[cell.id]
        return (
          <g key={cell.id}>
            <path d={cell.path} fill={oklchToRgb(color).fill} />
            {cell.vertices.map((v, i) => {
              const next = cell.vertices[(i + 1) % 6]
              const nId = cell.neighbors[i]
              const stroke = deriveStrokeRgb(
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
    </LogoBase>
  )
}

export async function GET(request: Request) {
  const settings = await loadSearchParams(request.url)

  return new ImageResponse(
    (
      <div
        style={{ backgroundColor: colors.bg }}
        tw="flex h-full w-full flex-col items-center p-2"
      >
        <div
          style={{ backgroundColor: colors.boxes }}
          tw="flex w-full grow items-center justify-center"
        >
          <Logo {...settings} seed={settings.seed ?? randomSeed()} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
