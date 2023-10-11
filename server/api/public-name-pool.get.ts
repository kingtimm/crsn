import { eq, inArray, sql } from 'drizzle-orm'
import { z } from 'h3-zod'

const PublicNameShape = z.object({
  gender: z.enum(['m', 'f']),
})

export default eventHandler(async (event) => {
  const { gender } = await getValidatedQuery(event, PublicNameShape.parse)
  const query = useDb()?.select({ name: tables.namesPool.name }).from(tables.namesPool).where(eq(tables.namesPool.gender, gender.toUpperCase())).orderBy(sql`RANDOM()`).limit(2)
  const publicRandomNames = await useDb()?.select().from(tables.namesPool).where(inArray(tables.namesPool.name, query!))
  return publicRandomNames
})
