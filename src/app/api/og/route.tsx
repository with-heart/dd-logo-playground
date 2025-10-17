import { LogoSVG } from '@/logo.svg'
import { randomSeed } from '@/math'
import { loadSearchParams } from '@/search-params'
import { ImageResponse } from 'next/og'

const colors = {
  bg: '#3f3f47',
  boxes: '#060003',
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
          <LogoSVG {...settings} seed={settings.seed ?? randomSeed()} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
