// app/services/category-service.server.ts
// Business logic for Category operations.

import {
  getCategoriesByUser,
  createCategory,
  updateCategory,
  deleteCategory,
} from "~/db/repositories/category-repository.server";

export async function getUserCategories(userId: string) {
  return getCategoriesByUser(userId);
}

export async function addCategory(data: {
  id: string;
  user_id: string;
  category_name: string;
  display_name: string;
}) {
  return createCategory(data);
}

export async function editCategory(id: string, title: string) {
  return updateCategory(id, {
    category_name: title,
    display_name: title,
  });
}

export async function removeCategory(id: string) {
  return deleteCategory(id);
}
