// app/utils/optimistic-helpers.ts
// Typed helpers to apply optimistic UI updates from in-flight fetchers.
// Eliminates the ~80 lines of duplicated fetchers.reduce() logic across components.

import type { Fetcher } from "@remix-run/react";
import type { Category, SubTodo, Todo } from "@prisma/client";

/**
 * Applies optimistic add/delete/edit/status/bookmark updates to a todo list.
 */
export function applyOptimisticTodos(
  todos: Todo[],
  fetchers: Fetcher[]
): Todo[] {
  let result = [...todos];
  const extra: Todo[] = [];

  for (const f of fetchers) {
    if (!f.formData) continue;
    const action = f.formData.get("action");
    const data = Object.fromEntries(f.formData) as Record<string, string>;

    if (action === "add-todo") {
      const alreadyExists = result.some((t) => t.id === data.id);
      if (!alreadyExists) {
        extra.push({ ...data, completed: false } as unknown as Todo);
      }
    }

    if (action === "delete-todo") {
      result = result.filter((t) => t.id !== data.id);
    }

    if (action === "toggle-todo") {
      result = result.map((t) =>
        t.id === data.todoId
          ? { ...t, completed: !JSON.parse(data.completed) }
          : t
      );
    }

    if (action === "edit-todo") {
      result = result.map((t) =>
        t.id === data.todoId ? { ...t, title: data.title } : t
      );
    }

    if (action === "change-status") {
      result = result.map((t) =>
        t.id === data.id ? { ...t, status: data.status as Todo["status"] } : t
      );
    }

    if (action === "toggle-bookmark") {
      result = result.map((t) =>
        t.id === data.id
          ? { ...t, bookmarked: data.bookmarked !== "true" }
          : t
      );
    }
  }

  return [...extra, ...result];
}

/**
 * Applies optimistic add/delete/edit/toggle/status updates to a subtodo list.
 */
export function applyOptimisticSubTodos(
  subTodos: SubTodo[],
  fetchers: Fetcher[]
): SubTodo[] {
  let result = [...subTodos];
  const extra: SubTodo[] = [];

  for (const f of fetchers) {
    if (!f.formData) continue;
    const action = f.formData.get("action");
    const data = Object.fromEntries(f.formData) as Record<string, string>;

    if (action === "add-subtodo") {
      const alreadyExists = result.some((s) => s.id === data.id);
      if (!alreadyExists) {
        extra.push({ ...data, completed: false } as unknown as SubTodo);
      }
    }

    if (action === "delete-subtodo") {
      result = result.filter((s) => s.id !== data.id);
    }

    if (action === "toggle-subTodo") {
      result = result.map((s) =>
        s.id === data.subTodoId
          ? { ...s, completed: !JSON.parse(data.completed) }
          : s
      );
    }

    if (action === "edit-subtodo") {
      result = result.map((s) =>
        s.id === data.subtodoId ? { ...s, title: data.title } : s
      );
    }

    if (action === "change-status-subtodo") {
      result = result.map((s) =>
        s.id === data.id
          ? { ...s, status: data.status as SubTodo["status"] }
          : s
      );
    }
  }

  return [...extra, ...result];
}

/**
 * Applies optimistic add/delete updates to a category list.
 */
export function applyOptimisticCategories(
  categories: Category[],
  fetchers: Fetcher[]
): Category[] {
  let result = [...categories];
  const extra: Category[] = [];

  for (const f of fetchers) {
    if (!f.formData) continue;
    const action = f.formData.get("action");
    const data = Object.fromEntries(f.formData) as Record<string, string>;

    if (action === "add-cat") {
      const alreadyExists = result.some((c) => c.id === data.id);
      if (!alreadyExists) {
        extra.push(data as unknown as Category);
      }
    }

    if (action === "delete-cat") {
      result = result.filter((c) => c.id !== data.id);
    }
  }

  return [...extra, ...result];
}
