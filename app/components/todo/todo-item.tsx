// app/components/todo/todo-item.tsx
// Single todo card — composes TodoEditForm, TodoDeleteDialog, Badge, and status controls.

import { useState } from "react";
import { Link, useSubmit, useSearchParams, Outlet } from "@remix-run/react";
import type { Todo } from "@prisma/client";
import type { TodoStatus } from "~/types";

import Badge from "~/components/ui/badge";
import TodoEditForm from "~/components/todo/todo-edit-form";
import TodoDeleteDialog from "~/components/todo/todo-delete-dialog";

interface TodoItemProps {
  todo: Todo;
  showSubtodo: string;
  onToggleSubtodo: (id: string) => void;
  currentSearchParams: string;
}

export default function TodoItem({
  todo,
  showSubtodo,
  onToggleSubtodo,
  currentSearchParams,
}: TodoItemProps) {
  const [onEdit, setOnEdit] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  const statusClass = {
    IN_PROGRESS: "status-in-progress",
    ON_HOLD: "status-on-hold",
    COMPLETED: "status-completed",
  }[todo.status as TodoStatus];

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    submit(
      { action: "change-status", id: todo.id, status: e.target.value },
      { navigate: false, method: "post" }
    );
  }

  function handleBookmark() {
    submit(
      { action: "toggle-bookmark", id: todo.id, bookmarked: String(todo.bookmarked) },
      { navigate: false, method: "post" }
    );
  }

  const isExpanded = showSubtodo === todo.id;

  return (
    <>
      <li className={`todo-card ${statusClass}`}>
        <div className="todo-card-header">
          {onEdit ? (
            <TodoEditForm
              todoId={todo.id}
              currentTitle={todo.title}
              onCancel={() => setOnEdit(false)}
            />
          ) : (
            <span className={`todo-card-title ${todo.completed ? "completed-text" : ""}`}>
              {todo.title}
            </span>
          )}

          {!onEdit && (
            <div className="todo-card-actions">
              <button
                type="button"
                className="btn-icon"
                onClick={() => setOnEdit(true)}
                title="Edit todo"
                aria-label="Edit todo"
              >
                ✎
              </button>
              <button
                type="button"
                className="btn-icon danger"
                onClick={() => setShowDeleteDialog(true)}
                title="Delete todo"
                aria-label="Delete todo"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="todo-card-meta">
          <Badge status={todo.status as TodoStatus} />

          <select
            className="status-select"
            value={todo.status}
            onChange={handleStatusChange}
            aria-label="Change status"
          >
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <button
            type="button"
            className={`todo-bookmark-btn ${todo.bookmarked ? "active" : ""}`}
            onClick={handleBookmark}
            title={todo.bookmarked ? "Remove bookmark" : "Bookmark"}
            aria-label={todo.bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            {todo.bookmarked ? "🔖" : "🔗"}
          </button>

          <Link
            to={
              isExpanded
                ? `/home?${searchParams.toString()}`
                : `/home/${todo.id}?${searchParams.toString()}`
            }
            prefetch={isExpanded ? undefined : "viewport"}
            onClick={() => onToggleSubtodo(isExpanded ? "" : todo.id)}
            className="todo-expand-btn"
          >
            {isExpanded ? "▲ Sub-todos" : "▼ Sub-todos"}
          </Link>
        </div>
      </li>

      {isExpanded && (
        <div>
          <Outlet />
        </div>
      )}

      {showDeleteDialog && (
        <TodoDeleteDialog
          todoId={todo.id}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </>
  );
}
