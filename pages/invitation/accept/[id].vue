<script setup lang="ts">
import { promiseTimeout } from '@vueuse/core'
import { useClerk } from 'vue-clerk'

const route = useRoute()
const inviteId = route.params.id ?? 0

const toast = useToast()

const url = computed(() => {
  return `/invitation/sign-in/${inviteId}`
})

// handle error
const { data, error } = await useFetch('/api/invitation', {
  query: {
    inviteId,
  },
  server: false,
  lazy: true,
})

if (error.value) {
  console.log('error', error.value)
  navigateTo('/invitation/error')
}
// handle sending the invitee to signup
const nuxtApp = useNuxtApp()
const clerk = useClerk()
// On server, check if the user isn't authenticated
// and redirect to /sign-in.
if (
  process.server
  && !nuxtApp.ssrContext?.event.context.auth?.userId
)
  navigateTo(url.value)

// On client, check if clerk is loaded and if user isn't authenticated
// and redirect to /sign-in.
if (process.client && clerk.loaded && !clerk.user?.id)
  navigateTo(url.value)

const {
  data: membershipData,
  error: membershipError,
  pending: membershipPending,
  execute,
} = await useLazyFetch('/api/membership', {
  immediate: false,
  server: false,
  method: 'post',
  query: {
    inviteId,
  },
})

async function acceptInvitation() {
  await execute()
  if (membershipData.value)
    console.log('woohoo!', data.value)

  if (membershipError.value)
    console.log('doh!', error.value)

  toast.add({ title: 'Invitation accepted!' })
  await promiseTimeout(2000)
  navigateTo('/babies')
}
</script>

<template>
  <div class="flex flex-col gap-3 items-start">
    <h1 class="text-2xl">
      👋 Welcome!
    </h1>

    <p>
      To accept your invite from <span class="text-primary">
        {{ data?.user.firstName }}
      </span>, click below.
    </p>

    <UButton icon="i-heroicons-check" :loading="!membershipPending" @click="acceptInvitation()">
      Accept Invitation
    </UButton>
  </div>
</template>
