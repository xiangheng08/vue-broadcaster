# vue-broadcaster [![NPM Version][npm-version-image]][npm-url] [![NPM Downloads][npm-downloads-image]][npm-url]

A Vue3 `provide/inject` based broadcast Composition API.

English | [中文](https://github.com/xiangheng08/vue-broadcaster/blob/HEAD/README.md)

> [!TIP]
> Translated by [Lingma](https://lingma.aliyun.com/). If you find any errors, please [submit an issue](https://github.com/xiangheng08/vue-broadcaster/issues)

## Features

- Lightweight, no third-party dependencies except Vue3, build output < 4KB
- Easy to use, no complex configuration required, plug and play
- Customizable [`InjectionKey`](https://vuejs.org/api/composition-api-dependency-injection.html)

## Installation

```bash
npm i vue-broadcaster
```

## What is vue-broadcaster?

Suppose we have the following component structure:

```
Parent.vue
├── Child1.vue
└── Child2.vue
    ├── Child2-1.vue
    └── Child2-2.vue
```

Suppose `Child1.vue` and `Child2.vue` need to request different APIs for their data, and in `Parent.vue`, after some operations, we need to notify `Child1.vue` and `Child2.vue` to refresh their data. Using `vue-broadcaster` looks like this:

Define broadcaster in `Parent.vue`:

```ts
import { useBroadcast } from 'vue-broadcaster'

const { broadcast } = useBroadcast()

const handleClick = () => {
  // Emit refresh broadcast
  broadcast('refresh')
}
```

Listen to refresh broadcast in `Child1.vue` and `Child2.vue`:

```ts
import { useReceiveBroadcast } from 'vue-broadcaster'

useReceiveBroadcast('refresh', (data) => {
  // Refresh data
  console.log('Refresh data')
})
```

This is a basic example. In real applications, `vue-broadcaster` can be used in any similar scenarios.

## What is a broadcast domain?

We know that after Vue's `provide` provides data, `inject` can be used to retrieve data in child and descendant components. `vue-broadcaster` utilizes this feature along with an event emitter to implement cross-component broadcasting.

Still using the same component structure:

```
Parent.vue
├── Child1.vue
└── Child2.vue
    ├── Child2-1.vue
    └── Child2-2.vue
```

In `Parent.vue`, create a broadcaster using `useBroadcast`, then provide it to child and descendant components using `provide`. Then `Parent.vue` and its child and descendant components form a broadcast domain.

Within the entire broadcast domain, you can emit broadcasts from any component to notify all components in the domain.

> [!WARNING]
> A broadcast domain cannot have two or more broadcasters with the same [`InjectionKey`](https://vuejs.org/api/composition-api-dependency-injection.html), otherwise conflicts may occur.

## API

### `useBroadcast`, `useReceiveBroadcast`, `useChildBroadcast`

These three Composition APIs work as a group and need to be used together.

- `useBroadcast`: Creates a broadcaster that can emit and receive broadcasts. _Note: Can only be used in the root component of a domain._
- `useReceiveBroadcast`: Receives broadcasts. _Note: Can only be used in child and descendant components of a domain._
- `useChildBroadcast`: Receives the broadcaster from the root component of a domain and returns a broadcast emitter. _Note: Can only be used in child and descendant components of a domain._

Root component:

```ts
import { useBroadcast } from 'vue-broadcaster'

const { broadcast, receive } = useBroadcast()

// Emit broadcast
broadcast('hello')
// With data
broadcast('hello', { name: 'world' })

// Receive broadcast
const off = receive('hello', (data) => {
  console.log(data)

  // Call off to stop receiving broadcasts
  off()
})
// Receive only once
receive('hello', (data) => {}, { once: true })
// Exclude broadcasts emitted by the current component instance
receive('hello', (data) => {}, { excludeSelf: true })
```

Child and descendant components:

```ts
import { useReceiveBroadcast, useChildBroadcast } from 'vue-broadcaster'

// Receive broadcast
const off = useReceiveBroadcast('hello', (data) => {
  console.log(data)

  // Call off to stop receiving broadcasts
  off()
})
// Receive only once
useReceiveBroadcast('hello', (data) => {}, { once: true })
// Exclude broadcasts emitted by the current component instance
useReceiveBroadcast('hello', (data) => {}, { excludeSelf: true })

const broadcast = useChildBroadcast()

// Emit broadcast
broadcast('hello')
// With data
broadcast('hello', { name: 'world' })
```

### `useGlobalBroadcast`, `useGlobalReceiveBroadcast`, `useGlobalChildBroadcast`

These three Composition APIs are variants of the previous three, only differing in the [`InjectionKey`](https://vuejs.org/api/composition-api-dependency-injection.html) used. The usage is basically the same, but with different meanings.

Note: `useGlobalBroadcast` is slightly different and is recommended to be used in `App.vue` to ensure all components can receive broadcasts.

`App.vue`:

```vue
<script setup>
import { useGlobalBroadcast } from 'vue-broadcaster'

const { broadcast, receive } = useGlobalBroadcast()

// Emit broadcast
broadcast('hello')
// With data
broadcast('hello', { name: 'world' })

// Receive broadcast
const off = receive('hello', (data) => {
  console.log(data)

  // Call off to stop receiving broadcasts
  off()
})
// Receive only once
receive('hello', (data) => {}, { once: true })
// Exclude broadcasts emitted by the current component instance
receive('hello', (data) => {}, { excludeSelf: true })
</script>
```

Child and descendant components:

```ts
import { useGlobalReceiveBroadcast, useGlobalChildBroadcast } from 'vue-broadcaster'

// Receive broadcast
const off = useGlobalReceiveBroadcast('hello', (data) => {
  console.log(data)

  // Call off to stop receiving broadcasts
  off()
})
// Receive only once
useGlobalReceiveBroadcast('hello', (data) => {}, { once: true })
// Exclude broadcasts emitted by the current component instance
useGlobalReceiveBroadcast('hello', (data) => {}, { excludeSelf: true })

const broadcast = useGlobalChildBroadcast()

// Emit broadcast
broadcast('hello')
// With data
broadcast('hello', { name: 'world' })
```

### `createBroadcastCompositions`

Using this function, you can create a set of broadcast Composition APIs. If you're concerned about conflicts with [`InjectionKey`](https://vuejs.org/api/composition-api-dependency-injection.html), you can use `createBroadcastCompositions` to create a set of broadcast Composition APIs.

`custom-broadcaster.ts`:

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

## Development

```bash
git clone https://github.com/xiangheng08/vue-broadcaster.git

cd vue-broadcaster
pnpm i
pnpm dev # Start development server
pnpm build # Build
```

## License

[MIT](https://github.com/xiangheng08/vue-broadcaster/blob/HEAD/LICENSE)

[npm-url]: https://www.npmjs.com/package/vue-broadcaster
[npm-version-image]: https://badgen.net/npm/v/vue-broadcaster
[npm-downloads-image]: https://badgen.net/npm/dm/vue-broadcaster
