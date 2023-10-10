import { eq } from 'drizzle-orm'
import assertOwner from '~/server/utils/assertOwner'

export default eventHandler(async (event) => {
  // get user
  const { baby } = await assertOwner(event)

  const names = await useDb()?.query.namesToBabies.findMany({
    where: eq(tables.namesToBabies.babyId, Number(baby.id)),
    columns: {},
    with: {
      name: true,
    },
  })

  return names?.map(row => row.name)
})
