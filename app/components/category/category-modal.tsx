// app/components/category/category-modal.tsx
// Category management as a full popup modal.
// Replaces the old inline category-panel.tsx.

import { useFetchers, useLoaderData, useSubmit } from "@remix-run/react";
import type { Category } from "@prisma/client";
import type { loader } from "~/routes/home";

import { applyOptimisticCategories } from "~/utils/optimistic-helpers";
import CategoryItem from "~/components/category/category-item";
import EmptyState from "~/components/ui/empty-state";
import Dialog from "~/components/ui/dialog";

interface CategoryModalProps {
  onClose: () => void;
}

export default function CategoryModal({ onClose }: CategoryModalProps) {
  const { categories } = useLoaderData<typeof loader>();
  const fetchers = useFetchers();
  const submit = useSubmit();

  const displayCategories = applyOptimisticCategories(
    categories as Category[],
    fetchers
  );

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as Record<string, string>;
    if (!data.category_name?.trim()) return;

    submit(
      {
        ...data,
        action: "add-cat",
        id: crypto.randomUUID(),
        display_name: data.category_name,
      },
      { navigate: false, method: "post" }
    );
    e.currentTarget.reset();
  }

  return (
    <Dialog title="Manage Categories" icon="⊞" onClose={onClose} size="md">
      <form onSubmit={handleAdd} className="category-add-form">
        <input
          type="text"
          name="category_name"
          className="form-input"
          placeholder="New category name…"
          required
          autoComplete="off"
          autoFocus
        />
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          style={{ whiteSpace: "nowrap" }}
        >
          + Add
        </button>
      </form>

      <div className="dialog-divider" />

      {displayCategories.length === 0 ? (
        <EmptyState icon="🗂️" message="No categories yet. Add one above!" />
      ) : (
        <ul className="category-list">
          {displayCategories.map((cat) => (
            <CategoryItem key={cat.id} category={cat} />
          ))}
        </ul>
      )}
    </Dialog>
  );
}
