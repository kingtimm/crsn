<script setup lang="ts">
import { useCycleList } from '@vueuse/core'

const colorMode = useColorMode()
const toggle = ref(false)
const { state, next, prev } = useCycleList([
  'light',
  'dark',
])

watchEffect(() => {
  if (toggle.value) { state.value = 'light' } else { state.value = 'dark' }
  colorMode.preference = state.value
})
</script>

<template>
  <UContainer class="flex items-baseline gap-4">
    <h1 class="text-2xl font-semibold py-4">
      <NuxtLink to="/">
        Baby Names
      </NuxtLink>
    </h1>
    <div class="m-3">
      <UToggle v-model="toggle" on-icon="i-heroicons-sun" off-icon="i-heroicons-moon" />
    </div>
  </UContainer>
</template>