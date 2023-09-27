<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDraggable } from 'vue-draggable-plus'
import { useFaves } from '~/stores/faves'

const faveStore = useFaves()
const { pending } = await faveStore.getStateFromDb()
const { faves } = storeToRefs(faveStore)

const el = ref<HTMLElement | null>(null)
const st = ref([]) as Ref<Array<string>>

const sortableOptions = {
  name: 'faves',
  handle: '.handle',
  store: {
    set: async (sortable: any) => {
      nextTick(async () => {
        await faveStore.storeSortOrder(sortable.toArray())
      })
    },
  },
}

// @ts-expect-error this area isn't quite ts ready
const draggable = useDraggable(el, faves, sortableOptions)

// need to register updates when added or destroyed
faveStore.setSortableInstance(draggable.toArray)
</script>

<template>
  <UCard>
    <template #header>
      <h2>
        Ideas
      </h2>
    </template>
    <div v-if="pending" class="py-2 flex flex-col items-start gap-2">
      <USkeleton class="h-10 w-full" />
      <USkeleton class="h-10 w-full" />
    </div>
    <div v-else ref="el" class="flex flex-col">
      <div
        v-for="fave in faves" :key="fave.id" ref="st" :data-id="fave.id"
        class="flex-1 flex justify-between items-center mb-2 p-2 rounded bg-primary-400/10 ring-1 ring-primary-500/25"
      >
        <UIcon name="i-heroicons-arrows-up-down" class="handle cursor-grab" />
        <p class="m-1 mx-2 flex-grow text-sm">
          {{ fave.firstName?.name }} {{ fave.middleName?.name }} King
        </p>
        <UButton class="h-min" size="2xs" icon="i-heroicons-x-mark-20-solid" @click="faveStore.deleteFave(fave.id)" />
      </div>
    </div>
  </UCard>
</template>
