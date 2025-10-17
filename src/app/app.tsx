'use client'
import { Logo } from '@/logo'
import { Sidebar } from '../sidebar'

export function App() {
  return (
    <main
      id="root"
      className="grid h-screen grid-cols-[4fr_minmax(300px,_1fr)] grid-rows-[auto_1fr_auto] gap-1 bg-zinc-700 p-2 *:bg-zinc-950"
    >
      <header className="px-4 py-2 text-center font-medium [grid-area:_header]">
        Developer DAO Logo Playground
      </header>
      <article className="@container flex items-center justify-center p-4 [grid-area:_image] *:aspect-square *:w-[75cqmin]">
        <Logo />
      </article>
      <aside className="flex flex-col overflow-y-hidden [grid-area:_sidebar] *:p-4">
        <Sidebar />
      </aside>
      <footer className="px-4 py-2 text-center font-pixel text-2xl [grid-area:_footer]">
        made with heart by{' '}
        <a
          href="https://github.com/with-heart"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          with-heart
        </a>
      </footer>
    </main>
  )
}
