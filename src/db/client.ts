import { env } from "@/data/env/server"
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const shouldUseSSL = process.env.DB_SSL === "1" || process.env.DB_SSL === "true";
const sslMode = (process.env.DB_SSL_MODE || "").toLowerCase();
const rejectUnauthorizedEnv = (process.env.DB_SSL_REJECT_UNAUTHORIZED || "").toLowerCase();
const sslCa = process.env.DB_SSL_CA; // optional PEM contents

let sslOptions: any | undefined = undefined;
if (shouldUseSSL || sslMode === "require" || sslMode === "verify-full") {
	sslOptions = { rejectUnauthorized: true };
}
if (rejectUnauthorizedEnv === "0" || rejectUnauthorizedEnv === "false") {
	sslOptions = { ...(sslOptions ?? {}), rejectUnauthorized: false };
}
if (sslCa) {
	sslOptions = { ...(sslOptions ?? {}), ca: sslCa };
}

const pool = new Pool({
	connectionString: env.DATABASE_URL,
	ssl: sslOptions,
});

export const db = drizzle(pool);


