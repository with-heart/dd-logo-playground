export interface Cell {
  id: number
  path: string
  vertices: [number, number][]
  neighbors: number[]
}

export type Grid<C extends Cell = Cell> = C[]
