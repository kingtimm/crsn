import { defineStore } from 'pinia'
import type { tables } from '~/server/utils/db'

export interface SerializedName extends Omit<tables.Name, 'createdAt'> {
  createdAt?: string
}

export const useNames = defineStore('names', () => {
  const loading = ref(false)

  const toast = useToast()

  const { data: names, error } = useFetch('/api/names')

  if (error.value) {
    toast.add({ title: error.value.statusMessage, color: 'red' })
    createError(error.value)
    loading.value = false
  }

  async function addName(newName: string, newNameInput?: Ref<any>) {
    if (!newName.trim())
      return

    loading.value = true

    try {
      const { data: name, error } = await useFetch<SerializedName[]>('/api/names', {
        method: 'POST',
        body: {
          name: newName,
        },
      })

      if (error.value) {
        if (error.value.data?.message.includes('UNIQUE'))
          error.value.statusMessage = 'Already added as a name'

        toast.add({ title: error.value.statusMessage, color: 'red' })
        createError(error.value)
        loading.value = false
        return
      }

      if (names.value && name.value) {
        name.value.map((i: SerializedName) => names.value?.push(i))
        toast.add({ title: `Name "${name.value.toString()}" created.` })
        if (newNameInput) {
          newNameInput.value = ''
          await nextTick(() => {
            if (newNameInput.value?.input)
              newNameInput.value?.input.focus()
          })
        }
      }
    }
    catch (err) {
      // @ts-expect-error this area doesn't work
      if (err.data?.data?.issues) {
        // @ts-expect-error this area doesn't work
        const title = err.data.data.issues.map(issue => issue.message).join('\n')
        toast.add({ title, color: 'red' })
      }
    }
    finally {
      loading.value = false
    }
  }

  async function deleteName(name: SerializedName) {
    console.log(name)
    const { error } = await useFetch(`/api/names/${name.id}`, { method: 'DELETE' })
    if (error.value) {
      toast.add({ title: `Please delete favorites using name ${name.name} before deleting.`, icon: 'i-heroicons-x-mark-20-solid', color: 'red' })
      return
    }
    if (names.value) {
      names.value = names.value.filter((t: SerializedName) => t.id !== name.id)
      toast.add({ title: `Name "${name.name}" deleted.` })
    }
  }

  return {
    names,
    loading,
    addName,
    deleteName,
  }
})
