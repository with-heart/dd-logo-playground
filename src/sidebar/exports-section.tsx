import { DownloadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useExport } from '@/exports'
import { Section } from './section'

export const ExportsSection = () => {
  const {
    estimation,
    exportSize,
    exportType,
    onExport,
    setExportSize,
    setExportType,
  } = useExport()

  return (
    <Section title="Exports">
      <div className="flex flex-col gap-2">
        <Label htmlFor="file-type">File Type</Label>
        <Select
          value={exportType}
          onValueChange={(value) => setExportType(value as 'svg' | 'png')}
        >
          <SelectTrigger id="file-type" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="svg">SVG</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {exportType !== 'svg' && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="file-size">File Size</Label>
          <Select
            value={exportSize.toString()}
            onValueChange={(value) =>
              setExportSize(parseInt(value, 10) as 64 | 128 | 256 | 512 | 1024)
            }
          >
            <SelectTrigger id="file-size" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="64">64x64</SelectItem>
              <SelectItem value="128">128x128</SelectItem>
              <SelectItem value="256">256x256</SelectItem>
              <SelectItem value="512">512x512</SelectItem>
              <SelectItem value="1024">1024x1024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div aria-live="polite">{estimation}</div>

      <Button size="sm" variant="outline" onClick={onExport}>
        <DownloadIcon />
        Export
      </Button>
    </Section>
  )
}
