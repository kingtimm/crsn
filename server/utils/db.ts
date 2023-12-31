import { createClient as createLibSQLClient } from '@libsql/client/http'
import { drizzle as drizzleLibSQL } from 'drizzle-orm/libsql'
import * as schema from '~/server/db/schema'

export * as tables from '~/server/db/schema'

const config = { schema }

export function useDb() {
  if (process.env.TURSO_DB_URL && process.env.TURSO_DB_TOKEN) {
    // Turso in production
    const client = createLibSQLClient({
      url: process.env.TURSO_DB_URL,
      authToken: process.env.TURSO_DB_TOKEN,
    })
    const _db = drizzleLibSQL(client, config)

    if (!_db)
      throw new Error('No database configured for production')
    else
      return _db
  }
}
// export const useDb = () => {
//   if (!_db) {
//     if (process.env.TURSO_DB_URL && process.env.TURSO_DB_TOKEN) {
//       // Turso in production
//       const client = createLibSQLClient({
//         url: process.env.TURSO_DB_URL,
//         authToken: process.env.TURSO_DB_TOKEN
//       })
//       _db = drizzleLibSQL(client, config)
//     } else if (process.dev) {
//       // local sqlite in development
//       const { dbDir } = useRuntimeConfig()
//       const sqlite = new Database(join(dbDir, './db.sqlite'))
//       _db = drizzle(sqlite, config)
//     } else {
//       throw new Error('No database configured for production')
//     }
//   }
//   return _db
// }
