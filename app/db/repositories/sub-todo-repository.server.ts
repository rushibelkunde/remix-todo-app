// app/db/repositories/sub-todo-repository.server.ts
// Pure database access for the SubTodo model.
// No business logic — only Prisma queries.

import { db } from "~/db/client.server";
import type { TodoStatus } from "~/types";

export async function getSubTodosByTodo(todoId: string) {
  return db.subTodo.findMany({
    where: { todo_id: todoId },
    orderBy: { created_at: "asc" },
  });
}

export async function createSubTodo(data: {
  id: string;
  user_id: string;
  todo_id: string;
  title: string;
}) {
  return db.subTodo.create({ data });
}

export async function updateSubTodo(
  id: string,
  data: Partial<{
    title: string;
    status: TodoStatus;
    completed: boolean;
  }>
) {
  return db.subTodo.update({ where: { id }, data });
}

export async function deleteSubTodo(id: string) {
  return db.subTodo.delete({ where: { id } });
}
