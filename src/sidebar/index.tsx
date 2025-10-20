import { RotateCcwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/use-settings'
import { ColorsSection } from './colors-section'
import { ExportsSection } from './exports-section'
import { TilingSection } from './tiling-section'

export const Sidebar = () => {
  const { regenerateImage } = useSettings()

  return (
    <>
      <header className="bg-zinc-900 border-b border-zinc-800">
        <Button size="lg" className="w-full" onClick={regenerateImage}>
          <RotateCcwIcon /> Regenerate Image
        </Button>
      </header>

      <div className="flex flex-col gap-6 overflow-y-auto">
        <TilingSection />
        <ColorsSection />
        <ExportsSection />
      </div>
    </>
  )
}
