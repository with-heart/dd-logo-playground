import dynamic from 'next/dynamic'
import { Inter, VT323 } from 'next/font/google'
import Head from 'next/head'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const vt323 = VT323({
  variable: '--font-vt323',
  subsets: ['latin'],
  weight: '400',
})

const App = dynamic(() => import('@/app'), { ssr: false })

export default function Home() {
  return (
    <>
      <Head>
        <title>Developer DAO Logo Playground</title>
        <meta
          name="description"
          content="Generate fun, colorful background patterns for the Developer DAO logo"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`${inter.variable} ${vt323.variable}`}>
        <main id="root">
          <App />
        </main>
      </div>
    </>
  )
}
