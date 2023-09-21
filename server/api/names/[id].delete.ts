import { eq, and } from 'drizzle-orm'
import { useValidatedParams, zh } from 'h3-zod'

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })

  // List todos for the current user
  const deletedTodo = await useDb().delete(tables.names).where(and(
    eq(tables.names.id, id),
  )).returning().get()
  
  if (!deletedTodo) {
    throw createError({
      statusCode: 404,
      message: 'Todo not found'
    })
  }
  return deletedTodo
})