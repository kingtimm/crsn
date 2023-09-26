import type { InferInsertModel } from 'drizzle-orm'
import { useValidatedBody, z } from 'h3-zod'
import type { ZodTypeAny } from 'zod'
import { tables } from '#imports'

const NameShape = z.string().min(1).max(100)

function arrayFromString<T extends ZodTypeAny>(schema: T) {
  return z.preprocess((obj) => {
    if (Array.isArray(obj))
      return obj
    else if (typeof obj === 'string')
      return [obj]
    else
      return []
  }, z.array(schema))
}

export default eventHandler(async (event) => {
  const { name } = await useValidatedBody(event, {
    name: arrayFromString(NameShape),
  })

  // Handles a single name as text or an array
  const namesList: InferInsertModel<typeof tables.names>[] = []
  name.map(row => namesList.push({
    name: row,
    createdAt: new Date(),
  }))

  console.log('rs', name, namesList)
  const nameResult = await useDb()?.insert(tables.names).values(namesList).returning().all()
  return nameResult
})
