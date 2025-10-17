import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter, VT323 } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const vt323 = VT323({
  variable: '--font-vt323',
  subsets: ['latin'],
  weight: '400',
})

// Ensure all metadata URLs are absolute for social crawlers.
// Prefer NEXT_PUBLIC_SITE_URL; on Vercel, VERCEL_URL is available without protocol.
const domainFromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_URL ||
  'http://localhost:3000'

const siteUrl =
  domainFromEnv.startsWith('http') ? domainFromEnv : `https://${domainFromEnv}`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${vt323.variable} dark`}>
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
