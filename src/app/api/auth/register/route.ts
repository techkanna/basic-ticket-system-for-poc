import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { COOKIE_NAME, createJwt } from "@/lib/auth";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(request: Request) {
	const body = await request.json();
	const name = String(body?.name ?? "").trim();
	const email = String(body?.email ?? "").trim().toLowerCase();
	const password = String(body?.password ?? "");
	if (!name || !email || !password) {
		return NextResponse.json({ error: "name, email and password are required" }, { status: 400 });
	}

	const existing = db.select().from(users).where(eq(users.email, email)).get();
	if (existing) {
		return NextResponse.json({ error: "Email already registered" }, { status: 409 });
	}

	const passwordHash = await hashPassword(password);
	const inserted = db
		.insert(users)
		.values({ name, email, passwordHash })
		.returning()
		.get();

	const token = await createJwt({ sub: String(inserted.id), email: inserted.email, name: inserted.name });
	const res = NextResponse.json({ user: { id: inserted.id, name: inserted.name, email: inserted.email }, token }, { status: 201 });
	res.cookies.set({ name: COOKIE_NAME, value: token, httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7 });
	return res;
}


