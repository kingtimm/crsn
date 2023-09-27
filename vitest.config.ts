import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  // any custom vitest config you require
  test: {
    dir: 'tests',
    environmentOptions: {
      nuxt: {
        domEnvironmnet: 'happy-dom',
      },
    },
    globals: true,
  },
})
