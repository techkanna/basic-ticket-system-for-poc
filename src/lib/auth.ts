import { env } from "@/data/env/server"
import { SignJWT, jwtVerify, JWTPayload } from "jose";

export const COOKIE_NAME = "auth_token";

function getJwtSecret(): Uint8Array {
	return new TextEncoder().encode(env.JWT_SECRET ?? "dev-secret");
}

export type AppJwtPayload = JWTPayload & {
	sub: string;
	email: string;
	name?: string;
};

export async function createJwt(payload: AppJwtPayload): Promise<string> {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(getJwtSecret());
}

export async function verifyJwt(token: string): Promise<AppJwtPayload> {
	const { payload } = await jwtVerify(token, getJwtSecret());
	return payload as AppJwtPayload;
}

export async function getUserFromToken(token?: string | null): Promise<AppJwtPayload | null> {
	if (!token) return null;
	try {
		return await verifyJwt(token);
	} catch {
		return null;
	}
}


