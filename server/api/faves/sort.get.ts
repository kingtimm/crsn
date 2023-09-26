import { eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  // List names for the current user
  const state = await useDb()?.query.favesSortState.findFirst({
    where: eq(tables.favesSortState.id, 1),
  })
  console.log('-- returned', state)
  return state?.state
})
