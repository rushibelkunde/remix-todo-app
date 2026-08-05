// app/components/todo/todo-filters.tsx
// Search, category, status, and bookmark filter controls.

import { useSearchParams } from "@remix-run/react";
import { useState } from "react";
import type { Category } from "@prisma/client";

interface TodoFiltersProps {
  categories: Category[];
  status: string;
  onStatusChange: (status: string) => void;
  showBookmarked: boolean;
  onBookmarkToggle: () => void;
}

export default function TodoFilters({
  categories,
  status,
  onStatusChange,
  showBookmarked,
  onBookmarkToggle,
}: TodoFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("cat", searchParams.get("cat") ?? "all");
    params.set("page", "0");
    params.set("search", search);
    setSearchParams(params, { preventScrollReset: true });
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams();
    params.set("cat", e.target.value);
    params.set("page", "0");
    setSearchParams(params, { preventScrollReset: false });
  }

  function handleClear() {
    setSearch("");
    const params = new URLSearchParams();
    params.set("cat", searchParams.get("cat") ?? "all");
    params.set("page", "0");
    setSearchParams(params, { preventScrollReset: true });
  }

  return (
    <div className="todo-filters">
      <div className="search-wrapper">
        <input
          type="text"
          className="form-input"
          placeholder="Search todos…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        {search && (
          <button type="button" className="search-clear" onClick={handleClear} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>

      <button type="button" className="btn btn-ghost btn-sm" onClick={handleSearch}>
        Search
      </button>

      <select
        className="form-select"
        style={{ width: "auto" }}
        onChange={handleCategoryChange}
        value={searchParams.get("cat") ?? "all"}
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.display_name}</option>
        ))}
      </select>

      <select
        className="form-select"
        style={{ width: "auto" }}
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="ON_HOLD">On Hold</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <button
        type="button"
        className={`btn btn-sm ${showBookmarked ? "btn-primary" : "btn-ghost"}`}
        onClick={onBookmarkToggle}
        title="Show bookmarked only"
      >
        🔖 {showBookmarked ? "Bookmarked" : "Bookmark"}
      </button>
    </div>
  );
}
