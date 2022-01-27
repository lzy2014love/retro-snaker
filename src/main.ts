import { Board } from './board'
import { Game, GameStatusEnum } from './game'
import { directions } from './Snake'

function main(size = 24) {
  const board = new Board(size)
  const game = new Game(board)
  game.init()
  window.addEventListener('keyup', e => {
    const key = e.key as any
    if (key === ' ') {
      if (game.status === GameStatusEnum.Runing) {
        game.pause()
      } else {
        game.start()
      }
    } else if (directions.includes(key)) {
      board.snake.direction = key
    }
  })
}
main()
