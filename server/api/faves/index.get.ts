import { asc, eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const { baby } = await assertOwner(event)

  const faves = await useDb()?.query.favesToBabies.findMany({
    where: eq(tables.favesToBabies.babyId, Number(baby.id)),
    orderBy: [asc(tables.favesToBabies.position)],
    columns: { position: true },
    with: {
      fave: {
        columns: { id: true },
        with: {
          firstName: {
            columns: {
              name: true,
            },
          },
          middleName: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  })
  const result = faves?.map((row) => {
    return {
      position: row.position,
      ...row.fave,
    }
  })
  return result
})
