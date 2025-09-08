<script setup lang="ts">
import { useCustomBroadcast } from './custom-broadcaster'
import Child1 from './Child1.vue'
import Child2 from './Child2.vue'

const path = 'custom-domain/index.vue'

const { broadcast, receive } = useCustomBroadcast()

const type1 = () => {
  broadcast('type1', 'hello world')
}

const type2 = () => {
  broadcast('type2', {
    message: 'hello world',
  })
}

receive('type1', (data) => {
  console.log(path, 'type1', data)
})

receive('type2', (data) => {
  console.log(path, 'type2', data)
})
</script>

<template>
  <div class="component">
    <div class="component-title">{{ path }}</div>
    <button @click="type1">type1</button>
    <button @click="type2">type2</button>
    <Child1 />
    <Child2 />
  </div>
</template>
