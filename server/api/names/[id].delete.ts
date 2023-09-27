import { and, eq } from 'drizzle-orm'
import { useValidatedParams, zh } from 'h3-zod'

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString,
  })

  // List todos for the current user
  try {
    const deletedTodo = await useDb()?.delete(tables.names).where(and(
      eq(tables.names.id, id),
    )).returning().get()
    if (!deletedTodo) {
      throw createError({
        statusCode: 404,
        message: 'Todo not found',
      })
    }
    return deletedTodo
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
      throw error
    }
  }
})
