// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from 'nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
      ],
      bodyAttrs: {
        class: ['bg-gray-200', 'dark:bg-gray-950'],
      },
    },
  },
  runtimeConfig: {
    dbDir: resolve('./server/db'),
    public: {
      clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    },
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
  },
  ui: {
    icons: ['heroicons', 'simple-icons'],
    safelistColors: ['primary', 'gray'],
  },
  colorMode: {
    preference: 'light',
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: ['@nuxt/ui', '@pinia/nuxt', 'nuxt-vitest'],
  build: {
    transpile: ['vue-clerk', '@clerk/clerk-js'],
  },
})