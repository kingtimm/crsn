import { Name } from "~/server/db/schema";
import { defineStore } from "pinia"

interface Row {
  id: number,
  firstName?: string;
  middleName?: string;
  createdAt: string
}

export type SortArray = string[]

export const useFaves = defineStore('faves', () => {
  const loading = ref(false)
  const { data: faves, refresh } = useFetch('/api/faves')
  const toast = useToast()

  const sortState = ref() as Ref<SortArray>

  const _sortableInstance = {
    // by default this will just give the value, but the faves component takes this over
    fn: () => sortState.value
  }

  function setSortableInstance(fn: (()=>SortArray)) {
    _sortableInstance.fn = fn
    return _sortableInstance.fn
  }

  async function getSortableArray() {
    await nextTick()
    const srt = _sortableInstance.fn()
    return srt
  }

  async function storeSortOrder(arr: SortArray) {
    // putting in next tick
    await nextTick()
    sortState.value = arr
    updateFavesOrder(sortState.value)
    await persistStateToDb(sortState.value)
  }

  async function persistStateToDb(arr: SortArray) {
    return await useLazyFetch('/api/faves/sort', {
      method: 'PUT',
      body: {
        state: arr
      }
    })
  }

  async function getStateFromDb() {
    const { data, ...all } = await useLazyFetch<SortArray>('/api/faves/sort')
    if (data.value) {
      sortState.value = data.value
      updateFavesOrder(sortState.value)
    }
    return { data, ...all }
  }

  async function addFave(randomNames: Name[] | null) {
    if (randomNames) {
      const firstName = randomNames[0]
      const middleName = randomNames[1]

      loading.value = true

      try {
        const { data: fave, } = await useFetch('/api/faves', {
          method: 'POST',
          body: {
            firstNameId: `${firstName.id}`,
            middleNameId: `${middleName.id}`
          }
        })

        // get the correct ids from sortable
        await refresh()
        await storeSortOrder(await getSortableArray())

        toast.add({ title: `Favorited` })
      } catch (err: any) {
        if (err.data?.data?.issues) {
          const title = err.data.data.issues.map((issue: any) => issue.message).join('\n')
          toast.add({ title, color: 'red' })
        }
      }
    }
    loading.value = false
  }

  async function deleteFave(id: number) {
    try {
      await useFetch(`/api/faves/${id}`, { method: 'DELETE' })

      if (faves.value) {
        faves.value = faves.value.filter(t => t.id !== id)
      }
      // get the correct ids from sortable
      await refresh()
      await storeSortOrder(await getSortableArray())
      toast.add({ title: `Fave deleted.` })
    } catch (err: any) {
      if (err.data?.data?.issues) {
        const title = err.data.data.issues.map((issue: any) => issue.message).join('\n')
        toast.add({ title, color: 'red' })
      }
    }
  }

  // this updates the data store with the array value either from sortable or the db
  function updateFavesOrder(arr: SortArray) {
    const order = arr.map((x: string) => Number(x))
    if (faves.value) {
      faves.value = [...faves.value].sort((a, b) => {
        const first = order.indexOf(a.id)
        const second = order.indexOf(b.id)
        return (first - second)
      })
    }
  }

  return {
    sortState,
    deleteFave,
    faves,
    refresh,
    addFave,
    loading,
    getStateFromDb,
    storeSortOrder,
    setSortableInstance
  }
}
)