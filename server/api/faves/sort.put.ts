import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

const SortArrayShape = z.object({
  position: z.coerce.number(),
  faveId: z.coerce.number(),
  babyId: z.number().optional(),
}).array()

export default eventHandler(async (event) => {
  const { baby } = await assertOwner(event)

  const rows = await readValidatedBody(event, SortArrayShape.parse)

  const result = await useDb()?.transaction(async (tx) => {
    try {
      const results = []
      for (const row of rows) {
        // add the baby id
        row.babyId = baby.id
        const updateDbResult = await tx.update(tables.favesToBabies).set({ position: row.position }).where(and(
          eq(tables.favesToBabies.babyId, row.babyId),
          eq(tables.favesToBabies.faveId, row.faveId),
        ))
        results.push(updateDbResult)
      }

      if (!results) {
        createError({
          statusCode: 503,
          statusMessage: 'Update did not return any results',
        })
      }
      return 'OK'
    }
    catch {
      tx.rollback()
      createError({
        statusCode: 503,
        statusMessage: 'Could not update sort order.',
      })
    }
  })

  return result

  // const { state } = await useValidatedBody(event, {
  //   position: z.array(z),
  // })

  // const result = await useDb()?.insert(tables.favesSortState)
  //   .values({ id: 1, babyId: baby.id, state })
  //   .onConflictDoUpdate({ target: tables.favesSortState.id, set: { state } }).returning().get()
  // return result
})
