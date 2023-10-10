import { and, eq } from 'drizzle-orm'
import { clerkClient } from 'h3-clerk'
import { z } from 'h3-zod'
import type { H3Event } from 'h3'

const BabyIdShape = z.object({
  babyId: z.coerce.number(),
})

export default async function (event: H3Event) {
  // get user
  const { userId } = event.context.auth

  if (!userId)
    throw createError({ statusCode: 403, statusMessage: 'Not Authenticated' })

  const user = await clerkClient.users.getUser(userId)

  // ensure it's yo baby!
  // const babyId = await useValidatedQuery(event, { babyId: z.string() })
  const babyId = await getValidatedQuery(event, BabyIdShape.parse)
  // const baby = await useDb()?.query.babies.findFirst({
  //   where: and(
  //     eq(tables.babies.userId, user.id),
  //     eq(tables.babies.id, Number(babyId.babyId)),
  //   ),
  // })

  const baby = await useDb()?.query.membership.findFirst({
    where: and(
      eq(tables.membership.userId, user.id),
      eq(tables.membership.babyId, babyId.babyId),
    ),
    with: {
      babyId: true,
    },
  })
  if (!baby?.babyId)
    throw createError({ statusCode: 403, statusMessage: 'Forbidden access to that resource' })

  return {
    user,
    baby: baby.babyId,
  }
}
