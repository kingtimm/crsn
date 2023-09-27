<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})
</script>

<template>
  <UContainer class="flex items-center gap-4 mb-4 rounded-b-lg max-w-4xl">
    <h1 class="text-2xl font-semibold py-4">
      <NuxtLink to="/">
        Baby Names
      </NuxtLink>
    </h1>
    <div class="m-3">
      <ClientOnly>
        <UButton
          :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" color="gray" variant="ghost"
          aria-label="Theme" @click="isDark = !isDark"
        />
        <template #fallback>
          <div class="w-8 h-8" />
        </template>
      </ClientOnly>
    </div>
  </UContainer>
</template>
