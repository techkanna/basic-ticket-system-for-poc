import { env } from "@/data/env/server"
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const shouldUseSSL = process.env.DB_SSL === "1" || process.env.DB_SSL === "true";
const pool = new Pool({
	connectionString: env.DATABASE_URL,
	ssl: shouldUseSSL ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool);


