export default eventHandler(async (_event) => {
  // List faves for the current user
  const f = await useDb()?.query.faves.findMany({
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

  return f
})
