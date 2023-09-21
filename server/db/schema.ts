import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const names = sqliteTable('names', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  completed: integer('completed').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})