import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { tickets } from "@/db/schema";
import { COOKIE_NAME, getUserFromToken } from "@/lib/auth";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

function getAuthFromRequest(request: NextRequest) {
	const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
	const authHeader = request.headers.get("authorization");
	const bearer = authHeader?.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : undefined;
	return bearer || cookieToken || null;
}

export async function GET(request: NextRequest) {
	const token = getAuthFromRequest(request);
	const user = await getUserFromToken(token);
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const list = await db.select().from(tickets).where(eq(tickets.userId, Number(user.sub)));
	return NextResponse.json({ tickets: list });
}

export async function POST(request: NextRequest) {
	const token = getAuthFromRequest(request);
	const user = await getUserFromToken(token);
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await request.json();
	const title = String(body?.title ?? "").trim();
	const description = String(body?.description ?? "").trim();
	if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

	const rows = await db
		.insert(tickets)
		.values({ userId: Number(user.sub), title, description })
		.returning();
	const created = rows[0]!;

	return NextResponse.json({ ticket: created }, { status: 201 });
}


