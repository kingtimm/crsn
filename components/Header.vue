<script setup lang="ts">
import { SignInButton, SignedIn, SignedOut, UserButton } from 'vue-clerk'
import { dark } from '@clerk/themes'

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
  <UContainer class="flex items-center gap-4 mb-4 rounded-b-lg max-w-4xl justify-between">
    <h1 class="text-2xl font-semibold py-4 text-primary">
      <NuxtLink to="/">
        Crsn 👶
      </NuxtLink>
    </h1>
    <div class="m-3 flex gap-4 items-center">
      <ClientOnly>
        <UButton
          :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" color="gray" variant="ghost"
          aria-label="Theme" @click="isDark = !isDark"
        />
        <template #fallback>
          <div class="w-8 h-8" />
        </template>
      </ClientOnly>
      <ULink to="/babies">
        Babies
      </ULink>
      <SignedIn>
        <UserButton :key="colorMode.preference" class="right-0" :appearance="isDark ? { baseTheme: dark } : {}" />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  </UContainer>
</template>
