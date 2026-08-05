// app/db/repositories/todo-repository.server.ts
// Pure database access for the Todo model.
// No business logic — only Prisma queries.

import { db } from "~/db/client.server";
import type { TodoStatus } from "~/types";

interface TodoWhereInput {
  user_id: string;
  category_id?: string;
  title?: { contains: string; mode?: "insensitive" };
}

export async function getTodosByUser(
  userId: string,
  where: Omit<TodoWhereInput, "user_id">,
  skip: number,
  take: number
) {
  const whereCondition: TodoWhereInput = { user_id: userId, ...where };

  return db.todo.findMany({
    where: whereCondition,
    orderBy: { created_at: "desc" },
    skip,
    take,
  });
}

export async function countTodosByUser(userId: string): Promise<number> {
  return db.todo.count({ where: { user_id: userId } });
}

export async function createTodo(data: {
  id: string;
  user_id: string;
  title: string;
  category_id?: string | null;
}) {
  return db.todo.create({ data });
}

export async function updateTodo(
  id: string,
  data: Partial<{
    title: string;
    status: TodoStatus;
    completed: boolean;
    bookmarked: boolean;
  }>
) {
  return db.todo.update({ where: { id }, data });
}

export async function deleteTodo(id: string) {
  return db.todo.delete({ where: { id } });
}
