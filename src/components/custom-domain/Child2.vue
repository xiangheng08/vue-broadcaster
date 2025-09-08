<script setup lang="ts">
import { useCustomChildBroadcast, useCustomReceiveBroadcast } from './custom-broadcaster'
import Child21 from './Child2-1.vue'
import Child22 from './Child2-2.vue'

const path = 'custom-domain/Child2.vue'

const broadcast = useCustomChildBroadcast()

const type1 = () => {
  broadcast('type1', 'hello world')
}

const type2 = () => {
  broadcast('type2', {
    message: 'hello world',
  })
}

useCustomReceiveBroadcast('type1', (data) => {
  console.log(path, 'type1', data)
})

useCustomReceiveBroadcast('type2', (data) => {
  console.log(path, 'type2', data)
})
</script>

<template>
  <div class="component">
    <div class="component-title">{{ path }}</div>
    <button @click="type1">type1</button>
    <button @click="type2">type2</button>
    <child21 />
    <child22 />
  </div>
</template>
