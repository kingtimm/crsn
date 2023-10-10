<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToggle } from '@vueuse/core'
import { useBaby } from '~/stores/baby'

definePageMeta({
  middleware: ['auth'],
})

// initialize store
const babyStore = useBaby()
await babyStore.initialize()
const { babyData } = storeToRefs(babyStore)

const lastName = ref('')

const [mode, toggle] = useToggle()

async function add() {
  await babyStore.addBaby(lastName.value)
  await babyStore.fetchBabyData()
  // send us back
  toggle()
}

const inviteData = ref()

const acceptUrl = computed(() => {
  if (!inviteData.value)
    return null

  const base = `${useRequestURL().origin}/invitation/accept/`
  return base + inviteData.value.inviteId
})

const loadingLink = ref(false)
const linkIcon = computed(() => {
  return acceptUrl.value ? 'i-heroicons-check' : 'i-heroicons-paper-clip'
})

async function generateInviteLink(babyId: number) {
  try {
    loadingLink.value = true
    const { data } = await useLazyFetch('/api/invitation/', {
      query: { babyId },
      method: 'post',
    })
    inviteData.value = data.value
    return {
      // url,
      invite: inviteData.value,
    }
  }
  finally {
    loadingLink.value = false
  }
}
</script>

<template>
  <h1 class="text-xl">
    Babies
  </h1>
  <template v-if="!mode">
    <div class="flex gap-3">
      <UButton icon="i-heroicons-plus" @click="toggle()">
        New Baby
      </UButton>
    </div>
    <div class="flex flex-wrap gap-4">
      <UCard
        v-for="baby in babyData"
        :key="baby.id" class="" :data-id="baby.id"
      >
        <template #header>
          <div class="flex gap-3 items-center">
            <UIcon name="i-heroicons-gift" />
            Baby {{ baby.lastName }}
          </div>
        </template>
        <div class="flex gap-3">
          <div class="">
            <UPopover>
              <UButton :loading="loadingLink" :icon="linkIcon" @click="generateInviteLink(baby.id)">
                Invite Link
              </UButton>
              <template v-if="acceptUrl" #panel>
                <ULink :to="acceptUrl" class="p-4" target="_blank">
                  Invite Link
                </ULink>
              </template>
            </UPopover>
          </div>
          <UButton icon="i-heroicons-pencil" :to="`/babies/${baby.id}`">
            Edit
          </UButton>
          <UButton icon="i-heroicons-trash" :disabled="true">
            Delete
          </UButton>
        </div>
      </UCard>
    </div>
  </template>
  <template v-else>
    <UButton icon="i-heroicons-arrow-left" variant="ghost" @click="toggle()">
      Back
    </UButton>
    <div class="flex flex-wrap gap-4">
      <UCard>
        <template #header>
          <div class="flex gap-3 items-center">
            <UIcon name="i-heroicons-gift" />
            New Baby
          </div>
        </template>
        <form class="flex items-center gap-2 py-2 text-lg" @submit.prevent="add()">
          <UInput
            v-model="lastName" name="lastName" class="flex-1"
            placeholder="Baby's last name" autocomplete="off" :ui="{ wrapper: 'flex-1' }"
          />
          <UButton icon="i-heroicons-check" :disabled="lastName.trim().length === 0" type="submit">
            Create
          </UButton>
        </form>
        <template #footer />
      </UCard>
    </div>
  </template>
</template>
