// app/components/todo/todo-delete-dialog.tsx
// Confirmation modal for deleting a todo.

import Modal from "~/components/ui/modal";
import { useSubmit } from "@remix-run/react";

interface TodoDeleteDialogProps {
  todoId: string;
  onCancel: () => void;
}

export default function TodoDeleteDialog({
  todoId,
  onCancel,
}: TodoDeleteDialogProps) {
  const submit = useSubmit();

  function handleConfirm() {
    submit(
      { action: "delete-todo", id: todoId },
      { navigate: false, method: "post" }
    );
    onCancel();
  }

  return (
    <Modal
      title="Delete Todo?"
      body="This action cannot be undone. All sub-todos associated with this item will also be deleted."
      confirmLabel="Yes, Delete"
      cancelLabel="Cancel"
      dangerous
      onConfirm={handleConfirm}
      onCancel={onCancel}
    />
  );
}
