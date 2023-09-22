import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations, type InferSelectModel } from 'drizzle-orm';

export const names = sqliteTable('names', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export type Name = InferSelectModel<typeof names>

export const faves = sqliteTable('faves', {
  id: integer('id').primaryKey(),
  firstName: integer('first_name_id').references(() => names.id),
  middleName: integer('middle_name_id').references(() => names.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const favoriteRelations = relations(faves, ({ one }) => ({
  firstName: one(names, {
    fields: [faves.firstName],
    references: [names.id],
  }),
  middleName: one(names, {
    fields: [faves.middleName],
    references: [names.id],
  }),
}))

export const favesSortState = sqliteTable('favesSortState', {
  id: integer('id').primaryKey(),
  state: text('state', { mode:'json' })
})