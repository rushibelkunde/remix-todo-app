// app/components/category/category-item.tsx
// Single category row with inline edit and delete confirmation.

import { useState } from "react";
import { useSubmit } from "@remix-run/react";
import type { Category } from "@prisma/client";

interface CategoryItemProps {
  category: Category;
}

export default function CategoryItem({ category }: CategoryItemProps) {
  const [onEdit, setOnEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const submit = useSubmit();

  function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = form.get("title") as string;
    if (!title.trim()) return;

    submit(
      { action: "edit-category", id: category.id, title },
      { navigate: false, method: "post" }
    );
    setOnEdit(false);
  }

  function handleDelete() {
    submit(
      { action: "delete-cat", id: category.id },
      { navigate: false, method: "post" }
    );
    setShowDelete(false);
  }

  return (
    <li className="category-item" style={{ flexDirection: "column", alignItems: "stretch", gap: "0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {onEdit ? (
          <form onSubmit={handleEdit} style={{ display: "flex", gap: "0.4rem", flex: 1 }}>
            <input
              type="text"
              name="title"
              className="form-input"
              defaultValue={category.category_name}
              autoFocus
              required
            />
            <button type="submit" className="btn btn-primary btn-sm">Save</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOnEdit(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <>
            <span className="category-item-name">{category.display_name}</span>
            <button
              type="button"
              className="btn-icon"
              onClick={() => setOnEdit(true)}
              title="Edit category"
            >
              ✎
            </button>
            <button
              type="button"
              className="btn-icon danger"
              onClick={() => setShowDelete(!showDelete)}
              title="Delete category"
            >
              ✕
            </button>
          </>
        )}
      </div>

      {showDelete && (
        <div className="category-delete-confirm">
          <p>Deleting this category will also delete all its todos.</p>
          <div className="category-delete-actions">
            <button type="button" className="btn btn-danger btn-sm" onClick={handleDelete}>
              Delete
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowDelete(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
