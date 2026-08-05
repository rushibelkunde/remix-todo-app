// app/db/repositories/category-repository.server.ts
// Pure database access for the Category model.
// No business logic — only Prisma queries.

import { db } from "~/db/client.server";

export async function getCategoriesByUser(userId: string) {
  return db.category.findMany({
    where: { user_id: userId },
    orderBy: { category_name: "asc" },
  });
}

export async function createCategory(data: {
  id: string;
  user_id: string;
  category_name: string;
  display_name: string;
}) {
  return db.category.create({ data });
}

export async function updateCategory(
  id: string,
  data: { category_name: string; display_name: string }
) {
  return db.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  return db.category.delete({ where: { id } });
}
