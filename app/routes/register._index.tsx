// app/routes/register._index.tsx
// Register route — creates user via auth-service then creates a session manually.

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { authenticator } from "~/utils/auth.server";
import { createUserSession, redirectIfAuthenticated } from "~/utils/session.server";
import { registerUser } from "~/services/auth-service.server";
import { findUserByUsername } from "~/db/repositories/user-repository.server";

// ─── Loader ─────────────────────────────────────────────────────────────────

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await redirectIfAuthenticated(request, { successRedirect: "/home" });
  return null;
};

// ─── Action ─────────────────────────────────────────────────────────────────

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const name = form.get("name") as string;
  const username = form.get("username") as string;
  const password = form.get("password") as string;

  const error = await registerUser({ name, username, password });
  if (error) return json(error, { status: 400 });

  // Fetch the created user to build the session object
  const user = await findUserByUsername(username);
  if (!user) return json({ error: "Registration failed unexpectedly." }, { status: 500 });

  return createUserSession(
    { uid: user.uid, name: user.name, username: user.username },
    "/home"
  );
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const data = useActionData<typeof action>();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">✓</span>
        </div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start organizing your day</p>

        <Form method="POST" className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">Full Name</label>
            <input
              id="reg-name"
              type="text"
              name="name"
              className="form-input"
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-username" className="form-label">Username</label>
            <input
              id="reg-username"
              type="text"
              name="username"
              className="form-input"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Create a password"
              required
            />
          </div>

          {data && "error" in data && (
            <p className="form-error" role="alert">{data.error}</p>
          )}

          <button type="submit" className="btn btn-primary btn-full">
            Create Account
          </button>
        </Form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
