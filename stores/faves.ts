import { defineStore, storeToRefs } from 'pinia'
import { useBaby } from './baby'
import type { FavesToBaby, Name } from '~/server/db/schema'

export type SortArray = string[]

type FaveResponse = Ref<{
  id: number
  firstName: {
    name: string
  } | null
  middleName: {
    name: string
  } | null
  position?: number | null
}[]> | Ref<null>

export const useFaves = defineStore('faves', () => {
  const loading = ref(false)
  const toast = useToast()
  const faves = ref(null) as FaveResponse
  const fetched = ref(false)

  const { babyId } = storeToRefs(useBaby())

  const sortState = ref() as Ref<SortArray>

  const _sortableInstance = {
    // by default this will just give the value, but the faves component takes this over
    fn: () => sortState.value,
  }

  function setSortableInstance(fn: (() => SortArray)) {
    _sortableInstance.fn = fn
    return _sortableInstance.fn
  }

  async function getSortableArray() {
    await nextTick()
    const srt = _sortableInstance.fn()
    return srt
  }

  // Gets the position and id for update
  function getSortPutArray() {
    if (fetched && faves.value) {
      return faves.value.map((row) => {
        const position = sortState.value.indexOf(row.id.toString()) ?? -1
        return {
          faveId: row.id,
          position,
        } satisfies Partial<FavesToBaby>
      })
    }
    return []
  }

  async function storeSortOrder(arr: SortArray) {
    // putting in next tick
    await nextTick()
    sortState.value = arr
    updateFavesOrder(sortState.value)
    await persistStateToDb()
  }

  async function persistStateToDb() {
    const body = getSortPutArray()
    return await useFetch('/api/faves/sort', {
      method: 'PUT',
      server: false,
      lazy: true,
      query: { babyId },
      body,
    })
  }

  // this updates the data store with the array value either from sortable
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

  const { data: favesResponse, refresh, execute } = useLazyFetch('/api/faves', {
    query: { babyId },
    immediate: false,
    server: false,
  })

  async function fetchFaves() {
    if (!faves.value)
      fetched.value = true

    await execute()
    faves.value = favesResponse.value
    return faves
  }

  async function addFave(randomNames: Omit<Name, 'createdAt'>[] | null) {
    if (randomNames) {
      const firstName = randomNames[0]
      const middleName = randomNames[1]

      loading.value = true

      try {
        const { data: addedFave, error } = await useLazyFetch('/api/faves', {
          method: 'POST',
          server: false,
          query: { babyId },
          body: {
            firstNameId: `${firstName.id}`,
            middleNameId: `${middleName.id}`,
          },
        })
        if (error.value) {
          if (error.value.data?.message.includes('UNIQUE'))
            error.value.statusMessage = 'Already added as a favorite'

          toast.add({ title: error.value.statusMessage, color: 'red' })
          createError(error.value)
          return
        }
        // get the correct ids from sortable
        if (addedFave.value && faves.value)
          faves.value.push(addedFave.value)

        await storeSortOrder(await getSortableArray())

        toast.add({ title: 'Favorited' })
      }
      catch (err: any) {
        if (err.data?.data?.issues) {
          const title = err.data.data.issues.map((issue: any) => issue.message).join('\n')
          toast.add({ title, color: 'red' })
        }
        else {
          // console.log(err)
        }
      }
    }
    loading.value = false
  }

  async function deleteFave(id: number) {
    try {
      await useFetch(`/api/faves/${id}`, { method: 'DELETE', query: { babyId } })

      if (faves.value)
        faves.value = faves.value.filter(t => t.id !== id)

      // get the correct ids from sortable
      await storeSortOrder(await getSortableArray())
      toast.add({ title: 'Fave deleted.' })
    }
    catch (err: any) {
      if (err.data?.data?.issues) {
        const title = err.data.data.issues.map((issue: any) => issue.message).join('\n')
        toast.add({ title, color: 'red' })
      }
    }
  }

  return {
    addFave,
    deleteFave,
    refresh,
    faves,
    sortState,
    fetchFaves,
    loading,
    storeSortOrder,
    setSortableInstance,
  }
})
