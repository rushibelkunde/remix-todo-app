// app/utils/session.server.ts
// Session storage and auth session helpers.
// In remix-auth v4, session management is done manually — this module provides
// the helpers that replace the old authenticator.isAuthenticated() and
// authenticator.logout() APIs.

import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { AuthUser } from "./auth.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET ?? "s3cr3t_dev_only"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

const USER_SESSION_KEY = "user";

/**
 * Retrieves the authenticated user from the session.
 * Returns null if not authenticated.
 */
export async function getAuthUser(
  request: Request
): Promise<AuthUser | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get(USER_SESSION_KEY);
  return user ?? null;
}

/**
 * Returns the authenticated user or redirects to the failureRedirect path.
 */
export async function requireUser(
  request: Request,
  { failureRedirect = "/login" }: { failureRedirect?: string } = {}
): Promise<AuthUser> {
  const user = await getAuthUser(request);
  if (!user) throw redirect(failureRedirect);
  return user;
}

/**
 * Creates a session for the user and returns a redirect response.
 */
export async function createUserSession(
  user: AuthUser,
  redirectTo: string
): Promise<Response> {
  const session = await getSession();
  session.set(USER_SESSION_KEY, user);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

/**
 * Destroys the user session and redirects.
 */
export async function destroyUserSession(
  request: Request,
  redirectTo: string
): Promise<Response> {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

/**
 * If the user is already authenticated, redirect them away from auth pages.
 */
export async function redirectIfAuthenticated(
  request: Request,
  { successRedirect = "/home" }: { successRedirect?: string } = {}
): Promise<null> {
  const user = await getAuthUser(request);
  if (user) throw redirect(successRedirect);
  return null;
}
