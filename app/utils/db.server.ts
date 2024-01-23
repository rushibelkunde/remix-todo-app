import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
  // Connect in production with error handling
  db.$connect().catch((error) => {
    console.error("Error connecting to Prisma client:", error);
    process.exit(1); // Exit the process in case of connection failure
  });
} else {
  // In development, create a new Prisma client for each request
  db = new PrismaClient();
  // Connect in development with error handling
  db.$connect().catch((error) => {
    console.error("Error connecting to Prisma client:", error);
    process.exit(1); // Exit the process in case of connection failure
  });
}

// Ensure to disconnect the Prisma client when the application shuts down
process.on("beforeExit", async () => {
  await db.$disconnect();
});

export { db };
