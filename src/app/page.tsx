import App from '@/app'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ensureCanonicalUrl } from './url-settings'

export const metadata: Metadata = {
  title: 'Developer DAO Logo Playground',
  description:
    'Generate fun, colorful background patterns for the Developer DAO logo',
  icons: { icon: '/favicon.ico' },
}

export default async function Page({ searchParams }: PageProps<'/'>) {
  const params = (await searchParams) ?? {}
  const canonical = ensureCanonicalUrl(params)
  if (canonical) redirect(canonical)

  return (
    <main id="root">
      <App />
    </main>
  )
}
