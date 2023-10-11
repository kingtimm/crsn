<script setup lang="ts">
const gender = ref('f')

const { data, refresh } = await useLazyFetch('/api/public-name-pool', {
  query: {
    gender,
  },
})

const names = computed(() => data.value?.map(row => row.name))

watch(gender, async (newVal) => {
  await nextTick()
  await refresh()
})

const unselected = 'bg-gray-100 text-black dark:bg-gray-700 dark:text-white'
</script>

<template>
  <UCard :ui="{ footer: 'p-0 m-0' }">
    <div class="flex gap-3 justify-start">
      <UButton icon="i-heroicons-arrow-path" color="ghost" aria="generate" class="dark:text-white" type="button" @click="refresh()" />
      <p class="text-primary text-2xl">
        {{ names?.join(" ") }}
      </p>
    </div>
    <template #footer>
      <div class="grid grid-cols-2 h-10">
        <div :class="(gender === 'f') ? 'bg-pink-400 text-white' : unselected">
          <input id="girl" v-model="gender" type="radio" value="f">
          <label for="girl" class="cursor-pointer">
            <div class="flex justify-center items-center h-full gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="currentColor"><path d="M10 12a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z" /><path fill-rule="evenodd" d="M12.024 2H12C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10c0-5.258-4.058-9.568-9.212-9.97v-.002A9.94 9.94 0 0 0 12.025 2ZM12 20a8 8 0 0 0 7.742-10.022a10.016 10.016 0 0 1-8.982-4.376a7.976 7.976 0 0 1-5.691 2.4A8 8 0 0 0 12 20Zm-.021-16h.045h-.045Z" clip-rule="evenodd" /></g></svg>
              Girl Names
            </div>
          </label>
        </div>
        <div :class="(gender === 'm') ? 'bg-blue-400 text-white' : unselected">
          <input id="boy" v-model="gender" type="radio" value="m">
          <label for="boy" class="cursor-pointer">
            <div class="flex justify-center items-center h-full gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="currentColor"><path d="M9 14a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm7-1a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z" /><path fill-rule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Zm0-2a8 8 0 0 0 7.634-10.4c-.835.226-1.713.346-2.619.346a9.996 9.996 0 0 1-8.692-5.053A8 8 0 0 0 12 20Z" clip-rule="evenodd" /></g></svg>
              Boy Names
            </div>
          </label>
        </div>
      </div>
    </template>
  </UCard>
</template>

<style scoped>
input[type=radio] {
  display: none;
}
label {
  flex: none;
}
</style>
