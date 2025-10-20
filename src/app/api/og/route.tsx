import { ImageResponse } from 'next/og'
import { Logo } from '@/logo/server'
import { randomSeed } from '@/math'
import { loadSearchParams } from '@/search-params'

const logoStyle = {
  width: '550px',
  height: '550px',
}

export async function GET(request: Request) {
  const settings = await loadSearchParams(request.url)

  return new ImageResponse(
    <div
      style={{ backgroundColor: '#060003' }}
      tw="flex h-full w-full flex-col items-center justify-center"
    >
      <Logo
        settings={{ ...settings, seed: settings.seed ?? randomSeed() }}
        style={logoStyle}
      />
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
