import { describe, it, expect, vi } from 'vitest'
import { Broadcaster } from '../broadcaster'
import type { BroadcastHandler } from '../types'

/**
 * Broadcaster 类的单元测试
 * 测试广播器的核心功能，包括事件监听、事件触发、选项功能等
 */
describe('Broadcaster', () => {
  const broadcaster = new Broadcaster()

  /**
   * 测试 on 方法的功能
   * on 方法用于注册事件监听器
   */
  describe('on method', () => {
    it('should register a listener for a specific event type', () => {
      // 创建一个模拟处理函数
      const handler: BroadcastHandler<any> = vi.fn()
      // 注册事件监听器
      broadcaster.on('test-event', handler, false, false, undefined)

      // 触发事件
      broadcaster.emit('test-event', 'test data')

      // 验证处理函数被正确调用
      expect(handler).toHaveBeenCalledWith('test data')
    })

    it('should not register duplicate handlers for the same event type', () => {
      // 创建一个模拟处理函数
      const handler: BroadcastHandler<any> = vi.fn()
      // 尝试两次注册相同的处理函数
      broadcaster.on('test-event', handler, false, false, undefined)
      broadcaster.on('test-event', handler, false, false, undefined)

      // 触发事件
      broadcaster.emit('test-event', 'test data')

      // 验证处理函数只被调用一次
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  /**
   * 测试 off 方法的功能
   * off 方法用于移除事件监听器
   */
  describe('off method', () => {
    it('should remove a specific handler for an event type', () => {
      // 创建两个处理函数
      const handler1: BroadcastHandler<any> = vi.fn()
      const handler2: BroadcastHandler<any> = vi.fn()

      // 注册两个处理函数
      broadcaster.on('test-event', handler1, false, false, undefined)
      broadcaster.on('test-event', handler2, false, false, undefined)

      // 移除第一个处理函数
      broadcaster.off('test-event', handler1)

      // 触发事件
      broadcaster.emit('test-event', 'test data')

      // 验证第一个处理函数未被调用，第二个处理函数被调用
      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).toHaveBeenCalledWith('test data')
    })

    it('should remove event type when no handlers left', () => {
      // 创建一个处理函数
      const handler: BroadcastHandler<any> = vi.fn()

      // 注册并移除处理函数
      broadcaster.on('test-event', handler, false, false, undefined)
      broadcaster.off('test-event', handler)

      // 触发事件
      broadcaster.emit('test-event', 'test data')

      // 验证处理函数未被调用
      expect(handler).not.toHaveBeenCalled()
    })
  })

  /**
   * 测试 emit 方法的功能
   * emit 方法用于触发事件
   */
  describe('emit method', () => {
    it('should call all handlers registered for an event type', () => {
      // 创建两个处理函数
      const handler1: BroadcastHandler<any> = vi.fn()
      const handler2: BroadcastHandler<any> = vi.fn()

      // 注册两个处理函数
      broadcaster.on('test-event', handler1, false, false, undefined)
      broadcaster.on('test-event', handler2, false, false, undefined)

      // 触发事件
      broadcaster.emit('test-event', 'test data')

      // 验证两个处理函数都被调用
      expect(handler1).toHaveBeenCalledWith('test data')
      expect(handler2).toHaveBeenCalledWith('test data')
    })

    it('should pass correct data to handlers', () => {
      // 创建一个处理函数
      const handler: BroadcastHandler<any> = vi.fn()
      // 注册处理函数
      broadcaster.on('test-event', handler, false, false, undefined)

      // 触发事件并传递数据
      broadcaster.emit('test-event', { message: 'hello' })

      // 验证处理函数接收到了正确的数据
      expect(handler).toHaveBeenCalledWith({ message: 'hello' })
    })

    it('should not call handlers for other event types', () => {
      // 创建一个处理函数
      const handler: BroadcastHandler<any> = vi.fn()
      // 注册处理函数
      broadcaster.on('test-event', handler, false, false, undefined)

      // 触发其他类型的事件
      broadcaster.emit('other-event', 'test data')

      // 验证处理函数未被调用
      expect(handler).not.toHaveBeenCalled()
    })
  })

  /**
   * 测试 once 选项的功能
   * once 为 true 时，处理函数只应被调用一次
   */
  describe('once option', () => {
    it('should automatically remove handler after first call when once is true', () => {
      // 创建一个处理函数
      const handler: BroadcastHandler<any> = vi.fn()
      // 注册只调用一次的处理函数
      broadcaster.on('test-event', handler, true, false, undefined)

      // 多次触发事件
      broadcaster.emit('test-event', 'first')
      broadcaster.emit('test-event', 'second')

      // 验证处理函数只被调用一次，并且是第一次触发时的数据
      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith('first')
    })
  })

  /**
   * 测试 excludeSelf 选项的功能
   * excludeSelf 为 true 时，应该排除来自相同 uid 的事件
   */
  describe('excludeSelf option', () => {
    it('should not call handler when excludeSelf is true and uid matches', () => {
      // 创建一个处理函数
      const handler: BroadcastHandler<any> = vi.fn()
      const uid = 123
      // 注册处理函数，启用 excludeSelf 选项
      broadcaster.on('test-event', handler, false, true, uid)

      // 使用相同 uid 触发事件
      broadcaster.emit('test-event', 'test data', uid)

      // 验证处理函数未被调用
      expect(handler).not.toHaveBeenCalled()
    })

    it('should call handler when excludeSelf is true but uid does not match', () => {
      // 创建一个处理函数
      const handler: BroadcastHandler<any> = vi.fn()
      const listenerUid = 123
      const emitterUid = 456
      // 注册处理函数，启用 excludeSelf 选项
      broadcaster.on('test-event', handler, false, true, listenerUid)

      // 使用不同 uid 触发事件
      broadcaster.emit('test-event', 'test data', emitterUid)

      // 验证处理函数被调用
      expect(handler).toHaveBeenCalledWith('test data')
    })

    it('should call handler when excludeSelf is false even if uid matches', () => {
      // 创建一个处理函数
      const handler: BroadcastHandler<any> = vi.fn()
      const uid = 123
      // 注册处理函数，禁用 excludeSelf 选项
      broadcaster.on('test-event', handler, false, false, uid)

      // 使用相同 uid 触发事件
      broadcaster.emit('test-event', 'test data', uid)

      // 验证处理函数被调用
      expect(handler).toHaveBeenCalledWith('test data')
    })
  })

  /**
   * 测试错误处理功能
   * 当某个处理函数抛出异常时，不应影响其他处理函数的执行
   */
  describe('error handling', () => {
    it('should continue calling other handlers even if one throws an error', () => {
      // 创建一个会抛出异常的处理函数
      const errorHandler: BroadcastHandler<any> = () => {
        throw new Error('Test error')
      }
      // 创建一个正常的处理函数
      const normalHandler: BroadcastHandler<any> = vi.fn()

      // 注册两个处理函数
      broadcaster.on('test-event', errorHandler, false, false, undefined)
      broadcaster.on('test-event', normalHandler, false, false, undefined)

      // 触发事件
      broadcaster.emit('test-event', 'test data')

      // 验证正常处理函数仍被调用
      expect(normalHandler).toHaveBeenCalledWith('test data')
    })
  })
})
