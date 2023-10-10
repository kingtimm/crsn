import type { InferInsertModel } from 'drizzle-orm'
import { z } from 'h3-zod'
import { tables } from '#imports'

const NameShape = z.object({
  name: z.string(),
}).array()

export default eventHandler(async (event) => {
  const { baby } = await assertOwner(event)

  const namesToInsert = await readValidatedBody(event, NameShape.parse)

  // Handles a single name as text or an array
  const namesList: InferInsertModel<typeof tables.names>[] = []
  namesToInsert.map(row => namesList.push({
    name: row.name,
    createdAt: new Date(),
  }))

  // do via a transaction for rollback
  return await useDb()?.transaction(async (tx) => {
    try {
      // insert all the names
      const nameResults = await tx.insert(tables.names).values(namesList).returning().all()

      // create the relations
      const relations = nameResults.map((row) => {
        return {
          babyId: baby.id,
          nameId: row.id,
        } satisfies tables.NameToBaby
      })

      await tx.insert(tables.namesToBabies).values(relations).returning().all()
      return nameResults
    }
    catch (error) {
      tx.rollback()
      createError({ statusCode: 500, statusMessage: `Could not add relations ${error}` })
    }
  })
})
