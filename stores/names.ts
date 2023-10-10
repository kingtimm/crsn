import { defineStore, storeToRefs } from 'pinia'
import type { tables } from '~/server/utils/db'
import { useBaby } from '~/stores/baby'

export type SerializedName = Omit<tables.Name, 'createdAt'> & {
  createdAt: string
}

export const useNames = defineStore('names', () => {
  const loading = ref(false)

  const toast = useToast()

  const { babyId } = storeToRefs(useBaby())

  const { data: names, error } = useLazyFetch('/api/names', { query: { babyId } })

  if (error.value) {
    toast.add({ title: error.value.statusMessage, color: 'red' })
    createError(error.value)
    loading.value = false
  }

  async function addName(newName: Ref<string>, newNameInput: Ref<HTMLInputElement | null>) {
    if (!newName.value.trim())
      return

    loading.value = true

    try {
      const { data: addedNames, error } = await useFetch<SerializedName[]>('/api/names', {
        method: 'POST',
        query: {
          babyId: babyId.value,
        },
        body: [{
          name: newName.value,
        }],
      })

      if (error.value) {
        if (error.value.data?.message.includes('UNIQUE'))
          error.value.statusMessage = 'Already added as a name'

        toast.add({ title: error.value.statusMessage, color: 'red' })
        createError(error.value)
        loading.value = false
        return
      }
      // console.log('added names', addedNames)
      if (names.value && addedNames.value) {
        const message: string[] = []
        for (const addedName of addedNames.value) {
          names.value?.push(addedName)
          message.push(addedName.name)
        }

        toast.add({ title: `"${message.join()}" created.` })

        if (newNameInput.value && newName.value) {
          // clear the field
          newName.value = ''
          await nextTick()
          newNameInput.value.focus()
        }
      }
      return addedNames
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
    const { error } = await useFetch(`/api/names/${name.id}`, {
      method: 'DELETE',
      query: {
        babyId: babyId.value,
      },
    })
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
