import { and, eq } from 'drizzle-orm'
import { membershipInvitation } from '~/server/db/schema'

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export default eventHandler(async (event) => {
  // Make sure we're owner of this baby!
  const { user, baby } = await assertOwner(event)

  let invite
  invite = await useDb()?.query.membershipInvitation.findFirst({
    where: and(
      eq(membershipInvitation.inviter, user.id),
      eq(membershipInvitation.babyId, baby.id),
    ),
  })

  if (!invite) {
    invite = await useDb()?.insert(tables.membershipInvitation).values({
      inviter: user.id,
      expireAt: addDays(new Date(), 10),
      babyId: baby.id,
    }).returning().get()
  }

  return invite
})
