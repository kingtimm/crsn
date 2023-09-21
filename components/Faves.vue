<script setup lang="ts">
import useFaves from '~/composables/faves';

const { faves, deleteFave, refresh } = useFaves()
</script>

<template>
  <UContainer>
    <h2 class="text-xl leading-10">Favorites List</h2>
    <div class="grid grid-cols-[max-content_auto] gap-1">
      <template v-for="fave in faves" :key=fave.id>
        <span class="mb-1 w-full">
          {{ fave.firstName?.name }} {{ fave.middleName?.name }} King
        </span>
        <UButton class="w-fit" variant="ghost" size="2xs" icon="i-heroicons-x-mark-20-solid" @click="deleteFave(fave.id)" />
      </template>
    </div>
  </UContainer>
</template>