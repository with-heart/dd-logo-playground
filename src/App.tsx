import './App.css'
import { Renderer } from './renderer'
import { SettingsProvider } from './settings-context'
import { Sidebar } from './sidebar'

function App() {
  return (
    <SettingsProvider>
      <Renderer />
      <Sidebar />
    </SettingsProvider>
  )
}

export default App
