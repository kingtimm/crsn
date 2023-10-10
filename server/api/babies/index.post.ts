import { clerkClient } from 'h3-clerk'
import { z } from 'h3-zod'

const InsertBabyShape = z.object({
  lastName: z.string().min(2).max(50),
})

export default eventHandler(async (event) => {
  const { userId } = event.context.auth

  if (!userId)
    throw createError({ statusCode: 403 })

  const { lastName } = await readValidatedBody(event, InsertBabyShape.parse)

  const user = await clerkClient.users.getUser(userId)

  const txResult = await useDb()?.transaction(async (tx) => {
    try {
      const userResult = await tx.insert(tables.babies).values({
        userId: user.id,
        createdAt: new Date(),
        lastName,
      }).returning().get()

      await tx.insert(tables.membership).values({
        role: 'owner',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user.id,
        babyId: userResult.id,
      }).returning().get()

      return userResult
    }
    catch {
      tx.rollback()
    }
  })

  return txResult
})
