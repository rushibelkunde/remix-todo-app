// app/components/todo/todo-list.tsx
// Renders the filtered list of todos with filter controls and pagination.

import { useState } from "react";
import { useFetchers, useLoaderData, useSearchParams } from "@remix-run/react";
import type { Todo } from "@prisma/client";
import type { loader } from "~/routes/home";
import type { TodoStatus } from "~/types";

import { applyOptimisticTodos } from "~/utils/optimistic-helpers";
import TodoItem from "~/components/todo/todo-item";
import TodoFilters from "~/components/todo/todo-filters";
import TodoPagination from "~/components/todo/todo-pagination";
import EmptyState from "~/components/ui/empty-state";

export default function TodoList() {
  const { todos, categories, total_pages } = useLoaderData<typeof loader>();
  const fetchers = useFetchers();
  const [searchParams] = useSearchParams();
  const [showSubtodo, setShowSubtodo] = useState("");
  const [status, setStatus] = useState("");
  const [showBookmarked, setShowBookmarked] = useState(false);

  // Apply optimistic updates from in-flight fetchers
  let displayTodos = applyOptimisticTodos(todos as unknown as Todo[], fetchers);

  if (status) {
    displayTodos = displayTodos.filter((t) => t.status === (status as TodoStatus));
  }
  if (showBookmarked) {
    displayTodos = displayTodos.filter((t) => t.bookmarked);
  }

  return (
    <div className="todo-list-wrapper">
      <TodoFilters
        categories={categories}
        status={status}
        onStatusChange={setStatus}
        showBookmarked={showBookmarked}
        onBookmarkToggle={() => setShowBookmarked((v) => !v)}
      />

      <ul className="todo-list">
        {displayTodos.length === 0 ? (
          <EmptyState
            icon="✅"
            message={
              showBookmarked
                ? "No bookmarked todos."
                : "No todos yet. Add one above!"
            }
          />
        ) : (
          displayTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              showSubtodo={showSubtodo}
              onToggleSubtodo={setShowSubtodo}
              currentSearchParams={searchParams.toString()}
            />
          ))
        )}
      </ul>

      <TodoPagination totalPages={total_pages} />
    </div>
  );
}
