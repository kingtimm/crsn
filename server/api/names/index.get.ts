import { eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  // get user
  const { baby } = await assertOwner(event)

  const names = await useDb()?.query.namesToBabies.findMany({
    where: eq(tables.namesToBabies.babyId, baby?.id),
    columns: {},
    with: {
      name: true,
    },
  })

  return names?.map(row => row.name)
})
