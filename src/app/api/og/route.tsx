import { ImageResponse } from 'next/og'
import { Logo } from '@/logo/server'
import { randomSeed } from '@/math'
import { loadSearchParams } from '@/search-params'

const colors = {
  bg: '#3f3f47',
  boxes: '#060003',
}

const logoStyle = {
  width: '600px',
  height: '600px',
}

export async function GET(request: Request) {
  const settings = await loadSearchParams(request.url)

  return new ImageResponse(
    <div
      style={{ backgroundColor: colors.bg }}
      tw="flex h-full w-full flex-col items-center p-2"
    >
      <div
        style={{ backgroundColor: colors.boxes }}
        tw="flex w-full grow items-center justify-center"
      >
        <Logo
          settings={{ ...settings, seed: settings.seed ?? randomSeed() }}
          style={logoStyle}
        />
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
