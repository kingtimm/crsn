<script setup lang="ts">
import { useFaves } from '~/stores/faves'
import type { Name } from '~/server/db/schema'

const toast = useToast()
const { addFave } = useFaves()
const { data: randomNameResponse, refresh, pending } = await useFetch<Name[]>('/api/names/random')

const fullName = computed(() => {
  if (randomNameResponse) {
    const bothnames = randomNameResponse.value?.map(name => name.name)
    return bothnames?.concat(['King']).join(' ')
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
        <UButton class="mr-4" type="button" icon="i-heroicons-heart" :disabled="pending" @click="addFave(randomNameResponse)">
          Favorite
        </UButton>
      </div>
      <AddFave class=""></AddFave>
    </div>
  </UCard>
</template>
