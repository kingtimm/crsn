import { eq } from 'drizzle-orm'
import { clerkClient } from 'h3-clerk'
import { z } from 'h3-zod'

const InviteAcceptShape = z.object({
  inviteId: z.string().uuid(),
})

export default eventHandler(async (event) => {
  // Make sure we're owner of this baby!

  const { inviteId } = await getValidatedQuery(event, InviteAcceptShape.parse)

  const invite = await useDb()?.query.membershipInvitation.findFirst({
    where: eq(tables.membershipInvitation.inviteId, inviteId),
  })
  if (invite) {
    const user = await clerkClient.users.getUser(invite?.inviter)

    return { user, ...invite }
  }
})
