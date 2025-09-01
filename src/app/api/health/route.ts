import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
	try {
		// 1) Basic env presence
		const envCheck = {
			nodeEnv: process.env.NODE_ENV ?? null,
			jwt: process.env.JWT_SECRET ? true : false,
			dbUrl: process.env.DB_HOST ? "parts" : null,
			ssl: process.env.DB_SSL ?? null,
		};

		// 2) DB connectivity and simple query
		await db.execute(sql`select 1`);
		const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);

		return NextResponse.json(
			{
				ok: true,
				env: envCheck,
				database: {
					connected: true,
					userCount: Number(userCount?.[0]?.count ?? 0),
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("[api/health] error:", error);
		return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
	}
}


