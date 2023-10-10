import { useValidatedBody, zh } from 'h3-zod'
import { eq } from 'drizzle-orm'
import { tables } from '#imports'

export default eventHandler(async (event) => {
  const { baby } = await assertOwner(event)

  const { firstNameId, middleNameId } = await useValidatedBody(event, {
    firstNameId: zh.intAsString,
    middleNameId: zh.intAsString,
  })

  const faveToInsert = {
    firstName: firstNameId,
    middleName: middleNameId,
    createdAt: new Date(),
  } satisfies tables.Faves

  const transaction = await useDb()?.transaction(async (tx) => {
    try {
      // insert all the names
      const addedFave = await tx.insert(tables.faves).values(faveToInsert).returning().get()
      const faveResults = await tx.query.faves.findFirst({
        where: eq(tables.faves.id, Number(addedFave.id)),
        with: {
          firstName: {
            columns: {
              name: true,
            },
          },
          middleName: {
            columns: {
              name: true,
            },
          },
        },
      })
      // create the relations
      const relations = {
        babyId: baby.id,
        faveId: addedFave.id,
      } satisfies tables.FavesToBaby

      await tx.insert(tables.favesToBabies).values(relations).returning().all()
      return faveResults
    }
    catch (error) {
      tx.rollback()
      createError({ statusCode: 500, statusMessage: `Could not add relations ${error}` })
    }
  })

  return transaction
})
