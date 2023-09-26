<script setup lang="ts">
import {useFaves} from "~/stores/faves";
import type { Name } from "~/server/db/schema"
const toast = useToast()
const { addFave } = useFaves()
const { data: randomNameResponse, refresh, pending } = await useFetch<Name[]>("/api/names/random")

const fullName = computed(() => {
  if (randomNameResponse) {
    const bothnames = randomNameResponse.value?.map((name) => name.name)
    return bothnames?.concat(['King']).join(' ')
  }
})

</script>

<template>
  <h2 class="text-xl">Inspiration</h2>
  <p class="text-3xl leading-none py-3 text-primary">{{ fullName }}</p>
  <UButton class="mr-4" type="button" icon="i-heroicons-arrow-path" @click="refresh" :disabled="pending">Generate New
  </UButton>
  <UButton class="mr-4" type="button" icon="i-heroicons-heart" @click="addFave(randomNameResponse)" :disabled="pending">Favorite
  </UButton>
</template>