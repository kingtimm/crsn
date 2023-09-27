<script setup lang="ts">
import { watchArray } from '@vueuse/core';
import { storeToRefs } from 'pinia'
import { type SerializedName, useNames } from '~/stores/names'

const props = defineProps<{
  fieldName: string
}>()

const emit = defineEmits<{
  (e: 'change', field: string, name: SerializedName): void
}>()

const namesStore = useNames()
const { names } = storeToRefs(namesStore)

const selected: Ref<SerializedName | null> = ref(null)

const namesAlphabetical = computed(() => {
  return [...names.value].sort((a, b) => a.name.localeCompare(b.name))
})

watchArray(namesAlphabetical, (_newList, _oldList, _added, removed) => {
  if (selected.value && removed) {
    console.log('removed', removed)
    if(selected.value.name === removed[0]?.name){
      selected.value = null
    }
  }
})

const selectedName = computed({
  get: () => selected.value,
  set: async (newNameValue) => {
    const result = async () => {
      if (newNameValue?.id) {
        // should mean this already exists
        return newNameValue
      }
      else if (newNameValue) {
        // need to create a new one
        const data = await namesStore.addName(newNameValue.name)
        // names.value.push(data.value)
        // todo: persist to api
        if (Array.isArray(data?.value) && data?.value[0]) {
          return data.value[0]
        }
      }
      return null
    }
    selected.value = await result()
    if (selected.value) emit('change', props.fieldName, selected.value)
  },
})
</script>

<template>
  <USelectMenu v-model="selectedName" by="id" name="names" :options="namesAlphabetical" option-attribute="name" searchable
    creatable>
    <template #label>
      <template v-if="selectedName">
        {{ selectedName.name }}
      </template>
      <template v-else>
        <span class="text-gray-500 dark:text-gray-400 truncate">{{ fieldName }}</span>
      </template>
    </template>

    <template #option="{ option: name }">
      <span class="flex-shrink-0 w-2 h-2 mt-px rounded-full" />
      <span class="truncate">{{ name.name }}</span>
    </template>

    <template #option-create="{ option: name }">
      <span class="flex-shrink-0">New name:</span>
      <span class="flex-shrink-0 w-2 h-2 mt-px rounded-full -mx-1" />
      <span class="block truncate">{{ name.name }}</span>
    </template>
  </USelectMenu>
</template>
