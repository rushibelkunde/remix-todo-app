// app/components/todo/todo-pagination.tsx
// Pagination controls: page number buttons and records-per-page selector.

import { useSearchParams } from "@remix-run/react";

interface TodoPaginationProps {
  totalPages: number;
}

export default function TodoPagination({ totalPages }: TodoPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") ?? "0", 10);

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params, { preventScrollReset: true });
  }

  function changeRecords(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams);
    params.set("records", e.target.value);
    params.set("page", "0");
    setSearchParams(params, { preventScrollReset: true });
  }

  if (totalPages <= 1) return null;

  return (
    <div className="todo-pagination">
      <select
        className="form-select"
        style={{ width: "auto" }}
        defaultValue={searchParams.get("records") ?? "5"}
        onChange={changeRecords}
        aria-label="Records per page"
      >
        {[3, 5, 10, 20].map((n) => (
          <option key={n} value={n}>{n} per page</option>
        ))}
      </select>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          type="button"
          className={`page-btn ${i === currentPage ? "active" : ""}`}
          onClick={() => goToPage(i)}
          aria-label={`Page ${i + 1}`}
          aria-current={i === currentPage ? "page" : undefined}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
