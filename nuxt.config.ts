// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from 'nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  runtimeConfig: {
    dbDir: resolve('./server/db'),
  },
  ui: {
    icons: ['heroicons', 'simple-icons'],
  },
  devtools: { enabled: true },
  modules: ['@nuxt/ui']
})
