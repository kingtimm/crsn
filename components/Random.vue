<script setup lang="ts">
import useFaves from "~/composables/faves";
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
  <UCard class="flex gap-3">
    <p class="font-thin text-2xl leading-none pb-3">{{ fullName }}</p>
    <UButton class="mr-4" type="button" icon="i-heroicons-arrow-path" @click="refresh" :disabled="pending">Generate
    </UButton>
    <UButton class="mr-4" type="button" icon="i-heroicons-heart" @click="addFave(randomNameResponse)" :disabled="pending">Favorite
    </UButton>
  </UCard>
</template>