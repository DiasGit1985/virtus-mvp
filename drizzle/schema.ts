import { 
  pgTable, 
  text, 
  timestamp, 
  varchar,
  uuid,
  integer,
  boolean,
  pgEnum,
  foreignKey
} from "drizzle-orm/pg-core";

/**
 * Enum para tipo de administrador
 */
export const adminTypeEnum = pgEnum('admin_type', ['creator', 'leader']);

/**
 * Enum para status de aprovação
 */
export const approvalStatusEnum = pgEnum('approval_status', ['pending', 'approved', 'rejected']);

/**
 * Tabela de Usuários
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 320 }).unique().notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }),
  adminType: adminTypeEnum("admin_type"), // 'creator', 'leader', ou NULL
  spiritualMaturity: varchar("spiritual_maturity", { length: 50 }), // Iniciante, Aprendiz, etc.
  commitmentEndDate: timestamp("commitment_end_date"),
  leaderId: uuid("leader_id"),
  approvalStatus: approvalStatusEnum("approval_status").default('pending'),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de Atividades Paroquiais
 */
export const parishActivities = pgTable("parish_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Domingo-Sábado)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ParishActivity = typeof parishActivities.$inferSelect;
export type InsertParishActivity = typeof parishActivities.$inferInsert;

/**
 * Tabela de Participações do Usuário em Atividades
 */
export const userActivities = pgTable("user_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  activityId: uuid("activity_id").notNull().references(() => parishActivities.id),
  dayOfWeek: integer("day_of_week").notNull(), // Dia que o usuário participa
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = typeof userActivities.$inferInsert;

/**
 * Enum para tipo de virtude
 */
export const virtueTypeEnum = pgEnum('virtue_type', ['virtue', 'reading']);

/**
 * Tabela de Virtudes e Leituras
 */
export const virtues = pgTable("virtues", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  type: virtueTypeEnum("type").notNull(), // 'virtue' ou 'reading'
  description: text("description"), // Descrição da virtude
  bookName: varchar("book_name", { length: 255 }), // Nome do livro (para leituras)
  minutesSpent: integer("minutes_spent"), // Tempo gasto em leitura
  isCompleted: boolean("is_completed").default(false), // Se a leitura foi finalizada
  isPublished: boolean("is_published").default(false), // Se foi publicado no mural
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Virtue = typeof virtues.$inferSelect;
export type InsertVirtue = typeof virtues.$inferInsert;

/**
 * Tabela de Livros Customizados
 */
export const customBooks = pgTable("custom_books", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type CustomBook = typeof customBooks.$inferSelect;
export type InsertCustomBook = typeof customBooks.$inferInsert;

/**
 * Tabela de Tokens de Convite
 */
export const inviteTokens = pgTable("invite_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  createdById: uuid("created_by_id").notNull().references(() => users.id),
  usedById: uuid("used_by_id").references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InviteToken = typeof inviteTokens.$inferSelect;
export type InsertInviteToken = typeof inviteTokens.$inferInsert;

/**
 * Tabela de Mensagens Privadas
 */
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id").notNull().references(() => users.id),
  recipientId: uuid("recipient_id").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

