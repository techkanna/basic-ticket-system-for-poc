import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
	const res = NextResponse.json({ ok: true });
	res.cookies.set({ name: COOKIE_NAME, value: "", path: "/", httpOnly: true, maxAge: 0 });
	return res;
}


