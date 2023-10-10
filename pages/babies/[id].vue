<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBaby } from '~/stores/baby'

definePageMeta({
  middleware: ['auth'],
})
const route = useRoute()

const babyIdNumber = route.params.id ?? 0

const { babyId } = storeToRefs(useBaby())
babyId.value = babyIdNumber.toString()
</script>

<template>
  <template v-if="babyIdNumber">
    <Inspiration />
    <Faves />
    <NamesBank />
  </template>
  <template v-else>
    <p>
      Need a baby ID.
    </p>
    <NuxtLink to="/babies">
      Start here
    </NuxtLink>
  </template>
</template>
