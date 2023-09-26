export default eventHandler(async (event) => {
  // List names for the current user
  const names = await useDb().select().from(tables.names).all()

  return names
})
