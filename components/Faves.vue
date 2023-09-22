<script setup lang="ts">
// import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable'
import { useDraggable, type UseDraggableReturn } from 'vue-draggable-plus'
import { useMutationObserver, useDebounceFn } from '@vueuse/core'
import { useFaves } from '~/stores/faves';

import { storeToRefs } from 'pinia'

const faveStore = useFaves()
const { refresh, pending } = await faveStore.getStateFromDb()
const { faves, sortState } = storeToRefs(faveStore)

const el = ref<HTMLElement | null>(null)
const st = ref([]) as Ref<Array<string>>

// @ts-ignore this area isn't quite ts ready
const sortableOptions = {
  name: 'faves',
  handle: '.handle',
  store: {
    set: async (sortable: any) => {
      nextTick(async () => {
        await faveStore.storeSortOrder(sortable.toArray())
      })
    }
  },
}

// @ts-ignore this area isn't quite ts ready
const draggable = useDraggable(el, faves, sortableOptions)

// need to register updates when added or destroyed
faveStore.setSortableInstance(draggable.toArray)

</script>

<template>
  <UContainer>
    <h2 class="text-xl leading-10">Favorites List</h2>

    <div v-if="pending" class="flex flex-col items-start gap-2">
      <USkeleton class="h-10 w-[190px]" />
      <USkeleton class="h-10 w-[190px]" />
    </div>
    <div class="inline-block" ref="el">
      <div v-for="fave in faves" :key="fave.id" :data-id="fave.id" v-if="!pending" ref="st"
        class="flex-1 flex justify-between items-center mb-2 p-2 rounded bg-primary-400/10 ring-1 ring-primary-500/25">
        <UIcon name="i-heroicons-arrows-up-down" class="handle cursor-grab" />
        <p class="m-1 mx-2 flex-grow text-sm">
          {{ fave.firstName?.name }} {{ fave.middleName?.name }} King
        </p>
        <UButton class="h-min" size="2xs" icon="i-heroicons-x-mark-20-solid" @click="faveStore.deleteFave(fave.id)" />
      </div>
    </div>
  </UContainer>
</template>