<script setup lang="ts">
import { watchArray } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { type SerializedName, useNames } from '~/stores/names'

const props = defineProps<{
  selectedName: SerializedName
  fieldName: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedName', fieldName: string, selectedName: SerializedName): void
}>()

const initialValue = {
  createdAt: '1',
  name: '',
  id: 0,
} satisfies SerializedName

const namesStore = useNames()
const { names } = storeToRefs(namesStore)
const refToFocus = ref()

const namesAlphabetical = computed(() => {
  if (names.value)
    return [...names.value].sort((a, b) => a.name.localeCompare(b.name))
  else
    return []
})

function updateParent(name: SerializedName) {
  emit('update:selectedName', props.fieldName, name)
}

// handles when a name is deleted - clear the selected vale
watchArray(namesAlphabetical, (_newList, _oldList, _added, removed) => {
  if (names && props.selectedName && removed) {
    if (props.selectedName.name === removed[0]?.name)
      updateParent(initialValue)
  }
})

const selectedName = computed({
  get: () => props.selectedName,
  set: async (newNameValue) => {
    const result = async () => {
      if (newNameValue?.id > 0) {
        // should mean this already exists
        return newNameValue
      }
      else if (newNameValue) {
        // need to create a new one
        const data = await namesStore.addName(newNameValue.name, refToFocus)
        // names.value.push(data.value)
        // todo: persist to api
        if (Array.isArray(data?.value) && data?.value[0])
          return data.value[0]
      }
      return initialValue
    }
    updateParent(await result())
  },
})
</script>

<template>
  <USelectMenu
    ref="refToFocus" v-model="selectedName" by="id" name="names" :options="namesAlphabetical"
    option-attribute="name" searchable creatable
  >
    <template #label>
      <template v-if="selectedName.id > 0">
        {{ selectedName.name }}
      </template>
      <template v-else>
        <span class="text-gray-500 dark:text-gray-400 truncate">{{ fieldName }}</span>
      </template>
    </template>

    <template #option="{ option: name }">
      <span class="truncate">{{ name.name }}</span>
    </template>

    <template #option-create="{ option: name }">
      <span class="flex-shrink-0">
        <UIcon name="i-heroicons-plus" />
      </span>
      <span class="block truncate">{{ name.name }}</span>
    </template>
  </USelectMenu>
</template>
