import { integer, primaryKey, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { randomUUID } from 'uncrypto'

export const names = sqliteTable('names', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, t => ({
  unq: unique().on(t.name),
}))

export type Name = InferSelectModel<typeof names>

export const faves = sqliteTable('faves', {
  id: integer('id').primaryKey(),
  firstName: integer('first_name_id').references(() => names.id),
  middleName: integer('middle_name_id').references(() => names.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, t => ({
  unq: unique().on(t.firstName, t.middleName),
}))

export type Faves = InferInsertModel<typeof faves>

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

export const babies = sqliteTable('babies', {
  id: integer('id').primaryKey(),
  userId: text('user_id').notNull(),
  lastName: text('last_name').notNull(),
  gender: text('gender'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const membership = sqliteTable('membership', {
  userId: text('user_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  babyId: integer('baby_id').references(() => babies.id),
  role: text('role').notNull(),
}, t => ({
  pk: primaryKey(t.babyId, t.userId),
}))

export const membershipInvitation = sqliteTable('membership_invitation', {
  inviteId: text('invite_id').primaryKey().notNull().$defaultFn(() => randomUUID()),
  babyId: integer('baby_id').notNull(),
  inviter: text('inviter_user_id').notNull(),
  expireAt: integer('expire_at', { mode: 'timestamp' }).notNull(),
})

// export const membershipInvitation = sqliteTable('membership_invitation', {
//   inviteId: text('invite_id').primaryKey().notNull().$defaultFn(() => randomUUID()),
//   babyId: integer('baby_id').notNull(),
//   inviter: text('inviter_user_id').notNull(),
//   expireAt: integer('expire_at', { mode: 'timestamp' }).notNull(),
// }, t => ({
//   membershipReference: foreignKey(() => ({
//     columns: [t.babyId, t.inviter],
//     foreignColumns: [membership.babyId, membership.userId],
//   })),
// }))

export const namesToBabies = sqliteTable('names_to_babies', {
  nameId: integer('name_id').notNull().references(() => names.id, { onDelete: 'cascade' }),
  babyId: integer('baby_id').notNull().references(() => babies.id, { onDelete: 'cascade' }),
}, t => ({
  pk: primaryKey(t.babyId, t.nameId),
}))

export type NameToBaby = InferInsertModel<typeof namesToBabies>

export const favesToBabies = sqliteTable('faves_to_babies', {
  position: integer('position').default(-1),
  faveId: integer('fave_id').notNull().references(() => faves.id),
  babyId: integer('baby_id').notNull().references(() => babies.id),
}, t => ({
  pk: primaryKey(t.babyId, t.faveId),
}))

export type FavesToBaby = InferInsertModel<typeof favesToBabies>

export const namesToBabiesRelations = relations(namesToBabies, ({ one }) => ({
  baby: one(babies, {
    fields: [namesToBabies.babyId],
    references: [babies.id],
  }),
  name: one(names, {
    fields: [namesToBabies.nameId],
    references: [names.id],
  }),
}))

export const favesToBabiesRelations = relations(favesToBabies, ({ one }) => ({
  baby: one(babies, {
    fields: [favesToBabies.babyId],
    references: [babies.id],
  }),
  fave: one(faves, {
    fields: [favesToBabies.faveId],
    references: [faves.id],
  }),
}))

export const babiesRelations = relations(babies, ({ many }) => ({
  relatedFaves: many(favesToBabies),
  relatedNames: many(namesToBabies),
}))

export const membershipRelations = relations(membership, ({ one }) => ({
  babyId: one(babies, {
    fields: [membership.babyId],
    references: [babies.id],
  }),
}))
