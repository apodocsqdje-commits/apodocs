import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export type SessionRole = "SUPER_ADMIN" | "MODERATOR";

export interface SessionUser {
  id: string;
  username: string;
  role: SessionRole;
}

export const SESSION_COOKIE_NAME = "admin_session";

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || "apodocs-nador-secret-jwt-key-2026-production-ready";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

/**
 * Signs a JWT session token for an authenticated Admin.
 */
export async function signSessionToken(user: SessionUser): Promise<string> {
  return await new SignJWT({
    id: user.id,
    username: user.username,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

/**
 * Verifies a given JWT token string.
 */
export async function verifySessionToken(
  token: string | undefined
): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.id || !payload.role || !payload.username) {
      return null;
    }
    return {
      id: payload.id as string,
      username: payload.username as string,
      role: payload.role as SessionRole,
    };
  } catch {
    return null;
  }
}

/**
 * Retrieves the current session user from the HTTP-only cookie.
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return await verifySessionToken(token);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      ("digest" in error || "message" in error) &&
      (String((error as { digest?: string }).digest) === "HANGING_PROMISE_REJECTION" ||
        String((error as { message?: string }).message).includes("prerender"))
    ) {
      throw error;
    }
    console.error("Error reading session cookie:", error);
    return null;
  }
}

/**
 * Stores the session token in a secure, HTTP-only cookie.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

/**
 * Removes the session cookie (logout).
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
