// app/components/sub-todo/sub-todo-list.tsx
// Sub-todo panel — add form + list of sub-todos with optimistic updates.
// This is also the default export for the home.$id route.

import { useFetchers, useLoaderData, useSubmit } from "@remix-run/react";
import type { SubTodo } from "@prisma/client";
import type { loader } from "~/routes/home.$id";

import { applyOptimisticSubTodos } from "~/utils/optimistic-helpers";
import SubTodoItem from "~/components/sub-todo/sub-todo-item";
import EmptyState from "~/components/ui/empty-state";

export default function SubTodoList() {
  const { subTodos, todoId } = useLoaderData<typeof loader>();
  const fetchers = useFetchers();
  const submit = useSubmit();

  const displaySubTodos = applyOptimisticSubTodos(subTodos as unknown as SubTodo[], fetchers);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as Record<string, string>;
    if (!data.title?.trim()) return;

    submit(
      {
        ...data,
        action: "add-subtodo",
        id: crypto.randomUUID(),
        todo_id: todoId as string,
        completed: "false",
      },
      { navigate: false, method: "post" }
    );
    e.currentTarget.reset();
  }

  return (
    <div className="subtodo-panel">
      <form onSubmit={handleAdd} className="subtodo-add-form">
        <input
          type="text"
          name="title"
          className="form-input"
          placeholder="Add a sub-todo…"
          required
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary btn-sm" style={{ whiteSpace: "nowrap" }}>
          Add
        </button>
      </form>

      {displaySubTodos.length === 0 ? (
        <EmptyState icon="📋" message="No sub-todos yet." />
      ) : (
        <ul className="subtodo-list">
          {displaySubTodos
            .filter((s) => s.todo_id === todoId)
            .map((subTodo) => (
              <SubTodoItem
                key={subTodo.id}
                subTodo={subTodo}
                todoId={todoId as string}
              />
            ))}
        </ul>
      )}
    </div>
  );
}
