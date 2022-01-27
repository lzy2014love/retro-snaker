/**
 * 格子，x 和 y 从 1 数起
 */
export interface ICell {
  readonly x: number
  readonly y: number
  /**
   * 判断格子是否是同一个
   */
  equals(cell: ICell): boolean
}

export class Cell implements ICell {
  constructor(readonly x: number, readonly y: number) {}
  equals(cell: ICell): boolean {
    return this.x === cell.x && this.y === cell.y
  }
}
