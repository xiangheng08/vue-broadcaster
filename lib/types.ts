/**
 * 广播处理函数
 *
 * 泛型参数可以是单个数据类型，也可以是参数元组（如 `[string, number]`）。
 */
export type BroadcastHandler<T = unknown> = (...args: T extends unknown[] ? T : [T]) => void

/**
 * 广播函数
 */
export type Broadcast = (type: string, ...args: unknown[]) => void

/**
 * 接收广播函数
 */
export type BroadcastReceive = <T = unknown>(
  type: string,
  handler: BroadcastHandler<T>,
  options?: BroadcastReceiveOptions,
) => () => void

/**
 * 接收广播函数配置项
 */
export interface BroadcastReceiveOptions {
  /**
   * 是否只接收一次
   * @default false
   */
  once?: boolean

  /**
   * 是否排除自身
   * @default false
   */
  excludeSelf?: boolean
}
