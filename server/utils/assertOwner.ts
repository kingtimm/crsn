import { and, eq } from 'drizzle-orm'
import { clerkClient } from 'h3-clerk'
import { useValidatedQuery, z } from 'h3-zod'
import type { H3Event } from 'h3'

export default async function (event: H3Event) {
  // get user
  const { userId } = event.context.auth

  if (!userId)
    throw createError({ statusCode: 403 })

  const user = await clerkClient.users.getUser(userId)

  // ensure it's yo baby!
  const babyId = await useValidatedQuery(event, { babyId: z.string() })
  const baby = await useDb()?.query.babies.findFirst({
    where: and(
      eq(tables.babies.userId, user.id),
      eq(tables.babies.id, Number(babyId.babyId)),
    ),
  })
  if (!baby)
    throw createError({ statusCode: 403 })
  return {
    user,
    baby,
  }
}
