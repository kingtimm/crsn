<script setup lang="ts">
import { SignIn } from 'vue-clerk'

const route = useRoute()
const inviteId = route.params.id ?? 0

const url = computed(() => {
  return `/invitation/accept/${inviteId}`
})

definePageMeta({
  middleware: ['public'],
})
</script>

<template>
  <div class="grid h-full place-items-center">
    <SignIn
      :after-sign-in-url="url"
      :after-sign-up-url="url"
    />
    <!-- {{ url }} -->
  </div>
</template>
