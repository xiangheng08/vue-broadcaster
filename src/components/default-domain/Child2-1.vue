<script setup lang="ts">
import { useReceiveBroadcast, useChildBroadcast } from 'vue-broadcaster'

const path = 'default-domain/Child2/1.vue'

const broadcast = useChildBroadcast()

const type1 = () => {
  broadcast('type1', 'hello world')
}

const type2 = () => {
  broadcast('type2', {
    message: 'hello world',
  })
}

useReceiveBroadcast('type1', (data) => {
  console.log(path, 'type1', data)
})

useReceiveBroadcast('type2', (data) => {
  console.log(path, 'type2', data)
})
</script>

<template>
  <div class="component">
    <div class="component-title">{{ path }}</div>
    <button @click="type1">type1</button>
    <button @click="type2">type2</button>
  </div>
</template>
