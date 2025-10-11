import './App.css'
import { PaletteProvider } from './palette-context'
import { Renderer } from './renderer'
import { Sidebar } from './sidebar'

function App() {
  return (
    <PaletteProvider>
      <Renderer />
      <Sidebar />
    </PaletteProvider>
  )
}

export default App
