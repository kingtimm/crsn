<script setup lang="ts">
import { type SerializedName } from '~/stores/names'
import { useFaves } from '~/stores/faves'

const firstName: Ref<SerializedName | null> = ref(null)
const middleName: Ref<SerializedName | null> = ref(null)

const favesStore = useFaves()

const fullName = computed(() => {
  if (!firstName.value || !middleName.value)
    return 'Add Favorite'

  return `${firstName.value.name} ${middleName.value.name} King`
})

function handle(field: string, value: SerializedName) {
  if (field === 'First Name')
    firstName.value = value
  else
    middleName.value = value
}
</script>

<template>
  <form class="flex flex-col gap-2 z-10"
    @submit.prevent="(firstName && middleName) && favesStore.addFave([firstName, middleName])">
    <p>{{ fullName }}</p>
    <div class="flex gap-4">
      <FaveNameSelect class="flex-grow" field-name="First Name" @change="handle" />
      <FaveNameSelect class="flex-grow" field-name="Middle Name" @change="handle" />
      <UButton class="w-min" type="submit" icon="i-heroicons-plus-20-solid" :disabled="!firstName || !middleName" />
    </div>
  </form>
</template>
