<script setup lang="ts">
import { SignUp } from 'vue-clerk'
import { dark } from '@clerk/themes'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

definePageMeta({
  middleware: ['public'],
})
</script>

<template>
  <div class="grid h-full place-items-center">
    <SignUp :appearance="isDark ? { baseTheme: dark } : {}" sign-in-url="/sign-in" />
  </div>
</template>
