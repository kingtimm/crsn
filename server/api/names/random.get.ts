import { inArray } from 'drizzle-orm'

export default eventHandler(async (event) => {
  // List names for the current user
  const nameIds = await useDb()?.select(
    { id: tables.names.id },
  ).from(tables.names)

  if (nameIds && nameIds.length > 1) {
    const idxs = nameIds.map(cur => cur.id)
    // Shuffle array
    const shuffled = idxs.sort(() => 0.5 - Math.random())

    // Get sub-array of first n elements after shuffled
    const selected = shuffled.slice(0, 2)

    const randoms = await useDb()?.select().from(tables.names).where(inArray(tables.names.id, selected))
    return randoms?.sort(() => 0.5 - Math.random())
  }
})
