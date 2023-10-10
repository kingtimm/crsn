import { and, eq } from 'drizzle-orm'
import { useValidatedParams, zh } from 'h3-zod'

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString,
  })

  const { baby } = await assertOwner(event)

  // use a transaction
  return await useDb()?.transaction(async (tx) => {
    try {
      // delete relations
      await tx.delete(tables.namesToBabies).where(and(
        eq(tables.namesToBabies.babyId, baby.id),
        eq(tables.namesToBabies.nameId, id),
      )).returning().get()

      // delete the name itself
      const deletedName = await tx.delete(tables.names).where(and(
        eq(tables.names.id, id),
      )).returning().get()

      if (!deletedName) {
        throw createError({
          statusCode: 404,
          message: 'Todo not found',
        })
      }

      return deletedName
    }
    catch (error) {
    // @ts-expect-error need to type errors for the catch
      if (error?.message.includes('SQLITE_CONSTRAINT')) {
        throw createError({
          statusCode: 500,
          message: 'This name is in favorites. Please delete favorites with this name first.',
        })
      }
      else {
        tx.rollback()
        throw error
      }
    }
  })
})
