<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable'
import useFaves from '~/composables/faves';

const { faves, deleteFave, refresh } = useFaves()

const el = ref<HTMLElement | null>(null)

const { option } = useSortable(el, faves)
</script>

<template>
  <UContainer>
    <h2 class="text-xl leading-10">Favorites List</h2>
    <!-- <div class="grid grid-cols-[max-content_auto] gap-1">
      <template v-for="fave in faves" :key=fave.id>
        <span class="mb-1 w-full fave" ref="el">
          {{ fave.firstName?.name }} {{ fave.middleName?.name }} King
        </span>
        <UButton class="w-fit" variant="ghost" size="2xs" icon="i-heroicons-x-mark-20-solid"
          @click="deleteFave(fave.id)" />
      </template>
    </div> -->
    <div class="inline-block" ref="el">
      <div v-for="fave in faves" :key=fave.id class="flex-1 flex fave gap-3 justify-between items-center mb-2 px-3 rounded bg-primary-400/10 ring-1 ring-primary-500/25">
        <UIcon name="i-heroicons-squares-2x2" />
        <span class="mb-1 flex-grow ">
            {{ fave.firstName?.name }} {{ fave.middleName?.name }} King
        </span>
        <UButton class="h-min" size="3xs" icon="i-heroicons-x-mark-20-solid" @click="deleteFave(fave.id)" />
      </div>
    </div>
  </UContainer>
</template>