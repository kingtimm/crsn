export default eventHandler(async (_event) => {
  // List names for the current user
  const names = await useDb()?.select().from(tables.names).all()

  return names
})
