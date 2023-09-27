<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNames } from '~/stores/names'

const namesStore = useNames()
const { names, loading } = storeToRefs(namesStore)
const newName = ref('')
const newNameInput = ref(null)
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-xl">
        Names List
      </h2>
    </template>
    <form class="flex items-center gap-2 py-2 text-lg" @submit.prevent="namesStore.addName(newName, newNameInput)">
      <UInput
        ref="newNameInput" v-model="newName" name="name" :disabled="loading" class="flex-1"
        placeholder="New First/Middle Name" autocomplete="off" autofocus :ui="{ wrapper: 'flex-1' }"
      />

      <UButton
        type="submit" icon="i-heroicons-plus-20-solid" :loading="loading"
        :disabled="newName.trim().length === 0"
      />
    </form>
    <div class="flex flex-wrap gap-2">
      <UBadge
        v-for="name of names" :key="name.id" variant="subtle"
        class="flex items-center gap-2 pl-4 w-min rounded-full"
      >
        <span class="leading-none">
          {{ name.name }}
        </span>
        <UButton variant="ghost" size="2xs" icon="i-heroicons-x-mark-20-solid" @click="namesStore.deleteName(name)" />
      </UBadge>
    </div>
  </UCard>
</template>
