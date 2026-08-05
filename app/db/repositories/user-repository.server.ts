// app/db/repositories/user-repository.server.ts
// Pure database access for the User model.
// No business logic — only Prisma queries.

import { db } from "~/db/client.server";

export async function findUserByUsername(username: string) {
  return db.user.findUnique({
    where: { username },
  });
}

export async function countUsersByUsername(username: string): Promise<number> {
  return db.user.count({
    where: { username },
  });
}

export async function createUser(data: {
  name: string;
  username: string;
  pass: string;
}) {
  return db.user.create({ data });
}
