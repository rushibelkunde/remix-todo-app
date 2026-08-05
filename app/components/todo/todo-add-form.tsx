// app/components/todo/todo-add-form.tsx
// Floating "+ New Todo" button that opens a popup dialog form.

import { useState } from "react";
import { useSubmit } from "@remix-run/react";
import type { Category } from "@prisma/client";
import Dialog from "~/components/ui/dialog";

interface TodoAddFormProps {
  categories: Category[];
}

export default function TodoAddForm({ categories }: TodoAddFormProps) {
  const [open, setOpen] = useState(false);
  const submit = useSubmit();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    submit(
      {
        ...data,
        action: "add-todo",
        id: crypto.randomUUID(),
        completed: "false",
        status: "IN_PROGRESS",
      },
      { navigate: false, method: "post" }
    );

    setOpen(false);
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        className="fab"
        onClick={() => setOpen(true)}
        aria-label="Add new todo"
        title="Add new todo"
      >
        <span className="fab-icon">+</span>
        <span className="fab-label">New Todo</span>
      </button>

      {/* Popup Dialog */}
      {open && (
        <Dialog title="Add New Todo" icon="✚" onClose={() => setOpen(false)} size="sm">
          <form onSubmit={handleSubmit} className="dialog-form">
            <div className="form-group">
              <label htmlFor="todo-title" className="form-label">Task</label>
              <input
                id="todo-title"
                type="text"
                name="title"
                className="form-input"
                placeholder="What needs to be done?"
                required
                autoComplete="off"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="todo-category" className="form-label">Category</label>
              <select
                id="todo-category"
                name="category"
                className="form-select"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.display_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="dialog-form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Todo
              </button>
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
}
