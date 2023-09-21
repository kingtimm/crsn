<script setup lang="ts">
const { data, refresh, pending } = await useFetch("/api/names/random")
</script>

<template>
  <UCard>
      <p class="flex items-center gap-1 pb-3">
        <span class="font-thin text-2xl leading-none" v-for="name in data">{{ name.name }}</span>
      </p>
    <UButton class="mr-4" type="button" icon="i-heroicons-arrow-path" @click="refresh"
          :disabled="pending">Generate</UButton>
  </UCard>
</template>