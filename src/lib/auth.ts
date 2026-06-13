import * as jose from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.AUTH_SECRET || "startflow_super_secret_key_1234567890_at_least_32_chars";
const KEY = new TextEncoder().encode(JWT_SECRET);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return await new jose.SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(KEY);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jose.jwtVerify(token, KEY);
    return payload as unknown as SessionUser;
  } catch (_error) {
    return null;
  }
}

// Since Next.js cookies() can only be called in Server Actions/Route Handlers,
// we will export helper functions that accept the cookies store or retrieve it dynamically.
export async function getSession(): Promise<SessionUser | null> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch (_e) {
    return null;
  }
}
