import mitt from 'mitt'
import random from 'random'

/**
 * 从数组中随机取一元素并返回
 * @param array
 * @returns
 */
export function randomPick<T = any>(array: T[]): T {
  const index = random.int(0, array.length - 1)
  return array[index]
}

export const emitter = mitt()

export function timeFormatter(durationTime: number) {
  const minute = Math.floor(durationTime / 60)
  const second = durationTime - minute * 60
  return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
}
