/**
 * 广播处理函数
 */
export type BroadcastHandler<T = unknown> = (data: T) => void

/**
 * 广播函数
 */
export type Broadcast = (type: string, data?: unknown) => void

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
