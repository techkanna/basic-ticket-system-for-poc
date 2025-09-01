import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
	// Basic env presence (safe to expose booleans only)
	const envCheck = {
		nodeEnv: process.env.NODE_ENV ?? null,
		jwt: process.env.JWT_SECRET ? true : false,
		dbHost: process.env.DB_HOST ? true : false,
		dbUser: process.env.DB_USER ? true : false,
		dbName: process.env.DB_NAME ? true : false,
		ssl: process.env.DB_SSL ?? null,
	};

	let dbConnected = false;
	let dbError: string | null = null;
	let dbErrorInfo: { name?: string; code?: string; message?: string } | null = null;
	let countValue: number | null = null;

	try {
		await db.execute(sql`select 1`);
		dbConnected = true;
	} catch (err: unknown) {
		console.error("[api/health] db connect error:", err);
		dbError = "db-connect-failed";
		if (err && typeof err === "object") {
			const anyErr = err as any;
			dbErrorInfo = {
				name: anyErr?.name,
				code: anyErr?.code,
				message: String(anyErr?.message ?? "").slice(0, 300),
			};
		}
	}

	if (dbConnected) {
		try {
			const rows = await db.select({ count: sql<number>`count(*)` }).from(users);
			countValue = Number(rows?.[0]?.count ?? 0);
		} catch (err: unknown) {
			console.error("[api/health] db query error:", err);
			dbError = "db-query-failed";
			if (err && typeof err === "object") {
				const anyErr = err as any;
				dbErrorInfo = {
					name: anyErr?.name,
					code: anyErr?.code,
					message: String(anyErr?.message ?? "").slice(0, 300),
				};
			}
		}
	}

	return NextResponse.json(
		{
			ok: dbConnected && !dbError,
			env: envCheck,
			database: {
				connected: dbConnected,
				error: dbError,
				errorInfo: dbErrorInfo,
				userCount: countValue,
			},
		},
		{ status: 200 },
	);
}


