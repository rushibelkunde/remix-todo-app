// app/services/todo-service.server.ts
// Business logic for Todo operations.

import {
  getTodosByUser,
  countTodosByUser,
  createTodo,
  updateTodo,
  deleteTodo,
} from "~/db/repositories/todo-repository.server";
import { buildPaginationParams, calcTotalPages } from "~/utils/pagination";
import type { TodoStatus } from "~/types";

interface TodoQueryParams {
  category_id?: string | null;
  search?: string | null;
  searchParams: URLSearchParams;
}

/**
 * Fetches paginated todos for a user with optional filters.
 * Returns todos and total page count.
 */
export async function getUserTodos(userId: string, params: TodoQueryParams) {
  const { skip, take, records } = buildPaginationParams(params.searchParams);

  const where: Record<string, unknown> = {};

  if (params.category_id && params.category_id !== "all") {
    where.category_id = params.category_id;
  }

  if (params.search && params.search.trim() !== "") {
    where.title = { contains: params.search.trim(), mode: "insensitive" };
  }

  const [todos, totalCount] = await Promise.all([
    getTodosByUser(userId, where, skip, take),
    countTodosByUser(userId),
  ]);

  return {
    todos,
    total_pages: calcTotalPages(totalCount, records),
  };
}

export async function addTodo(data: {
  id: string;
  user_id: string;
  title: string;
  category_id?: string | null;
}) {
  return createTodo(data);
}

export async function editTodo(id: string, title: string) {
  return updateTodo(id, { title });
}

export async function removeTodo(id: string) {
  return deleteTodo(id);
}

export async function changeStatus(id: string, status: TodoStatus) {
  return updateTodo(id, { status });
}

export async function toggleBookmark(id: string, currentBookmarked: boolean) {
  return updateTodo(id, { bookmarked: !currentBookmarked });
}

export async function toggleComplete(id: string, currentCompleted: boolean) {
  return updateTodo(id, { completed: !currentCompleted });
}
