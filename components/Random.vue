<script setup lang="ts">
const { data, refresh, pending } = await useFetch("/api/names/random")
</script>

<template>
  <p class="flex align-items-center gap-1">
    <UButton class="mr-4" type="button" icon="i-heroicons-arrow-path" @click="refresh"
          :disabled="pending" />
    <span class="font-thin text-2xl" v-for="name in data">{{ name.name }}</span>
  </p>
</template>