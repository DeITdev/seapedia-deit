import "server-only";

import { cookies } from "next/headers";

import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/constants";
import {
  signSession,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/auth/jwt";

export type { SessionPayload } from "@/lib/auth/jwt";
export { computeInitialActiveRole, verifySessionToken } from "@/lib/auth/jwt";

/** Read and verify the current session from the request cookies. */
export async function getServerSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Issue a session cookie (httpOnly, sameSite=lax). */
export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** Clear the session cookie (logout). */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
