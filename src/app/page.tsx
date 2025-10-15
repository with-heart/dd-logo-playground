import type { Metadata } from 'next'
import { Client } from './client'

export const metadata: Metadata = {
  title: 'Developer DAO Logo Playground',
  description:
    'Generate fun, colorful background patterns for the Developer DAO logo',
  icons: { icon: '/favicon.ico' },
}

export default function Page() {
  return (
    <main id="root">
      <Client />
    </main>
  )
}
