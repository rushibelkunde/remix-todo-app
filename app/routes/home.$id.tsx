// app/routes/home.$id.tsx
// Sub-todo route — thin HTTP handler only.
// Loads sub-todos for a specific todo via sub-todo-service.

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { requireUser } from "~/utils/session.server";
import { parseFormData, getRequiredField, parseBooleanField } from "~/utils/form-helpers";
import * as subTodoService from "~/services/sub-todo-service.server";
import SubTodoList from "~/components/sub-todo/sub-todo-list";

// ─── Loader ─────────────────────────────────────────────────────────────────

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const todoId = params.id as string;
  const subTodos = await subTodoService.getSubTodos(todoId);
  return json({ subTodos, todoId });
};

// ─── Action ─────────────────────────────────────────────────────────────────

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request);

  const form = await parseFormData(request);
  const action = getRequiredField(form, "action");

  switch (action) {
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

    case "change-status-subtodo":
      return subTodoService.changeSubTodoStatus(
        getRequiredField(form, "id"),
        getRequiredField(form, "status") as any
      );

    default:
      return json({ error: `Unknown action: ${action}` }, { status: 400 });
  }
};

// ─── Component ──────────────────────────────────────────────────────────────

export default SubTodoList;
