import { useValidatedBody, z } from 'h3-zod'

export default eventHandler(async (event) => {
  const { name } = await useValidatedBody(event, {
    name: z.string().min(1).max(100)
  })

  // List names for the current user
  const todo = await useDb().insert(tables.names).values({
    name,
    createdAt: new Date()
  }).returning().get()

  return todo
})