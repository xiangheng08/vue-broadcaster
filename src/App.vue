<script setup lang="ts">
import { useGlobalBroadcast } from 'vue-broadcaster'
import DefaultDomain from './components/default-domain/index.vue'
import GlobalDomain from './components/global-domain/index.vue'
import CustomDomain from './components/custom-domain/index.vue'

useGlobalBroadcast()
</script>

<template>
  <DefaultDomain />
  <GlobalDomain />
  <CustomDomain />
</template>
