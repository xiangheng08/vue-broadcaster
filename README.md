# vue-broadcaster [![NPM Version][npm-version-image]][npm-url] [![NPM Downloads][npm-downloads-image]][npm-url]

基于 Vue3 `provide/inject` 的广播组合式 API。

## 安装

```bash
npm i vue-broadcaster
```

## 什么是 vue-broadcaster？

假设有如下组件结构：

```
Parent.vue
├── Child1.vue
└── Child2.vue
    ├── Child2-1.vue
    └── Child2-2.vue
```

假设 `Child1.vue` 和 `Child2.vue` 的数据需要请求不同的 API，而在 `Parent.vue` 中，需要在一些操作后通知 `Child1.vue` 和 `Child2.vue` 刷新数据。使用 `vue-broadcaster` 是这样的：

在 `Parent.vue` 中定义广播器：

```ts
import { useBroadcast } from 'vue-broadcaster'

const { broadcast } = useBroadcast()

const handleClick = () => {
  // 发出刷新广播
  broadcast('refresh')
}
```

在 `Child1.vue` 和 `Child2.vue` 中监听刷新广播：

```ts
import { useReceiveBroadcast } from 'vue-broadcaster'

useReceiveBroadcast('refresh', (data) => {
  // 刷新数据
  console.log('刷新数据')
})
```

这是一个基本的例子，实际应用中只要涉及类似的场景，都可以使用 `vue-broadcaster`。

## 什么是广播域？

我们知道 Vue 的 `provide` 提供数据后，在子组件和后代组件中都可以使用 `inject` 获取数据。`vue-broadcaster` 正是利用这一特点，再配合一个事件触发器，实现跨组件的广播。

还是上面那个组件结构：

```
Parent.vue
├── Child1.vue
└── Child2.vue
    ├── Child2-1.vue
    └── Child2-2.vue
```

在 `Parent.vue` 中通过 `useBroadcast` 创建广播器，再使用 `provide` 提供给子组件和后代组件，那么 `Parent.vue` 及其子组件和后代组件就组成了一个广播域。

在整个广播域中，你可以在任意组件中发出广播，通知域中所有的组件。

> [!WARNING]
> 一个广播域中不能有两个及以上 [`InjectionKey`](https://vuejs.org/api/composition-api-dependency-injection.html) 是一样广播器，不然可能会冲突。

## API

### `useBroadcast`、`useReceiveBroadcast`、`useChildBroadcast`

这三个组合式 API 是一组的，需要搭配使用。

- `useBroadcast`：创建一个广播器，可以发出广播，也可以接受广播。_注意：只能域的根组件中使用。_
- `useReceiveBroadcast`：接受广播。_注意：只能域的在子组件和后代组件中使用。_
- `useChildBroadcast`：创建一个广播发出器。_注意：只能域的在子组件和后代组件中使用。_

根组件：

```ts
import { useBroadcast } from 'vue-broadcaster'

const { broadcast, receive } = useBroadcast()

// 发出广播
broadcast('hello')
// 携带数据
broadcast('hello', { name: 'world' })

// 接受广播
const off = receive('hello', (data) => {
  console.log(data)

  // 可调用 off 停止接受广播
  off()
})
// 只接受一次
receive('hello', (data) => {}, { once: true })
// 排除当前组件实例发出的广播
receive('hello', (data) => {}, { excludeSelf: true })
```

子组件和后代组件：

```ts
import { useReceiveBroadcast, useChildBroadcast } from 'vue-broadcaster'

// 接受广播
const off = useReceiveBroadcast('hello', (data) => {
  console.log(data)

  // 可调用 off 停止接受广播
  off()
})
// 只接受一次
useReceiveBroadcast('hello', (data) => {}, { once: true })
// 排除当前组件实例发出的广播
useReceiveBroadcast('hello', (data) => {}, { excludeSelf: true })

const broadcast = useChildBroadcast()

// 发出广播
broadcast('hello')
// 携带数据
broadcast('hello', { name: 'world' })
```

### `useGlobalBroadcast`、`useGlobalReceiveBroadcast`、`useGlobalChildBroadcast`

这三个组合式 API 是前面三个组合式 API 的变种，只有使用的 [`InjectionKey`](https://vuejs.org/api/composition-api-dependency-injection.html) 与前面三个不一样，使用的方式是基本一样的，只是含义不同。

注意：`useGlobalBroadcast` 会稍有不同，推荐在 `App.vue` 中使用，这样才能确保所有组件都可以接收到广播。

`App.vue`：

```vue
<script setup>
import { useGlobalBroadcast } from 'vue-use-broadcast'

const { broadcast, receive } = useGlobalBroadcast()

// 发出广播
broadcast('hello')
// 携带数据
broadcast('hello', { name: 'world' })

// 接受广播
const off = receive('hello', (data) => {
  console.log(data)

  // 可调用 off 停止接受广播
  off()
})
// 只接受一次
receive('hello', (data) => {}, { once: true })
// 排除当前组件实例发出的广播
receive('hello', (data) => {}, { excludeSelf: true })
</script>
```

子组件和后代组件：

```ts
import { useGlobalReceiveBroadcast, useGlobalChildBroadcast } from 'vue-broadcaster'

// 接受广播
const off = useGlobalReceiveBroadcast('hello', (data) => {
  console.log(data)

  // 可调用 off 停止接受广播
  off()
})
// 只接受一次
useGlobalReceiveBroadcast('hello', (data) => {}, { once: true })
// 排除当前组件实例发出的广播
useGlobalReceiveBroadcast('hello', (data) => {}, { excludeSelf: true })

const broadcast = useGlobalChildBroadcast()

// 发出广播
broadcast('hello')
// 携带数据
broadcast('hello', { name: 'world' })
```

### `createBroadcastCompositions`

使用这个函数的可以创建一组广播组合式 API。如果你担心 [`InjectionKey`](https://vuejs.org/api/composition-api-dependency-injection.html) 的冲突，你可以使用 `createBroadcastCompositions` 创建一组广播组合式 API。

`custom-broadcaster.ts`：

```ts
import { createBroadcastCompositions } from 'vue-broadcaster'

const CUSTOM_INJECTION_KEY = Symbol('custom_broadcaster')

const { useBroadcast, useReceiveBroadcast, useChildBroadcast } = createBroadcastCompositions({
  injectionKey: CUSTOM_INJECTION_KEY,
})

export const useCustomBroadcast = useBroadcast
export const useCustomReceiveBroadcast = useReceiveBroadcast
export const useCustomChildBroadcast = useChildBroadcast
```

## 开发

```bash
git clone https://github.com/xiangheng08/vue-broadcaster.git

cd vue-broadcaster
pnpm i
pnpm dev # 启动开发服务
pnpm build # 构建
```

## License

[MIT](https://github.com/xiangheng08/vue-broadcaster/blob/HEAD/LICENSE)

[npm-url]: https://www.npmjs.com/package/vue-broadcaster
[npm-version-image]: https://badgen.net/npm/v/vue-broadcaster
[npm-downloads-image]: https://badgen.net/npm/dm/vue-broadcaster
