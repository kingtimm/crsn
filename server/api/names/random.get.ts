import { eq, inArray } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const { baby, user } = await assertOwner(event)

  const nameIds = await useDb()?.query.namesToBabies.findMany({
    where: eq(tables.namesToBabies.babyId, Number(baby.id)),
    columns: { nameId: true },
  })

  // const nameIds = await useDb()?.select(
  //   { id: tables.names.id },
  // ).from(tables.names)

  if (nameIds && nameIds.length > 1) {
    const idxs = nameIds.map(cur => cur.nameId)
    // Shuffle array
    const shuffled = idxs.sort(() => 0.5 - Math.random())

    // Get sub-array of first n elements after shuffled
    const selected = shuffled.slice(0, 2)

    const randoms = await useDb()?.select().from(tables.names).where(inArray(tables.names.id, selected))
    return {
      lastName: baby.lastName,
      randoms: randoms?.sort(() => 0.5 - Math.random()),
    }
  }
})
