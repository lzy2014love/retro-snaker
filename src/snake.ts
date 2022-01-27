import { Cell, ICell } from './cell'

export const enum DirectionEnum {
  Up = 'w',
  Down = 's',
  Left = 'a',
  Right = 'd',
}

export const directions = [DirectionEnum.Up, DirectionEnum.Down, DirectionEnum.Left, DirectionEnum.Right]

export function getReverseDirection(direction: DirectionEnum) {
  switch (direction) {
    case DirectionEnum.Up:
      return DirectionEnum.Down
    case DirectionEnum.Down:
      return DirectionEnum.Up
    case DirectionEnum.Left:
      return DirectionEnum.Right
    case DirectionEnum.Right:
      return DirectionEnum.Left
    default:
      break
  }
}

export interface ISnake {
  /**
   * 蛇的长度
   */
  get size(): number
  /**
   * 移动方向
   */
  direction: DirectionEnum
  /**
   * 蛇本身，用格子列表表示
   */
  cells: ICell[]
}

export class Snake implements ISnake {
  cells: ICell[]
  private _direction: DirectionEnum
  get size(): number {
    return this.cells.length
  }

  get direction() {
    return this._direction
  }
  set direction(newDirection: DirectionEnum) {
    if (this._direction !== newDirection && this._direction !== getReverseDirection(newDirection)) {
      this._direction = newDirection
    } else {
      console.log('================')
      console.log('this._direction  >>>>>>', this._direction)
      console.log('newDirection  >>>>>>', newDirection)
      console.log('================')
    }
  }
  constructor(cells: ICell[], direction: DirectionEnum = DirectionEnum.Right) {
    this.cells = cells
    this.direction = direction
  }
}
