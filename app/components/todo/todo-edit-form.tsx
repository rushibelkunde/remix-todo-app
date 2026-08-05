// app/components/todo/todo-edit-form.tsx
// Inline edit form shown when a todo is in edit mode.

import { useSubmit } from "@remix-run/react";

interface TodoEditFormProps {
  todoId: string;
  currentTitle: string;
  onCancel: () => void;
}

export default function TodoEditForm({
  todoId,
  currentTitle,
  onCancel,
}: TodoEditFormProps) {
  const submit = useSubmit();

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    if (!title.trim()) return;

    submit(
      { action: "edit-todo", todoId, title },
      { navigate: false, method: "post" }
    );
    onCancel();
  }

  return (
    <form onSubmit={handleSave} className="todo-edit-form">
      <input
        type="text"
        name="title"
        className="form-input"
        defaultValue={currentTitle}
        autoFocus
        required
      />
      <button type="submit" className="btn btn-primary btn-sm">Save</button>
      <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
