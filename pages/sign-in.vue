<script setup lang="ts">
import { SignIn } from 'vue-clerk'
import { dark } from '@clerk/themes'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

definePageMeta({
  middleware: ['public'],
})
</script>

<template>
  <div class="grid h-full place-items-center">
    <SignIn :appearance="isDark ? { baseTheme: dark } : {}" sign-up-url="/sign-up" />
  </div>
</template>
