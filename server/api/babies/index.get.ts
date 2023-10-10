import { eq } from 'drizzle-orm'
import { clerkClient } from 'h3-clerk'

export default eventHandler(async (event) => {
  // List names for the current user
  const { userId } = event.context.auth

  if (!userId)
    throw createError({ statusCode: 403 })

  const user = await clerkClient.users.getUser(userId)

  // const names = await useDb()?.select().from(tables.babies).where(eq(tables.babies.userId, user.id)).all()

  const f = await useDb()?.query.membership.findMany({
    where: eq(tables.membership.userId, user.id),
    with: {
      babyId: true,
    },
  })

  return f?.map(row => row.babyId)
})
