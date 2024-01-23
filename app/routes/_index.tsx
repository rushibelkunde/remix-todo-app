import type { MetaFunction } from "@remix-run/node";

import { authenticator } from "~/utils/auth.server";
import {
  Form,
  Outlet,
  useFetchers,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import TodoForm from "~/components/TodoForm";
import { useEffect, useState } from "react";
import { db } from "~/utils/db.server";
import TodoList from "~/components/TodoList";
import type { SubTodo, Todo } from "@prisma/client";
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
  searchParams.append("records", "5");

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
      ? parseInt(searchParams.get("records") as string) *
        parseInt(searchParams.get("page") as string)
      : 0,
    take: searchParams.get("records")
      ? parseInt(searchParams.get("records") as string)
      : 5,
  });

  let subTodos;

  if (searchParams.get("todoId")) {
    subTodos = await db.subTodo.findMany({
      where: {
        todo_id: searchParams.get("todoId") as string,
      },
    });
  }

  // let allSubTodos : Array<{todoId : string, subtodos: SubTodo[]}>=[];
  // todos.map(async(todo: Todo)=>{
  //   let subtodos = await db.subTodo.findMany({
  //     where: {
  //       todo_id: todo.id
  //     },
  //   });
  //   allSubTodos.push({todoId : todo.id, subtodos})
  // })

  const pages = Math.ceil(
    (await db.todo.findMany({ where: { user_id: user.uid } })).length /
      parseInt(searchParams.get("records") as string)
  );

  console.log(pages);

  return json({ user, categories, todos, pages, subTodos });
};

// Action Function
export const action: ActionFunction = async ({ request }) => {
  // await new Promise((resolve)=> setTimeout(resolve,3000))
  const form = await request.formData();
  console.log(form);
  const action = form.get("action");
  console.log(action);

  console.log(Object.fromEntries(form));

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
          id: form.get("id") as string,
          user_id: user.uid as string,
          category_name: form.get("category_name") as any,
          display_name: form.get("display_name") as any,
        },
      });
    }

    case "edit-category": {
      return await db.category.update({
        where: {
          id: form.get("id") as string,
        },
        data: {
          category_name: form.get("title") as string,
          display_name: form.get("title") as string,
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

    case "change-status": {
      return await db.todo.update({
        where: {
          id: form.get("id") as string,
        },
        data: {
          status: form.get("status"),
        } as Todo,
      });
    }

    case "change-status-subtodo": {
      const todo = await db.subTodo.update({
        where: {
          id: form.get("id") as string,
        },
        data: {
          status: form.get("status"),
        } as Todo,
      });

      const subTodos = await db.subTodo.findMany({
        where: {
          todo_id: todo.todo_id,
        },
      });

      const index = subTodos.findIndex(
        ({ status }) => status == "IN_PROGRESS" || status == "ON_HOLD"
      );
      if (index == -1 && subTodos.length > 0) {
        await db.todo.update({
          where: {
            id: todo.todo_id,
          },
          data: {
            status: "COMPLETED",
          },
        });
      } else {
        await db.todo.update({
          where: {
            id: todo.todo_id,
          },
          data: {
            status: "IN_PROGRESS",
          },
        });
      }
      return todo;
    }

    case "delete-todo": {
      console.log("delete");
      return await db.todo.delete({
        where: {
          id: form.get("id") as string,
        },
      });
    }

    case "edit-todo": {
      return await db.todo.update({
        where: {
          id: form.get("todoId") as string,
        },
        data: {
          title: form.get("title") as string,
        },
      });
    }

    case "toggle-bookmark": {
      return await db.todo.update({
        where: {
          id: form.get("id") as string,
        },

        data: {
          bookmarked: !JSON.parse(form.get("bookmarked") as string),
        },
      });
    }

    case "add-subtodo": {
      console.log("added");
      return await db.subTodo.create({
        data: {
          id: form.get("id") as string,
          user_id: user.uid,
          todo_id: form.get("todo_id") as string,
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

      const subTodos = await db.subTodo.findMany({
        where: {
          todo_id: todo.todo_id,
        },
      });

      const index = subTodos.findIndex(({ completed }) => completed == false);
      if (index == -1 && subTodos.length > 0) {
        await db.todo.update({
          where: {
            id: todo.todo_id,
          },
          data: {
            completed: true,
          },
        });
      } else {
        await db.todo.update({
          where: {
            id: todo.todo_id,
          },
          data: {
            completed: false,
          },
        });
      }
      return todo;
    }

    case "edit-subtodo": {
      return await db.subTodo.update({
        where: {
          id: form.get("subtodoId") as string,
        },
        data: {
          title: form.get("title") as string,
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
        {showCategory ? <CategoryForm /> : ""}
        <TodoForm />
        <TodoList />
      </div>

      {/* <TodoList user={user} /> */}
      <Outlet />
    </div>
  );
}
