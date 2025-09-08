export type * from './types'

import { createBroadcastCompositions } from './create'
import type { InjectionKey } from 'vue'
import type { Broadcaster } from './broadcaster'
import type { BroadcastCompositionsOptions } from './create'

const GLOBAL_INJECTION_KEY: InjectionKey<Broadcaster> = Symbol('broadcaster')

const { useBroadcast, useReceiveBroadcast, useChildBroadcast } = createBroadcastCompositions()

const {
  useBroadcast: useGlobalBroadcast,
  useReceiveBroadcast: useGlobalReceiveBroadcast,
  useChildBroadcast: useGlobalChildBroadcast,
} = createBroadcastCompositions({ injectionKey: GLOBAL_INJECTION_KEY })

export {
  // default
  useBroadcast,
  useReceiveBroadcast,
  useChildBroadcast,

  // global
  useGlobalBroadcast,
  useGlobalReceiveBroadcast,
  useGlobalChildBroadcast,

  // create
  createBroadcastCompositions,
}

export type { BroadcastCompositionsOptions, Broadcaster }
