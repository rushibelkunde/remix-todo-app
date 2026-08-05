// app/components/sub-todo/sub-todo-item.tsx
// Single sub-todo row with inline edit, status select, and delete.

import { useState } from "react";
import { useSubmit } from "@remix-run/react";
import type { SubTodo } from "@prisma/client";
import type { TodoStatus } from "~/types";
import Badge from "~/components/ui/badge";

interface SubTodoItemProps {
  subTodo: SubTodo;
  todoId: string;
}

export default function SubTodoItem({ subTodo, todoId }: SubTodoItemProps) {
  const [onEdit, setOnEdit] = useState(false);
  const submit = useSubmit();

  const statusClass = {
    IN_PROGRESS: "status-in-progress",
    ON_HOLD: "status-on-hold",
    COMPLETED: "status-completed",
  }[subTodo.status as TodoStatus];

  function handleToggle() {
    submit(
      {
        action: "toggle-subTodo",
        subTodoId: subTodo.id,
        completed: String(subTodo.completed),
      },
      { navigate: false, method: "post" }
    );
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    submit(
      { action: "change-status-subtodo", id: subTodo.id, status: e.target.value },
      { navigate: false, method: "post" }
    );
  }

  function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = form.get("title") as string;
    if (!title.trim()) return;
    submit(
      { action: "edit-subtodo", subtodoId: subTodo.id, id: subTodo.id, title },
      { navigate: false, method: "post" }
    );
    setOnEdit(false);
  }

  function handleDelete() {
    submit(
      { action: "delete-subtodo", id: subTodo.id },
      { navigate: false, method: "post" }
    );
  }

  return (
    <li className={`subtodo-item ${statusClass}`}>
      <button
        type="button"
        className={`checkbox-btn ${subTodo.completed ? "checked" : ""}`}
        onClick={handleToggle}
        aria-label={subTodo.completed ? "Mark incomplete" : "Mark complete"}
      >
        {subTodo.completed && <span style={{ color: "#fff", fontSize: "0.7rem" }}>✓</span>}
      </button>

      {onEdit ? (
        <form onSubmit={handleEdit} style={{ display: "flex", gap: "0.4rem", flex: 1 }}>
          <input
            type="text"
            name="title"
            className="form-input"
            defaultValue={subTodo.title}
            autoFocus
            required
          />
          <button type="submit" className="btn btn-primary btn-sm">Save</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOnEdit(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <span className={`subtodo-title ${subTodo.completed ? "completed-text" : ""}`}>
          {subTodo.title}
        </span>
      )}

      {!onEdit && (
        <div className="subtodo-actions">
          <Badge status={subTodo.status as TodoStatus} />

          <select
            className="status-select"
            value={subTodo.status}
            onChange={handleStatusChange}
            aria-label="Change sub-todo status"
          >
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <button
            type="button"
            className="btn-icon"
            onClick={() => setOnEdit(true)}
            title="Edit sub-todo"
            aria-label="Edit sub-todo"
          >
            ✎
          </button>
          <button
            type="button"
            className="btn-icon danger"
            onClick={handleDelete}
            title="Delete sub-todo"
            aria-label="Delete sub-todo"
          >
            ✕
          </button>
        </div>
      )}
    </li>
  );
}
