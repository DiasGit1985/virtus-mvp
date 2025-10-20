import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _client: postgres.Sql | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL);
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
      _client = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    // Para PostgreSQL, usamos INSERT ... ON CONFLICT
    await db.insert(users).values({
      id: user.id,
      email: user.email,
      username: user.username,
      passwordHash: user.passwordHash,
      adminType: user.adminType,
      spiritualMaturity: user.spiritualMaturity,
      commitmentEndDate: user.commitmentEndDate,
      leaderId: user.leaderId,
      approvalStatus: user.approvalStatus,
      isApproved: user.isApproved,
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        email: user.email,
        username: user.username,
        passwordHash: user.passwordHash,
        adminType: user.adminType,
        spiritualMaturity: user.spiritualMaturity,
        commitmentEndDate: user.commitmentEndDate,
        leaderId: user.leaderId,
        approvalStatus: user.approvalStatus,
        isApproved: user.isApproved,
        updatedAt: new Date(),
      }
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

