import { defineStore } from 'pinia'
import { useUser } from 'vue-clerk'

export const useBaby = defineStore('baby', () => {
  const _babyId = ref('0')
  const initialized = ref(false)

  const toast = useToast()

  const { user } = useUser()

  const babyId = computed({
    get() { return _babyId.value },

    set(newVal) {
      return _babyId.value = newVal
    },
  })

  const { data, refresh } = useFetch('/api/babies', {
    lazy: true,
    server: false,
    immediate: false,
  })

  const babyData = ref() as Ref<typeof data.value>

  async function fetchBabyData() {
    await refresh()
    babyData.value = data.value
  }

  async function initialize() {
    if (!babyData.value)
      await fetchBabyData()
    initialized.value = true
  }

  async function addBaby(lastName: string) {
    const { data: addedBaby, error: addError } = await useFetch('/api/babies', {
      method: 'post',
      server: false,
      lazy: true,
      body: {
        userId: user.value?.id,
        lastName,
      },
    })
    if (addError.value) {
      console.log(addError.value)
      toast.add({
        title: 'Error occured while adding',
        color: 'red',
      })
    }
    else if (addedBaby.value) {
      babyData.value?.push(addedBaby.value)
      toast.add({ title: 'Added a baby' })
    }
  }

  return {
    babyId,
    addBaby,
    initialize,
    babyData,
    fetchBabyData,
  }
})
