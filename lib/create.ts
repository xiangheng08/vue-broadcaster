import { Broadcaster } from './broadcaster'
import { getCurrentInstance, provide, inject, onUnmounted } from 'vue'
import type { InjectionKey } from 'vue'
import type { Broadcast, BroadcastReceive } from './types'

const DEFAULT_INJECTION_KEY: InjectionKey<Broadcaster> = Symbol('broadcaster')

/**
 * 创建广播 Composition API 选项
 */
export interface BroadcastCompositionsOptions {
  injectionKey?: InjectionKey<Broadcaster>
}

/**
 * 创建广播 Composition API
 */
export const createBroadcastCompositions = (options?: BroadcastCompositionsOptions) => {
  const { injectionKey = DEFAULT_INJECTION_KEY } = options || {}

  const useBroadcast = (): {
    broadcast: Broadcast
    receive: BroadcastReceive
  } => {
    const instance = getCurrentInstance()
    const uid = instance ? instance.uid : void 0

    // 创建广播器实例
    const broadcaster = new Broadcaster()

    // 提供广播器给子组件
    provide(injectionKey, broadcaster)

    // 创建一个 offs 数组，用于存储移除监听器的函数
    const offs: Array<() => void> = []

    onUnmounted(() => {
      // 组件卸载时移除所有监听器
      offs.forEach((fn) => fn())
    })

    // 广播函数
    const broadcast: Broadcast = (type, data) => {
      return broadcaster.emit(type, data, uid)
    }

    // 接收广播函数
    const receive: BroadcastReceive = (type, handler, options) => {
      const { once = false, excludeSelf = false } = options || {}

      if (excludeSelf && uid === void 0) {
        uidWarning()
      }

      offs.push(() => broadcaster.off(type, handler))
      return broadcaster.on(type, handler, once, excludeSelf, uid)
    }

    return { broadcast, receive }
  }

  const useReceiveBroadcast: BroadcastReceive = (type, handler, options) => {
    const { once = false, excludeSelf = false } = options || {}

    const instance = getCurrentInstance()
    const uid = instance ? instance.uid : void 0

    if (excludeSelf && uid === void 0) {
      uidWarning()
    }

    // 获取父级广播器
    const broadcaster = inject(injectionKey, null)

    if (!broadcaster) {
      console.warn(`No broadcast provider found for event type "${type}"`)
      return () => {}
    }

    // 组件卸载时自动移除监听器
    onUnmounted(() => {
      broadcaster.off(type, handler)
    })

    // 注册监听器
    return broadcaster.on(type, handler, once, excludeSelf, uid)
  }

  const useChildBroadcast = (): Broadcast => {
    const instance = getCurrentInstance()
    const uid = instance ? instance.uid : void 0

    if (uid === void 0) {
      uidWarning()
    }

    const broadcast = inject(injectionKey)

    if (!broadcast) {
      console.warn(`No broadcast provider found`)
    }

    const childBroadcast = (type: string, data?: unknown) => {
      if (!broadcast) return
      broadcast.emit(type, data, uid)
    }

    return childBroadcast
  }

  return {
    useBroadcast,
    useReceiveBroadcast,
    useChildBroadcast,
  }
}

const uidWarning = () => {
  console.warn('Failed to obtain uid, excludeSelf option is invalid')
}
