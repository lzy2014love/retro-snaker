import { Food, IFood } from './food'
import { DirectionEnum, ISnake, Snake } from './snake'
import { Cell, ICell } from './cell'
import { randomPick, emitter } from './utils'

export interface IBoard {
  /**
   * 宽度或者高度，宽高一样，多少格
   */
  readonly size: number
  /**
   * 格子总数
   */
  readonly total: number
  /**
   * 所有的格子
   */
  readonly cellList: ICell[]
  /**
   * 根据新x，y获取格子
   */
  findCell(x: number, y: number): ICell
  /**
   * 被占用的格子列表
   */
  get usedCellList(): ICell[]
  /**
   * 未被占用的格子列表
   */
  get freeCellList(): ICell[]
  /**
   * 食物
   */
  food: IFood
  /**
   * 蛇
   */
  snake: ISnake
  /**
   * 生成食物
   */
  createFood(): IFood
  /**
   * 生成蛇
   */
  createSnake(): ISnake
  /**
   * 检查蛇是否能移动
   * @returns `false` 表示撞墙或者撞自己，`true` 表示能移动
   */
  checkSnakeMove(): boolean
  /**
   * 检查蛇是否吃到食物
   * @returns `true` 表示吃到食物
   */
  checkSnakeEat(): boolean
  run(): void
  render(): Node
}

export class Board implements IBoard {
  readonly size: number
  readonly total: number
  readonly cellList: ICell[]
  static _createPositionList(size: number): Cell[] {
    const list = []
    for (let y = 1; y <= size; y++) {
      for (let x = 1; x <= size; x++) {
        const position = new Cell(x, y)
        list.push(position)
      }
    }
    return list
  }
  food: IFood
  snake: ISnake

  constructor(size: number) {
    this.size = size
    this.total = size ** 2
    this.cellList = Board._createPositionList(size)
    this.snake = this.createSnake()
    this.food = this.createFood()
  }
  get usedCellList(): ICell[] {
    return this.food ? this.snake.cells.concat(this.food.cell) : this.snake.cells
  }
  get freeCellList(): ICell[] {
    const usedCellList = this.usedCellList
    const list: ICell[] = []
    for (const cell of this.cellList) {
      if (usedCellList.findIndex(val => val.equals(cell)) === -1) {
        list.push(cell)
      }
    }
    return list
  }
  findCell(x: number, y: number): ICell {
    if (x >= 1 && x <= this.size && x >= 1 && x <= this.size) {
      const index = (y - 1) * this.size + x - 1
      return this.cellList[index]
    }
    throw new Error(`参数 x，y 范围错误：x:${x} y:${y}`)
  }
  createFood(): IFood {
    const cell = randomPick(this.freeCellList)
    return new Food(cell)
  }

  run(): void {
    const result = this.checkSnakeMove()
    if (result) {
      if (this.checkSnakeEat()) {
        this.doSnakeEat()
      } else {
        this.doSnakeMove()
      }
    } else {
      emitter.emit('gameover')
    }
  }

  doSnakeEat(): void {
    const { cells, direction } = this.snake
    const head = cells[0]
    switch (direction) {
      case DirectionEnum.Down:
        cells.unshift(this.findCell(head.x, head.y + 1))
        break
      case DirectionEnum.Up:
        cells.unshift(this.findCell(head.x, head.y - 1))
        break
      case DirectionEnum.Left:
        cells.unshift(this.findCell(head.x - 1, head.y))
        break
      case DirectionEnum.Right:
        cells.unshift(this.findCell(head.x + 1, head.y))
        break
      default:
        throw new Error('未知方向')
    }
    this.food = this.createFood()
    emitter.emit('snake.eat')
  }

  doSnakeMove(): void {
    const { cells, direction } = this.snake
    const head = cells[0]
    switch (direction) {
      case DirectionEnum.Down:
        cells.unshift(this.findCell(head.x, head.y + 1))
        break
      case DirectionEnum.Up:
        cells.unshift(this.findCell(head.x, head.y - 1))
        break
      case DirectionEnum.Left:
        cells.unshift(this.findCell(head.x - 1, head.y))
        break
      case DirectionEnum.Right:
        cells.unshift(this.findCell(head.x + 1, head.y))
        break
      default:
        throw new Error('未知方向')
    }
    cells.pop()
  }

  createSnake(): ISnake {
    const index = Math.floor(this.size / 2)
    const cells: ICell[] = [
      this.findCell(index, index),
      this.findCell(index - 1, index),
      this.findCell(index - 2, index),
    ]
    return new Snake(cells)
  }

  checkSnakeMove(): boolean {
    let x: number, y: number
    const head = this.snake.cells[0]
    switch (this.snake.direction) {
      case DirectionEnum.Down:
        x = head.x
        y = head.y + 1
        if (y > this.size) return false
        if (this.snake.cells.includes(this.findCell(x, y))) return false
        break
      case DirectionEnum.Up:
        x = head.x
        y = head.y - 1
        if (y < 1) return false
        if (this.snake.cells.includes(this.findCell(x, y))) return false
        break
      case DirectionEnum.Right:
        x = head.x + 1
        y = head.y
        if (x > this.size) return false
        if (this.snake.cells.includes(this.findCell(x, y))) return false
        break
      case DirectionEnum.Left:
        x = head.x - 1
        y = head.y
        if (x < 1) return false
        if (this.snake.cells.includes(this.findCell(x, y))) return false
        break
      default:
        throw new Error('未知方向')
    }
    return true
  }

  checkSnakeEat(): boolean {
    const { cells, direction } = this.snake
    const head = cells[0]
    const foodCell = this.food.cell
    switch (direction) {
      case DirectionEnum.Down:
        if (foodCell.equals(this.findCell(head.x, head.y + 1))) return true
        break
      case DirectionEnum.Up:
        if (foodCell.equals(this.findCell(head.x, head.y - 1))) return true
        break
      case DirectionEnum.Left:
        if (foodCell.equals(this.findCell(head.x - 1, head.y))) return true
        break
      case DirectionEnum.Right:
        if (foodCell.equals(this.findCell(head.x + 1, head.y))) return true
        break
      default:
        throw new Error('未知方向')
    }
    return false
  }

  private _getCellClassName(x: number, y: number): string {
    const { food, snake } = this
    if (food.cell.equals(this.findCell(x, y))) {
      return 'food'
    }
    const [head, ...body] = snake.cells
    if (head.equals(this.findCell(x, y))) {
      return 'snake-head'
    }
    if (body.some(cell => cell.equals(this.findCell(x, y)))) {
      return 'snake-body'
    }
    return ''
  }

  render() {
    const board = document.createElement('div')
    board.className = 'board'
    for (let y = 1; y <= this.size; y++) {
      const row = document.createElement('div')
      row.classList.add('row', `row-${y}`)
      for (let x = 1; x <= this.size; x++) {
        const cell = document.createElement('div')
        cell.classList.add('cell', `cell-${x}-${y}`)
        const cellClassName = this._getCellClassName(x, y)
        if (cellClassName) {
          cell.classList.add(cellClassName)
        }
        row.appendChild(cell)
      }
      board.appendChild(row)
    }
    return board
  }
}
