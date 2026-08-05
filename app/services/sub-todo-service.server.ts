// app/services/sub-todo-service.server.ts
// Business logic for SubTodo operations.
// Owns the parent-todo auto-complete cascade rule.

import {
  getSubTodosByTodo,
  createSubTodo,
  updateSubTodo,
  deleteSubTodo,
} from "~/db/repositories/sub-todo-repository.server";
import { updateTodo } from "~/db/repositories/todo-repository.server";
import type { TodoStatus } from "~/types";
import type { SubTodo } from "@prisma/client";

export async function getSubTodos(todoId: string) {
  return getSubTodosByTodo(todoId);
}

export async function addSubTodo(data: {
  id: string;
  user_id: string;
  todo_id: string;
  title: string;
}) {
  return createSubTodo(data);
}

export async function editSubTodo(id: string, title: string) {
  return updateSubTodo(id, { title });
}

export async function removeSubTodo(id: string) {
  return deleteSubTodo(id);
}

/**
 * Changes the status of a subtodo.
 * If all siblings are COMPLETED, marks the parent todo as COMPLETED.
 * Otherwise resets the parent todo to IN_PROGRESS.
 */
export async function changeSubTodoStatus(id: string, status: TodoStatus) {
  const updated = await updateSubTodo(id, { status });
  await syncParentTodoStatus(updated.todo_id);
  return updated;
}

/**
 * Toggles the completed flag of a subtodo.
 * Cascades the result to the parent todo if all siblings are done.
 */
export async function toggleSubTodoComplete(
  id: string,
  currentCompleted: boolean
) {
  const updated = await updateSubTodo(id, { completed: !currentCompleted });
  await syncParentTodoCompletedStatus(updated.todo_id);
  return updated;
}

// ─── Private helpers ────────────────────────────────────────────────────────

async function syncParentTodoStatus(parentTodoId: string) {
  const siblings = await getSubTodosByTodo(parentTodoId);
  const allDone = siblings.every((s: SubTodo) => s.status === "COMPLETED");
  const parentStatus: TodoStatus =
    siblings.length > 0 && allDone ? "COMPLETED" : "IN_PROGRESS";
  await updateTodo(parentTodoId, { status: parentStatus });
}

async function syncParentTodoCompletedStatus(parentTodoId: string) {
  const siblings = await getSubTodosByTodo(parentTodoId);
  const allDone = siblings.length > 0 && siblings.every((s: SubTodo) => s.completed);
  await updateTodo(parentTodoId, { completed: allDone });
}
