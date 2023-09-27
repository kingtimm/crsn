<script setup lang="ts">
import { type SerializedName } from '~/stores/names'
import { useFaves } from '~/stores/faves'

// setting these up with initial values
const initialValue = {
  createdAt: '1',
  name: '',
  id: 0,
} satisfies SerializedName
const firstName: Ref<SerializedName> = ref(initialValue)
const middleName: Ref<SerializedName> = ref(initialValue)

const favesStore = useFaves()

const fullName = computed(() => {
  if (!firstName.value.name || !middleName.value.name)
    return 'Add Favorite'

  return `${firstName.value.name} ${middleName.value.name} King`
})

function handle(field: string, value: SerializedName) {
  if (field === 'First Name')
    firstName.value = value
  else
    middleName.value = value
}

// handle scrolling to select input
const topRef = ref()

function goTo() {
  topRef.value?.scrollIntoView({ behavior: 'smooth' })
}

function submit() {
  favesStore.addFave([firstName.value, middleName.value])
  // reset
  firstName.value = initialValue
  middleName.value = initialValue
}
</script>

<template>
  <form
    ref="topRef" class="flex flex-col gap-2"
    @submit.prevent="submit()"
  >
    <p>{{ fullName }}</p>
    <div class="flex gap-4">
      <FaveNameSelect class="flex-grow" field-name="First Name" :selected-name="firstName" @update:selected-name="handle" @click="goTo()" />
      <FaveNameSelect class="flex-grow" field-name="Middle Name" :selected-name="middleName" @update:selected-name="handle" @click="goTo()" />
      <UButton class="w-min" type="submit" icon="i-heroicons-plus-20-solid" :disabled="!firstName || !middleName" />
    </div>
  </form>
</template>
