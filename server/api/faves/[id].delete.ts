import { and, eq } from 'drizzle-orm'
import { useValidatedParams, zh } from 'h3-zod'

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString,
  })

  const { baby } = await assertOwner(event)

  return await useDb()?.transaction(async (tx) => {
    try {
      // delete relations
      await tx.delete(tables.favesToBabies).where(and(
        eq(tables.favesToBabies.babyId, baby.id),
        eq(tables.favesToBabies.faveId, id),
      )).returning().get()

      // delete the name itself
      const deletedFave = await tx.delete(tables.faves).where(and(
        eq(tables.faves.id, id),
      )).returning().get()

      if (!deletedFave) {
        throw createError({
          statusCode: 404,
          message: 'Todo not found',
        })
      }

      return deletedFave
    }
    catch (error) {
    // @ts-expect-error need to type errors for the catch
      if (error?.message.includes('SQLITE_CONSTRAINT')) {
        throw createError({
          statusCode: 500,
          message: 'Need to delete references to this favorite first.',
        })
      }
      else {
        tx.rollback()
        throw error
      }
    }
  })

  // // List todos for the current user
  // const deletedTodo = await useDb()?.delete(tables.faves).where(and(
  //   eq(tables.faves.id, id),
  // )).returning().get()

  // if (!deletedTodo) {
  //   throw createError({
  //     statusCode: 404,
  //     message: 'id not found',
  //   })
  // }
  // return deletedTodo
})
