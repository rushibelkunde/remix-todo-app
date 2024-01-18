import type { MetaFunction } from "@remix-run/node";

import { authenticator } from "~/utils/auth.server";
import { Form, useFetchers, useLoaderData, useSearchParams } from "@remix-run/react";
import { ActionFunction, json, redirect } from "@remix-run/node";
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
    { title: "todo-app" },
    { name: "description", content: "Todo app using Remix" },
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

  const categories = await db.category.findMany({
    where: {
      user_id: user.uid,
    },
  });

  const whereCondition: {
    user_id: string;
    category_id?: string;
    title?: {
      contains: string;
    };
  } = {
    user_id: user.uid,
  };

  const categoryId = searchParams.get("cat");
  const search = searchParams.get("search");
  if (categoryId !== "all") {
    whereCondition.category_id = categoryId as string;
  }

  if (search !== "") {
    whereCondition.title = {
      contains: search ? search : "",
    };
  }

  const todos = await db.todo.findMany({
    where: whereCondition,
    orderBy: {
      created_at: "desc",
    },
    skip: searchParams.get("page")
      ? 5 * parseInt(searchParams.get("page") as string)
      : 0,
    take: 5,
  });

  let subTodos;

  if (searchParams.get("todoId")) {
    subTodos = await db.subTodo.findMany({
      where: {
        todo_id: searchParams.get("todoId") as string,
      },
    });

    const index = subTodos.findIndex(({ completed }) => completed == false);
    if (index == -1 && subTodos.length > 0) {
      await db.todo.update({
        where: {
          id: searchParams.get("todoId") as string,
        },
        data: {
          completed: true,
        },
      });
    } else {
      await db.todo.update({
        where: {
          id: searchParams.get("todoId") as string,
        },
        data: {
          completed: false,
        },
      });
    }
  }

  const pages = Math.ceil((await db.todo.findMany()).length / 5);

  return json({ user, categories, todos, subTodos, pages });
};

// Action Function
export const action: ActionFunction = async ({ request }) => {
  await new Promise((resolve)=> setTimeout(resolve,500))
  const form = await request.formData();
  console.log(form)
  const action = form.get("action");
  console.log(action)

  console.log(Object.fromEntries(form))

  const user: any = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  

  switch (action) {
    case "logout": {
      return authenticator.logout(request, { redirectTo: "/login" });
    }

    case "add-cat": {
      return await db.category.create({
        data: {
          id: form.get('id'),
          user_id: user.uid as string,
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
          id: form.get("id"),
          user_id: user.uid as string,
          title: form.get("title"),
          category_id: form.get("category"),
        } as Todo,
      });
    }

    case "delete-todo": {
      console.log("delete")
      return await db.todo.delete({
        where: {
          id: form.get("id") as string,
        },
      });
    }

    case "edit-todo": {
      return await db.todo.update({
        where: {
          id: form.get("todoId"),
        },
        data: {
          title: form.get("title"),
        },
      });
    }

    case "add-subtodo": {
      return await db.subTodo.create({
        data: {
          id: form.get('id'),
          user_id: user.uid,
          todo_id: form.get("todoId") as string,
          title: form.get("title") as string,
        },
      });
    }

    case "delete-subtodo": {
      return await db.subTodo.delete({
        where: {
          id: form.get("id") as string,
        },
      });
    }

    case "toggle-todo": {
      const todo = await db.todo.update({
        where: {
          id: form.get("todoId") as string,
        },
        data: {
          completed: !JSON.parse(form.get("completed") as string) as boolean,
        },
      });
      return todo;
    }

    case "toggle-subTodo": {
      const todo = await db.subTodo.update({
        where: {
          id: form.get("subTodoId") as string,
        },
        data: {
          completed: !JSON.parse(form.get("completed") as string),
        },
      });
      return todo;
    }

    case "edit-subtodo": {
      return await db.subTodo.update({
        where: {
          id: form.get("subtodoId"),
        },
        data: {
          title: form.get("title"),
        },
      });
    }

    

    // case "get-subtodos": {
    //   const subtodos = await db.subTodo.findMany({
    //     where: {
    //       todo_id: form.get('todoId') as string,
    //     },
    //   });

    //   return {subtodos}
    // }
  }
  // return await db.todo.create({
  //   data: {
  //     id: form.get("id"),
  //     user_id: user.uid as string,
  //     title: form.get("title"),
  //     category_id: form.get("category"),
  //   } as Todo,
  // });
};

export default function Index() {
  const [showCategory, setShowCategory] = useState(false);
  const user: any = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  searchParams.append("page", "0");
  searchParams.append("cat", "all");

  console.log(searchParams);

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
