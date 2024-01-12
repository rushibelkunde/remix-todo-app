import type { MetaFunction } from "@remix-run/node";

import { authenticator } from "~/utils/auth.server";
import { Form, useLoaderData } from "@remix-run/react";
import { ActionFunction, json } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import TodoForm from "~/components/TodoForm";
import { useEffect, useState } from "react";
import { db } from "~/utils/db.server";
import TodoList from "~/components/TodoList";
import type { Todo } from "@prisma/client";
import CategoryForm from "~/components/CategoryForm";
import { User } from "@prisma/client";

export const meta: MetaFunction = () => {
  return [
    { title: "remix-todo-app" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// Loader Function
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user: User | any = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  let { searchParams } = new URL(request.url);
  searchParams.append("page", "0");
  searchParams.append("cat", "all");

  const categories = await db.category.findMany();

  const whereCondition = {
    user_id: user.uid as string,
  };

  const categoryId = searchParams.get("cat");
  if (categoryId !== "all") {
    whereCondition.category_id = categoryId;
  }

  const todos = await db.todo.findMany({
    where: whereCondition,
    orderBy: {
      created_at: "desc",
    },
    skip: searchParams.get("page") ? 5 * searchParams.get("page") : 0,
    take: 5,
  });

  let subTodos;

  if (searchParams.get("todoId")) {
    subTodos = await db.subTodo.findMany({
      where: {
        todo_id: searchParams.get("todoId") as String,
      },
    });
  }

  const pages = Math.ceil((await db.todo.findMany()).length / 5);

  return json({ user, categories, todos, subTodos, pages });
};

// Action Function
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("action");

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  switch (action) {
    case "logout": {
      return authenticator.logout(request, { redirectTo: "/login" });
    }

    case "add-cat": {
      return await db.category.create({
        data: {
          category_name: form.get("category_name") as any,
          display_name: form.get("display_name") as any,
        },
      });
    }

    case "delete-cat": {
      return await db.category.delete({
        where: {
          id: form.get("id") as any,
        },
      });
    }

    case "add-todo": {
      return await db.todo.create({
        data: {
          user_id: user.uid as string,
          title: form.get("todo"),
          category_id: form.get("category"),
        } as Todo,
      });
    }

    case "delete-todo": {
      return await db.todo.delete({
        where: {
          id: form.get("todoId"),
        },
      });
    }

    case "add-subtodo": {
      return await db.subTodo.create({
        data: {
          user_id: user.uid,
          todo_id: form.get("todoId"),
          title: form.get("subTodo"),
        },
      });
    }

    case "delete-subtodo": {
      return await db.subTodo.delete({
        where: {
          id: form.get("subtodoId"),
        },
      });
    }

    case "toggle-todo": {
      const todo = await db.todo.update({
        where: {
          id: form.get("todoId"),
        },
        data: {
          completed: !JSON.parse(form.get("completed")),
        },
      });
      return todo;
    }

    case "toggle-subTodo": {
      const todo = await db.subTodo.update({
        where: {
          id: form.get("subTodoId"),
        },
        data: {
          completed: !JSON.parse(form.get("completed")),
        },
      });
      return todo;
    }
  }
};

export default function Index() {
  const [showCategory, setShowCategory] = useState(false);
  const user: any = useLoaderData();

  return (
    <div>
      <h1 className="text-3xl m-2 text-center font-bold mt-5">Todo-App</h1>
      <div className="flex gap-2 items-center justify-center m-5">
        <Form method="POST">
          <button
            name="action"
            value="logout"
            className="bg-red-700 text-white font-bold p-2 rounded-xl"
          >
            Signout
          </button>
        </Form>

        <button
          className="bg-zinc-200 p-2 rounded-xl font-semibold"
          onClick={() => setShowCategory(!showCategory)}
        >
          {showCategory ? (
            <span className="text-red-600 font-bold">close</span>
          ) : (
            "Create Catagory"
          )}
        </button>
      </div>
      <div className="">
        {showCategory ? <CategoryForm user={user} /> : ""}
        <TodoForm user={user} />
        <TodoList />
      </div>

      {/* <TodoList user={user} /> */}
    </div>
  );
}
