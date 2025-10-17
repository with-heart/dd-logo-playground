import { randomSeed } from '@/math'
import { loadSearchParams } from '@/search-params'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { App } from './app'

export const metadata: Metadata = {
  title: 'Developer DAO Logo Playground',
  description:
    'Generate fun, colorful background patterns for the Developer DAO logo',
  icons: { icon: '/favicon.ico' },
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
