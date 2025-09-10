import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useBroadcast, useChildBroadcast, useReceiveBroadcast } from '../main'

const BROADCAST_TYPE = 'test-event'

// 测试根组件
const TestParent = defineComponent({
  template: '<div><slot /></div>',
  setup() {
    const received: any[] = []
    const { broadcast, receive } = useBroadcast()
    receive(BROADCAST_TYPE, (data) => {
      received.push(data)
    })
    return { received, broadcast }
  },
})

// 测试子组件1
const TestChild1 = defineComponent({
  template: '<div>Child Component 1</div>',
  setup() {
    const received: any[] = []
    useReceiveBroadcast(BROADCAST_TYPE, (data) => {
      received.push(data)
    })
    const broadcast = useChildBroadcast()
    return { received, broadcast }
  },
})

// 测试子组件2
const TestChild2 = defineComponent({
  template: '<div>Child Component 2</div>',
  setup() {
    const received: any[] = []
    useReceiveBroadcast(BROADCAST_TYPE, (data) => {
      received.push(data)
    })
    const broadcast = useChildBroadcast()
    return { received, broadcast }
  },
})

describe('Broadcast functionality', () => {
  it('should receive broadcast events', async () => {
    const DATA = 'Test Data'

    const wrapper = mount(TestParent, {
      slots: {
        default: [TestChild1, TestChild2],
      },
    })

    // 发送广播
    wrapper.vm.broadcast(BROADCAST_TYPE, DATA)
    await nextTick()

    // 验证子组件1接收到了广播
    const child1 = wrapper.findComponent(TestChild1)
    expect(child1.vm.received).toContain(DATA)

    // 验证子组件2接收到了广播
    const child2 = wrapper.findComponent(TestChild2)
    expect(child2.vm.received).toContain(DATA)

    // 验证根组件接收到了广播
    expect(wrapper.vm.received).toContain(DATA)
  })
})

describe('Child broadcast functionality', () => {
  it('should send broadcast from child component', async () => {
    const mockHandler = vi.fn()

    const Parent = defineComponent({
      template: '<div><slot /></div>',
      setup() {
        const { receive } = useBroadcast()
        receive('child-event', mockHandler)
      },
    })

    const Child = defineComponent({
      template: '<div>Child</div>',
      setup() {
        const broadcast = useChildBroadcast()
        broadcast('child-event', 'data from child')
      },
    })

    mount(Parent, {
      slots: {
        default: Child,
      },
    })

    // 验证父组件接收到了子组件发送的广播
    expect(mockHandler).toHaveBeenCalledWith('data from child')
  })
})
