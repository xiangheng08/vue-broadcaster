import type { BroadcastHandler } from './types'

/**
 * 监听器组成
 */
export interface ListenerMaterial {
  handler: BroadcastHandler<any>
  once?: boolean
  excludeSelf?: boolean
  uid?: number | undefined
}

/**
 * 广播器
 */
export class Broadcaster {
  private readonly listeners = new Map<string, ListenerMaterial[]>()

  on(
    type: string,
    handler: BroadcastHandler<any>,
    once: boolean,
    excludeSelf: boolean,
    uid: number | undefined,
  ) {
    let materials = this.listeners.get(type)
    let repeated = false

    if (materials) {
      repeated = materials.some((item) => item.handler === handler)
    } else {
      materials = []
      this.listeners.set(type, materials)
    }

    // 忽略重复的监听器
    if (!repeated) {
      materials.push({ handler, once, excludeSelf, uid })
    }

    // 返回取消监听的函数
    return () => this.off(type, handler)
  }

  off(type: string, handler: BroadcastHandler<any>) {
    const materials = this.listeners.get(type)
    if (!materials) return

    const index = materials.findIndex((item) => item.handler === handler)
    if (index !== -1) {
      materials.splice(index, 1)
    }

    if (materials.length === 0) {
      this.listeners.delete(type)
    }
  }

  emit(type: string, data: unknown, uid?: number) {
    const materials = this.listeners.get(type)
    if (!materials) return

    // 复制一份 materials 避免在迭代过程中被修改
    Array.from(materials).forEach((material) => {
      try {
        if (
          material.excludeSelf &&
          uid !== void 0 &&
          material.uid !== void 0 &&
          material.uid === uid
        ) {
          // 忽略来自当前组件实例的广播
          return
        }
        material.handler(data)
      } catch (error) {
        console.error(`Error handling broadcast event "${type}":`, error)
      }
      if (material.once) {
        this.off(type, material.handler)
      }
    })
  }
}
