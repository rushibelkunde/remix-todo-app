// app/utils/auth.server.ts
// remix-auth v4 setup.
// v4 removed session management from Authenticator — sessions are handled manually.
// authenticate() now returns the user directly; redirects are done in the caller.

import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcryptjs";
import { findUserByUsername } from "~/db/repositories/user-repository.server";

export type AuthUser = {
  uid: string;
  name: string;
  username: string;
};

export const authenticator = new Authenticator<AuthUser>();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get("username") as string;
    const pass = form.get("password") as string;

    const user = await findUserByUsername(username);

    if (!user) {
      throw new Error("User does not exist.");
    }

    const passwordMatch = await bcrypt.compare(pass, user.pass);

    if (!passwordMatch) {
      throw new Error("Invalid credentials.");
    }

    return {
      uid: user.uid,
      name: user.name,
      username: user.username,
    };
  }),
  "form"
);
