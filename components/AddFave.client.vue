<script setup lang="ts">
import { type SerializedName } from '~/stores/names'
import { useFaves } from '~/stores/faves'

const firstName: Ref<SerializedName> = ref()
const middleName: Ref<SerializedName> = ref()

const favesStore = useFaves()

const fullName = computed(() => {
  if (!firstName.value || !middleName.value)
    return 'Select names'

  return `${firstName.value.name} ${middleName.value.name} King`
})

function handle(field, value) {
  if (field === 'First Name')
    firstName.value = value
  else
    middleName.value = value
}
</script>

<template>
  <UFormGroup label="Add Favorite" name="name">
    <form class="flex flex-col gap-4" @submit.prevent="favesStore.addFave([firstName, middleName]) ">
      <FaveNameSelect field-name="First Name" @change="handle" />
      <FaveNameSelect field-name="Middle Name" @change="handle" />
      <p>{{ fullName }}</p>
      <UButton
        class="w-min" type="submit" icon="i-heroicons-plus-20-solid"
        :disabled="!firstName || !middleName"
      />
    </form>
  </UFormGroup>
</template>
