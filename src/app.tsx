import './app.css'
import { Renderer } from './renderer'
import { SettingsProvider } from './settings-context'
import { Sidebar } from './sidebar'

function App() {
  return (
    <SettingsProvider>
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
    </SettingsProvider>
  )
}

export default App
