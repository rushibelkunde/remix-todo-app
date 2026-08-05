// app/components/category/category-panel.tsx
// Collapsible panel showing all categories with add form.
// Replaces the old monolithic CategoryForm.tsx.

import { useFetchers, useLoaderData, useSubmit } from "@remix-run/react";
import type { Category } from "@prisma/client";
import type { loader } from "~/routes/home";

import { applyOptimisticCategories } from "~/utils/optimistic-helpers";
import CategoryItem from "~/components/category/category-item";
import EmptyState from "~/components/ui/empty-state";

interface CategoryPanelProps {
  onClose: () => void;
}

export default function CategoryPanel({ onClose }: CategoryPanelProps) {
  const { categories } = useLoaderData<typeof loader>();
  const fetchers = useFetchers();
  const submit = useSubmit();

  const displayCategories = applyOptimisticCategories(
    categories as Category[],
    fetchers
  );

  function handleAddCategory(e: React.FormEvent<HTMLFormElement>) {
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
    <div className="category-panel">
      <div className="category-panel-card">
        <div className="category-panel-header">
          <span className="category-panel-title">⊞ Categories</span>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close category panel"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleAddCategory} className="category-add-form">
          <input
            type="text"
            name="category_name"
            className="form-input"
            placeholder="New category name…"
            required
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary btn-sm" style={{ whiteSpace: "nowrap" }}>
            Add
          </button>
        </form>

        {displayCategories.length === 0 ? (
          <EmptyState icon="🗂️" message="No categories yet." />
        ) : (
          <ul className="category-list">
            {displayCategories.map((cat) => (
              <CategoryItem key={cat.id} category={cat} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
