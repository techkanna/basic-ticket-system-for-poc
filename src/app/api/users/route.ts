import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/password";

export const runtime = "nodejs";

export async function GET() {
	const result = await db.select().from(users);
	return NextResponse.json({ users: result });
}

export async function POST(request: Request) {
	const body = await request.json();
	const name = String(body?.name ?? "").trim();
	const email = String(body?.email ?? "").trim().toLowerCase();
	const password = String(body?.password ?? "");
	if (!name || !email || !password) {
		return NextResponse.json({ error: "name, email and password are required" }, { status: 400 });
	}

	const passwordHash = await hashPassword(password);
	const insertedRows = await db
		.insert(users)
		.values({ name, email, passwordHash })
		.returning({ id: users.id, name: users.name, email: users.email });
	const inserted = insertedRows[0]!;

	return NextResponse.json({ user: inserted }, { status: 201 });
}


