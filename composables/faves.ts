import { Name } from "~/server/db/schema";

interface Row {
  id: number,
  firstName?: string;
  middleName?: string;
  createdAt: string
}

export default function useFaves() {
  // const rows = computed<Row[]>(() => {
  //   const rows: Row[] = []
  //   if (!faves.value) {
  //     return rows
  //   }
  //   let row: Row
  //   for (const item of faves.value) {
  //     row = {
  //       id: item.id,
  //       createdAt: item.createdAt,
  //       middleName: item.middleName?.name,
  //       firstName: item.firstName?.name
  //     }
  //     rows.push(row)
  //   }
  //   return rows
  // })

  const loading = ref(false)  
  const { data: faves, refresh } = useFetch('/api/faves')
  const toast = useToast()

  async function addFave(randomNames: Name[] | null) {
    if (randomNames) {
      console.log(randomNames)
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

        refresh()
        
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
      refresh()
      toast.add({ title: `Fave deleted.` })
    } catch (err) {
      if (err.data?.data?.issues) {
        const title = err.data.data.issues.map(issue => issue.message).join('\n')
        toast.add({ title, color: 'red' })
      }
    }
  }
  return {
    deleteFave,
    faves,
    refresh,
    addFave,
    loading
  }
}