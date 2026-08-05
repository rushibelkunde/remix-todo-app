// app/services/auth-service.server.ts
// Business logic for user authentication and registration.

import bcrypt from "bcryptjs";
import {
  countUsersByUsername,
  createUser,
} from "~/db/repositories/user-repository.server";
import type { RegisterData } from "~/types";

const SALT_ROUNDS = 10;

/**
 * Registers a new user.
 * Returns an error string if the username is taken, otherwise creates the user.
 */
export async function registerUser(
  data: RegisterData
): Promise<{ error: string } | null> {
  const existing = await countUsersByUsername(data.username);

  if (existing > 0) {
    return { error: "Username already taken. Please choose another." };
  }

  const hashedPass = await bcrypt.hash(data.password, SALT_ROUNDS);

  await createUser({
    name: data.name,
    username: data.username,
    pass: hashedPass,
  });

  return null;
}
