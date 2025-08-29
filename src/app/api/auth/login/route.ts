import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import { COOKIE_NAME, createJwt } from "@/lib/auth";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(request: Request) {
	const body = await request.json();
	const email = String(body?.email ?? "").trim().toLowerCase();
	const password = String(body?.password ?? "");
	if (!email || !password) {
		return NextResponse.json({ error: "email and password are required" }, { status: 400 });
	}

	const user = db.select().from(users).where(eq(users.email, email)).get();
	if (!user) {
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}
	const ok = await verifyPassword(password, user.passwordHash);
	if (!ok) {
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}

	const token = await createJwt({ sub: String(user.id), email: user.email, name: user.name });
	const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
	res.cookies.set({ name: COOKIE_NAME, value: token, httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7 });
	return res;
}


