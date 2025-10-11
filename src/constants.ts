export interface ColorPalette {
  name: string
  colors: string[]
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: 'Vibrant',
    colors: [
      '#FF6B6B', // Red-pink
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#96CEB4', // Mint green
      '#FFEAA7', // Yellow
      '#DDA0DD', // Plum
      '#98D8C8', // Light teal
      '#F7DC6F', // Light yellow
      '#BB8FCE', // Light purple
      '#85C1E9', // Light blue
    ],
  },
  {
    name: 'Ocean',
    colors: [
      '#006994', // Deep blue
      '#13A8A8', // Teal
      '#36CFC9', // Cyan
      '#5CDBD3', // Light cyan
      '#87E8DE', // Lighter cyan
      '#B5F5EC', // Very light cyan
      '#0050B3', // Navy blue
      '#096DD9', // Blue
      '#40A9FF', // Light blue
      '#69C0FF', // Lighter blue
    ],
  },
  {
    name: 'Sunset',
    colors: [
      '#FF4D4F', // Red
      '#FF7A45', // Orange-red
      '#FFA940', // Orange
      '#FFD666', // Yellow-orange
      '#FADB14', // Yellow
      '#F759AB', // Pink
      '#AD4E00', // Brown
      '#D4380D', // Red-orange
      '#FA8C16', // Orange
      '#FAAD14', // Golden yellow
    ],
  },
  {
    name: 'Forest',
    colors: [
      '#135200', // Deep green
      '#389E0D', // Green
      '#52C41A', // Light green
      '#73D13D', // Lime green
      '#95DE64', // Light lime
      '#B7EB8F', // Very light green
      '#237804', // Forest green
      '#52C41A', // Bright green
      '#73D13D', // Spring green
      '#95DE64', // Pale green
    ],
  },
  {
    name: 'Purple Rain',
    colors: [
      '#391085', // Deep purple
      '#531DAB', // Purple
      '#722ED1', // Medium purple
      '#9254DE', // Light purple
      '#B37FEB', // Lighter purple
      '#D3ADF7', // Very light purple
      '#10239E', // Indigo
      '#1890FF', // Blue
      '#40A9FF', // Light blue
      '#69C0FF', // Pale blue
    ],
  },
  {
    name: 'Grayscale',
    colors: [
      '#000000', // Black
      '#262626', // Very dark gray
      '#434343', // Dark gray
      '#595959', // Medium gray
      '#8C8C8C', // Gray
      '#BFBFBF', // Light gray
      '#D9D9D9', // Very light gray
      '#F0F0F0', // Off white
      '#FAFAFA', // Almost white
      '#FFFFFF', // White
    ],
  },
]

// Default palette for backward compatibility
export const COLORS = COLOR_PALETTES[0].colors
