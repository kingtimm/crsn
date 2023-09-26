import { useValidatedBody, z } from 'h3-zod'

export default eventHandler(async (evt) => {
  const { state } = await useValidatedBody(evt, {
    state: z.array(z.string()),
  })
  console.log('putting state', state)
  const result = await useDb()?.insert(tables.favesSortState)
    .values({ id: 1, state })
    .onConflictDoUpdate({ target: tables.favesSortState.id, set: { state } }).returning().get()
  return result
})
