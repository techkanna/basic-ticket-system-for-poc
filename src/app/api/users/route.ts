import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";

export const runtime = "nodejs";

export async function GET() {
	const result = db.select().from(users).all();
	return NextResponse.json({ users: result });
}

export async function POST(request: Request) {
	const body = await request.json();
	const name = String(body?.name ?? "").trim();
	const email = String(body?.email ?? "").trim();
	if (!name || !email) {
		return NextResponse.json({ error: "name and email are required" }, { status: 400 });
	}

	const inserted = db
		.insert(users)
		.values({ name, email })
		.returning()
		.get();

	return NextResponse.json({ user: inserted }, { status: 201 });
}


