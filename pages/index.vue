<script setup>
const loading = ref(false)
const newName = ref('')
const newNameInput = ref(null)
const toast = useToast()

const { data: names } = await useFetch('/api/names')

async function addName() {
  if (!newName.value.trim()) { return }

  loading.value = true

  try {
    const name = await $fetch('/api/names', {
      method: 'POST',
      body: {
        name: newName.value,
      }
    })

    names.value.push(name)
    toast.add({ title: `Name "${name.name}" created.` })
    newName.value = ''
    nextTick(() => {
      newNameInput.value?.input?.focus()
    })
  } catch (err) {
    if (err.data?.data?.issues) {
      const title = err.data.data.issues.map(issue => issue.message).join('\n')
      toast.add({ title, color: 'red' })
    }
  }
  loading.value = false
}

async function deleteName(name) {
  await useFetch(`/api/names/${name.id}`, { method: 'DELETE' })
  names.value = names.value.filter(t => t.id !== name.id)
  toast.add({ title: `Name "${name.title}" deleted.` })
}
</script>

<template>
  <div @submit.prevent="addName">
    <UContainer>

      <h1 class="text-2xl font-semibold py-4">
        <NuxtLink to="/">
          Baby Names
        </NuxtLink>
      </h1>
      <Random />
    </UContainer>
    <UContainer class="my-4">
      <h2 class="text-xl">Names List</h2>
      <div class="flex items-center gap-2 py-4">
        <UInput ref="newNameInput" v-model="newName" name="name" :disabled="loading" class="flex-1" placeholder="New Name"
          autocomplete="off" autofocus :ui="{ wrapper: 'flex-1' }" />

        <UButton type="submit" icon="i-heroicons-plus-20-solid" :loading="loading"
          :disabled="newName.trim().length === 0" />
      </div>
      <div class="flex flex-wrap gap-2">
        <UBadge variant="subtle" v-for="name of names" :key="name.id"
          class="flex items-center gap-2 pl-4 w-min rounded-full">
          <span class="leading-none">
            {{ name.name }}
          </span>
          <UButton variant="ghost" size="2xs" icon="i-heroicons-x-mark-20-solid" @click="deleteName(name)" />
        </UBadge>
      </div>
    </UContainer>
  </div>
</template>