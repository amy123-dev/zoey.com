import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';
export const progress = sqliteTable('progress', {
 userId:text('user_id').notNull(), cardId:text('card_id').notNull(), level:integer('level').notNull(), due:integer('due').notNull(), attempts:integer('attempts').notNull(), wrong:integer('wrong').notNull(), updated:integer('updated').notNull(),
},t=>[primaryKey({columns:[t.userId,t.cardId]})]);
export const events = sqliteTable('review_events', {id:text('id').primaryKey(),userId:text('user_id').notNull(),cardId:text('card_id').notNull(),grade:integer('grade').notNull(),at:integer('at').notNull()},t=>[index('idx_review_user_at').on(t.userId,t.at)]);
export const courseImports = sqliteTable('course_imports', {id:text('id').primaryKey(),userId:text('user_id').notNull(),fileName:text('file_name').notNull(),objectKey:text('object_key').notNull(),contentType:text('content_type').notNull(),size:integer('size').notNull(),status:text('status').notNull(),createdAt:integer('created_at').notNull()},t=>[index('idx_course_imports_user_created').on(t.userId,t.createdAt)]);
