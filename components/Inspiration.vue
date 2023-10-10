<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFaves } from '~/stores/faves'
import { useBaby } from '~/stores/baby'

const { addFave } = useFaves()
const { babyId } = storeToRefs(useBaby())
const { data: randomNameResponse, refresh, pending } = await useFetch('/api/names/random', { query: { babyId }, server: false })

const fullName = computed(() => {
  if (randomNameResponse) {
    const bothnames = randomNameResponse.value?.randoms.map(name => name.name)
    return bothnames?.concat(randomNameResponse.value!.lastName).join(' ')
  }
})
</script>

<template>
  <UCard class="overflow-visible">
    <template #header>
      <h2>
        Inspiration
      </h2>
    </template>
    <div class="grid grid-cols-1 sm:grid-cols-[248px_auto] gap-4">
      <div class="">
        <p class="text-2xl leading-none pb-3 text-primary">
          {{ fullName }}
        </p>
        <UButton class="mr-4" type="button" icon="i-heroicons-arrow-path" :disabled="pending" @click="refresh">
          Generate
        </UButton>
        <UButton class="mr-4" type="button" icon="i-heroicons-heart" :disabled="pending" @click="addFave(randomNameResponse!.randoms)">
          Favorite
        </UButton>
      </div>
      <AddFave class="" />
    </div>
  </UCard>
</template>
