<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { type SerializedName, useNames } from '~/stores/names'

const props = defineProps<{
  fieldName: string
}>()

const emit = defineEmits<{
  (e: 'change', field: string, name: string): void
}>()

const namesStore = useNames()
const { names } = storeToRefs(namesStore)

const selected: Ref<SerializedName | null> = ref(null)

const namesAlphabetical = computed(() => {
  return [...names.value].sort((a, b) => a.name.localeCompare(b.name))
})

const selectedName = computed({
  get: () => selected.value,
  set: async (newNameValue: Partial<SerializedName>) => {
    const result = async () => {
      if (newNameValue?.id) {
        // should mean this already exists
        return newNameValue
      }
      else if (newNameValue) {
        // need to create a new one
        const nameToCreate = {
          name: newNameValue.name,
          createdAt: new Date().toISOString(),
        }
        const { data } = await namesStore.addName(nameToCreate.name)
        names.value.push(data.value)
        // todo: persist to api
        return data.value
      }
      else {
        return null
      }
    }
    selected.value = await result()
    emit('change', props.fieldName, selected.value)
  },
})
</script>

<template>
  <USelectMenu
    v-model="selectedName" by="id" name="names" :options="namesAlphabetical" option-attribute="name" searchable
    creatable
  >
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
