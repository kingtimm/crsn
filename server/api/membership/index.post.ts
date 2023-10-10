import { eq } from 'drizzle-orm'
import { clerkClient } from 'h3-clerk'
import { z } from 'h3-zod'

export default eventHandler(async (event) => {
  const { userId } = event.context.auth

  if (!userId)
    throw createError({ statusCode: 403 })

  const user = await clerkClient.users.getUser(userId)

  const InviteAcceptShape = z.object({
    inviteId: z.string().uuid(),
  })

  const { inviteId } = await getValidatedQuery(event, InviteAcceptShape.parse)

  const invite = await useDb()?.query.membershipInvitation.findFirst({
    where: eq(tables.membershipInvitation.inviteId, inviteId),
  })

  const membership = await useDb()?.insert(tables.membership).values({
    role: 'guest',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: user.id,
    babyId: invite!.babyId,
  }).returning().get()

  return membership
})
