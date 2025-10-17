import { LogoSVG } from '@/logo.svg'
import { randomSeed } from '@/math'
import { loadSearchParams } from '@/search-params'
import { ImageResponse } from 'next/og'

async function loadGoogleFont(family: string, weight: number = 400) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`,
  ).then((r) => r.text())

  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)
  if (!match) throw new Error(`Failed to load ${family} weight ${weight}`)

  return fetch(match[1]).then((r) => r.arrayBuffer())
}

const colors = {
  bg: '#3f3f47',
  boxes: '#060003',
  fg: '#fcfcfc',
}

export async function GET(request: Request) {
  const settings = await loadSearchParams(request.url)
  const [inter, vt323] = await Promise.all([
    loadGoogleFont('Inter', 600),
    loadGoogleFont('VT323'),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: colors.bg,
          color: colors.fg,
        }}
        tw="flex h-full w-full flex-col items-center p-2"
      >
        <div
          style={{
            backgroundColor: colors.boxes,
            fontFamily: 'Inter',
          }}
          tw="flex w-full justify-center px-4 py-2 font-medium"
        >
          Developer DAO Logo Playground
        </div>
        <div
          style={{
            backgroundColor: colors.boxes,
          }}
          tw="mt-1 mb-1 flex w-full grow items-center justify-center"
        >
          <LogoSVG {...settings} seed={settings.seed ?? randomSeed()} />
        </div>
        <div
          style={{
            backgroundColor: colors.boxes,
            fontFamily: 'VT323',
          }}
          tw="flex w-full justify-center px-4 py-2 text-2xl"
        >
          made with heart by
          <div tw="pl-1.5 underline"> with-heart</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: inter,
          style: 'normal',
          weight: 600,
        },
        {
          name: 'VT323',
          data: vt323,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  )
}
