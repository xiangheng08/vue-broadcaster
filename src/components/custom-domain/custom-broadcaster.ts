import { createBroadcastCompositions } from 'vue-broadcaster'

const CUSTOM_INJECTION_KEY = Symbol('custom_broadcaster')

const { useBroadcast, useReceiveBroadcast, useChildBroadcast } = createBroadcastCompositions({
  injectionKey: CUSTOM_INJECTION_KEY,
})

export const useCustomBroadcast = useBroadcast
export const useCustomReceiveBroadcast = useReceiveBroadcast
export const useCustomChildBroadcast = useChildBroadcast
