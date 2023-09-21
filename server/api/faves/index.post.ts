import { useValidatedBody, zh } from 'h3-zod'

export default eventHandler(async (event) => {
  const { firstNameId, middleNameId } = await useValidatedBody(event, {
    firstNameId: zh.intAsString,
    middleNameId: zh.intAsString
  })

  // List names for the current user
  const faveResult = await useDb()?.insert(tables.faves).values({
    firstName: firstNameId,
    middleName: middleNameId,
    createdAt: new Date()
  }).returning().get()

  return faveResult
})