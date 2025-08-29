import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, COOKIE_NAME } from "@/lib/auth";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get(COOKIE_NAME)?.value;
	const user = await getUserFromToken(token);

	const isApi = pathname.startsWith("/api");
	const isAuthPage = pathname === "/login" || pathname === "/register";
	const isProtected = pathname === "/" || pathname.startsWith("/api/tickets") || pathname.startsWith("/tickets");

	if (isAuthPage && user) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	if (isProtected && !user) {
		if (isApi) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/api/tickets/:path*", "/tickets/:path*", "/login", "/register"],
};


