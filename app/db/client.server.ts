// app/db/client.server.ts
// Hot-reload-safe Prisma singleton.
// Dev: reuses the global instance across HMR cycles.
// Prod: creates a single instance for the process lifetime.

import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __db__: PrismaClient | undefined;
}

let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
  }
  db = global.__db__;
}

export { db };
