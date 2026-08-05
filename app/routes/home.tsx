// app/routes/home.tsx
// Home route — thin HTTP handler only.
// All DB access is done via services.

import type { MetaFunction } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";

import { requireUser, destroyUserSession } from "~/utils/session.server";
import { parseFormData, getRequiredField, getOptionalField, parseBooleanField } from "~/utils/form-helpers";
import * as todoService from "~/services/todo-service.server";
import * as categoryService from "~/services/category-service.server";
import * as subTodoService from "~/services/sub-todo-service.server";

import AppHeader from "~/components/layout/app-header";
import TodoAddForm from "~/components/todo/todo-add-form";
import TodoList from "~/components/todo/todo-list";
import CategoryModal from "~/components/category/category-modal";

export const meta: MetaFunction = () => [
  { title: "My Todos" },
  { name: "description", content: "Manage your todos with style." },
];

// ─── Loader ─────────────────────────────────────────────────────────────────

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);

  const { searchParams } = new URL(request.url);

  const [categories, { todos, total_pages }] = await Promise.all([
    categoryService.getUserCategories(user.uid),
    todoService.getUserTodos(user.uid, {
      category_id: searchParams.get("cat"),
      search: searchParams.get("search"),
      searchParams,
    }),
  ]);

  return json({ user, categories, todos, total_pages });
};

// ─── Action ─────────────────────────────────────────────────────────────────

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request);

  const form = await parseFormData(request);
  const action = getRequiredField(form, "action");

  switch (action) {
    case "logout":
      return destroyUserSession(request, "/login");

    case "add-todo":
      return todoService.addTodo({
        id: getRequiredField(form, "id"),
        user_id: user.uid,
        title: getRequiredField(form, "title"),
        category_id: getOptionalField(form, "category"),
      });

    case "edit-todo":
      return todoService.editTodo(
        getRequiredField(form, "todoId"),
        getRequiredField(form, "title")
      );

    case "delete-todo":
      return todoService.removeTodo(getRequiredField(form, "id"));

    case "change-status":
      return todoService.changeStatus(
        getRequiredField(form, "id"),
        getRequiredField(form, "status") as any
      );

    case "toggle-bookmark":
      return todoService.toggleBookmark(
        getRequiredField(form, "id"),
        parseBooleanField(form, "bookmarked")
      );

    case "toggle-todo":
      return todoService.toggleComplete(
        getRequiredField(form, "todoId"),
        parseBooleanField(form, "completed")
      );

    case "add-subtodo":
      return subTodoService.addSubTodo({
        id: getRequiredField(form, "id"),
        user_id: user.uid,
        todo_id: getRequiredField(form, "todo_id"),
        title: getRequiredField(form, "title"),
      });

    case "delete-subtodo":
      return subTodoService.removeSubTodo(getRequiredField(form, "id"));

    case "toggle-subTodo":
      return subTodoService.toggleSubTodoComplete(
        getRequiredField(form, "subTodoId"),
        parseBooleanField(form, "completed")
      );

    case "edit-subtodo":
      return subTodoService.editSubTodo(
        getRequiredField(form, "subtodoId"),
        getRequiredField(form, "title")
      );

    case "add-cat":
      return categoryService.addCategory({
        id: getRequiredField(form, "id"),
        user_id: user.uid,
        category_name: getRequiredField(form, "category_name"),
        display_name: getRequiredField(form, "display_name"),
      });

    case "edit-category":
      return categoryService.editCategory(
        getRequiredField(form, "id"),
        getRequiredField(form, "title")
      );

    case "delete-cat":
      return categoryService.removeCategory(getRequiredField(form, "id"));

    default:
      return json({ error: `Unknown action: ${action}` }, { status: 400 });
  }
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function HomePage() {
  const { user, categories } = useLoaderData<typeof loader>();
  const [showCategory, setShowCategory] = useState(false);

  return (
    <div className="app-layout">
      <AppHeader
        userName={user.name}
        onToggleCategory={() => setShowCategory((v) => !v)}
        showCategory={showCategory}
      />

      <main className="app-main">
        <TodoList />
      </main>

      {/* FAB — floats over content */}
      <TodoAddForm categories={categories} />

      {/* Category popup modal */}
      {showCategory && (
        <CategoryModal onClose={() => setShowCategory(false)} />
      )}
    </div>
  );
}
