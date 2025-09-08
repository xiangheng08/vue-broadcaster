export type * from './types'

import { createBroadcastCompositions } from './create'
import type { InjectionKey } from 'vue'
import type { Broadcaster } from './broadcaster'
import type { BroadcastCompositionsOptions } from './create'

const GLOBAL_INJECTION_KEY: InjectionKey<Broadcaster> = Symbol('global_broadcaster')

const broadcastCompositions = createBroadcastCompositions()

const {
  useBroadcast: useGlobalBroadcast,
  useReceiveBroadcast: useGlobalReceiveBroadcast,
  useChildBroadcast: useGlobalChildBroadcast,
} = createBroadcastCompositions({ injectionKey: GLOBAL_INJECTION_KEY })

/**
 * 广播 Composition API
 *
 * 用于向所有子组件和后代组件广播事件
 *
 * @example
 * const { broadcast, receive } = useBroadcast();
 * broadcast('type', { message: 'hello' });
 * const off = receive('type', (data) => {
 *   console.log(data)
 * })
 */
const useBroadcast = broadcastCompositions.useBroadcast

/**
 * 接收广播 Composition API
 *
 * 用于监听父级或祖先组件广播的事件
 *
 * @example
 * const off = useReceiveBroadcast('type', (data) => {
 *   console.log(data)
 * })
 */
const useReceiveBroadcast = broadcastCompositions.useReceiveBroadcast

/**
 * 子组件广播 Composition API
 *
 * 用于在子组件和后代组件中发送广播
 *
 * @example
 * const broadcast = useChildBroadcast();
 * broadcast('type', { message: 'hello' });
 */
const useChildBroadcast = broadcastCompositions.useChildBroadcast

export {
  // default
  useBroadcast,
  useReceiveBroadcast,
  useChildBroadcast,

  // global
  useGlobalBroadcast,
  useGlobalReceiveBroadcast,
  useGlobalChildBroadcast,

  // create
  createBroadcastCompositions,
}

export type { BroadcastCompositionsOptions, Broadcaster }
