import { IBoard } from './board'
import { emitter, timeFormatter } from './utils'

export const enum GameStatusEnum {
  /**
   * 准备中，游戏未开始
   */
  Ready,
  /**
   * 游戏运行中
   */
  Runing,
  /**
   * 游戏暂停中
   */
  Pausing,
  /**
   * 游戏已结束
   */
  Ended,
}

export function getGameStatusEnumName(status: GameStatusEnum) {
  const enumNameList = ['未开始', '运行中', '暂停中', '已结束']
  return enumNameList[status]
}

export interface IGame {
  /**
   * 游戏时长，单位：秒
   */
  durationTime: number
  /**
   * 得分
   */
  score: number
  /**
   * 面板
   */
  readonly board: IBoard
  /**
   * 游戏状态
   */
  status: GameStatusEnum
  init(): void
  start(): void
  end(): void
  pause(): void
}

export class Game implements IGame {
  static _timer: number
  durationTime = 0
  score = 0
  status = GameStatusEnum.Ready

  constructor(readonly board: IBoard) {}

  init(): void {
    this.render()
    emitter.on('gameover', () => {
      this.end()
    })
    emitter.on('snake.eat', () => {
      this.score++
    })
  }

  private _startTime: DOMHighResTimeStamp
  private _startTime2: DOMHighResTimeStamp

  private _rafCallback = (timestamp: DOMHighResTimeStamp) => {
    if (this.status === GameStatusEnum.Pausing || this.status === GameStatusEnum.Ended) return
    if (!this._startTime) {
      this._startTime = timestamp
      this._startTime2 = timestamp
    }
    const elapsed = timestamp - this._startTime
    const elapsed2 = timestamp - this._startTime2
    // 蛇每500毫秒运动一格
    if (elapsed >= 300) {
      this.board.run()
      this.render()
      this._startTime = timestamp
    }
    // 1秒过去
    if (elapsed2 >= 1000) {
      this.durationTime++
      this._startTime2 = timestamp
    }

    window.requestAnimationFrame(this._rafCallback)
  }

  start(): void {
    window.requestAnimationFrame(this._rafCallback)
    this.status = GameStatusEnum.Runing
  }

  end(): void {
    this._startTime = null
    this._startTime2 = null
    this.status = GameStatusEnum.Ended
    this.render()
    alert(`游戏结束，得分: ${this.score}`)
    window.location.reload()
  }

  pause(): void {
    this._startTime = null
    this._startTime2 = null
    this.status = GameStatusEnum.Pausing
    this.render()
  }

  private _renderBar() {
    const { score, durationTime } = this
    const bar = document.createElement('div')
    bar.className = 'bar'
    bar.innerHTML = `<div class="score">得分: ${score}</div><div class="score">状态: ${getGameStatusEnumName(
      this.status,
    )}</div><div class="time">时间: ${timeFormatter(durationTime)}</div>`
    return bar
  }

  render(): void {
    const appContainer = document.getElementById('app')
    const fragment = document.createDocumentFragment()
    fragment.appendChild(this.board.render())
    fragment.appendChild(this._renderBar())
    if (appContainer.hasChildNodes()) {
      appContainer.innerHTML = ''
      appContainer.appendChild(fragment)
    } else {
      appContainer.appendChild(fragment)
    }
  }
}
