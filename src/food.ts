import { ICell } from './cell'

export interface IFood {
  readonly cell: ICell
}

export class Food implements IFood {
  constructor(readonly cell: ICell) {}
}
