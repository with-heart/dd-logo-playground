import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { randomSeed } from '@/math'
import { loadSearchParams } from '@/search-params'
import { App } from './app'

export async function generateMetadata({
  searchParams,
}: PageProps<'/'>): Promise<Metadata> {
  const params = await searchParams

  // Build a query string preserving array params
  const qs = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        for (const v of value) {
          if (v != null) qs.append(key, String(v))
        }
      } else if (value != null) {
        qs.set(key, String(value))
      }
    }
  }

  const ogUrl = `/api/og${qs.toString() ? `?${qs.toString()}` : ''}`

  return {
    title: 'Developer DAO Logo Playground',
    description:
      'Generate fun, colorful background patterns for the Developer DAO logo',
    icons: { icon: '/favicon.ico' },
    openGraph: {
      images: [{ url: ogUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogUrl],
    },
  }
}

export default async function Page({ searchParams }: PageProps<'/'>) {
  const params = await loadSearchParams(searchParams)

  if (!params.seed) {
    const u = new URLSearchParams()
    u.set('s', String(randomSeed()))
    redirect(`?${u.toString()}`)
  }

  return <App />
}
