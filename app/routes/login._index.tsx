// app/routes/login._index.tsx
// Login route — authenticates via remix-auth v4 FormStrategy, then creates session manually.

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, isRouteErrorResponse, useActionData, useRouteError } from "@remix-run/react";

import { authenticator } from "~/utils/auth.server";
import { createUserSession, redirectIfAuthenticated } from "~/utils/session.server";

// ─── Error Boundary ──────────────────────────────────────────────────────────

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-error-code">{error.status}</h1>
          <p className="auth-error-message">{error.data?.message ?? error.statusText}</p>
          <Link to="/login" className="btn btn-primary">Try again</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-error-code">Error</h1>
        <p className="auth-error-message">
          {error instanceof Error ? error.message : "An unknown error occurred."}
        </p>
        <Link to="/login" className="btn btn-primary">Try again</Link>
      </div>
    </div>
  );
}

// ─── Loader ─────────────────────────────────────────────────────────────────

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await redirectIfAuthenticated(request, { successRedirect: "/home" });
  return null;
};

// ─── Action ─────────────────────────────────────────────────────────────────

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const user = await authenticator.authenticate("form", request);
    return createUserSession(user, "/home");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";
    return json({ error: message }, { status: 401 });
  }
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function LoginPage() {
  const data = useActionData<typeof action>();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">✓</span>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        <Form method="POST" className="auth-form">
          <div className="form-group">
            <label htmlFor="login-username" className="form-label">Username</label>
            <input
              id="login-username"
              type="text"
              name="username"
              className="form-input"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          {data && "error" in data && (
            <p className="form-error" role="alert">{data.error}</p>
          )}

          <button type="submit" className="btn btn-primary btn-full">
            Sign In
          </button>
        </Form>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="auth-link">Register</Link>
        </p>
      </div>
    </div>
  );
}
