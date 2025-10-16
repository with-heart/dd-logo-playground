'use client'
import { Renderer } from '../renderer'
import { Sidebar } from '../sidebar'

export function App() {
  return (
    <>
      <header className="header">Developer DAO Logo Playground</header>
      <Renderer />
      <Sidebar />
      <footer className="footer font-pixel text-center">
        made with heart by{' '}
        <a
          href="https://github.com/with-heart"
          target="_blank"
          rel="noopener noreferrer"
        >
          with-heart
        </a>
      </footer>
    </>
  )
}

export default App
