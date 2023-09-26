import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config()

if (!process.env.TURSO_DB_URL)
  process.env.TURSO_DB_URL = ''

export default {
  out: './server/db/migrations',
  schema: './server/db/schema.ts',
  breakpoints: true,
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_DB_TOKEN,
  },
} satisfies Config
