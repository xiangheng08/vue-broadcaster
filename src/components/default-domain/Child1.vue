<script setup lang="ts">
import { useReceiveBroadcast, useChildBroadcast } from 'vue-broadcaster'

const path = 'default-domain/Child1.vue'

const broadcast = useChildBroadcast()

const type1 = () => {
  broadcast('type1', 'hello world')
}

const type2 = () => {
  broadcast('type2', {
    message: 'hello world',
  })
}

useReceiveBroadcast<string>('type1', (data) => {
  console.log(path, 'type1', data)
})

useReceiveBroadcast('type2', (data) => {
  console.log(path, 'type2', data)
})

useReceiveBroadcast(
  'type2',
  (data) => {
    console.log(path, 'type2', data, '(once)')
  },
  { once: true },
)

useReceiveBroadcast(
  'type2',
  (data) => {
    console.log(path, 'type2', data, '(excludeSelf)')
  },
  { excludeSelf: true },
)

let count = 0
const total = 3

const off = useReceiveBroadcast(
  'type2',
  (data) => {
    console.log(path, 'type2', data, `(manual off, off after ${total} times)`)
    count++
    if (count > total) {
      console.log(path, 'type2', 'off')
      off()
    }
  },
  { excludeSelf: true },
)
</script>

<template>
  <div class="component">
    <div class="component-title">{{ path }}</div>
    <button @click="type1">type1</button>
    <button @click="type2">type2</button>
  </div>
</template>
