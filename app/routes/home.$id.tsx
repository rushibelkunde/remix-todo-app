import React, { useEffect, useState } from "react";
import {
  Form,
  json,
  useActionData,
  useFetchers,
  useLoaderData,
} from "@remix-run/react";
import { useSubmit } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import { Todo } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";

import deleteImage from "public/delete.png"
import editImage from "public/edit.png"

import type { Category, SubTodo } from "@prisma/client";
import { db } from "~/utils/db.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({params} : LoaderFunctionArgs) => {

  const {id} = params

  const subTodos = await db.subTodo.findMany({
    where:{
      todo_id: id
    }
  })

  return json({subTodos , todoId: id})

}

export const action = async ({ request } : ActionFunctionArgs) => {
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
  }
};

const SubTodoList = () => {
  const [onEdit, setOnEdit] = useState("");

  let { subTodos, todoId } = useLoaderData<typeof loader>();


  // console.log(await getSubTodos(todoId))

  // getSubTodos(todoId)
  // .then((data)=> console.log(data))

  const submit = useSubmit();
  const fetchers = useFetchers();

  let optimisticSubTodos = fetchers.reduce((memo: Array<SubTodo>, f) => {
    if (f.formData && f.formData.get("action") == "add-subtodo") {
      let data: any = Object.fromEntries(f.formData);
      if (!subTodos?.map((e) => e.id).includes(data.id as string)) {
        data.completed = false;
        memo.push(data);
      }
    }
    if (f.formData && f.formData.get("action") == "delete-subtodo") {
      let data = Object.fromEntries(f.formData);
      subTodos = subTodos?.filter((todo) => todo.id !== data.id);
    }

    if (f.formData && f.formData.get("action") == "toggle-subTodo") {
      let data = Object.fromEntries(f.formData);
      subTodos = subTodos?.map((todo) => {
        if (todo.id == data.id) {
          todo.completed = !JSON.parse(data.completed as any);
          return todo;
        } else {
          return todo;
        }
      });
    }
    if ( f.formData?.get('action')=="edit-subtodo") {
      console.log("edit optimistic")
      let data = Object.fromEntries(f.formData)
        subTodos = subTodos?.map((todo)=> {
          if(todo.id == data.id){
            todo.title = data.title as string
            return todo
          }
          else{
            return todo
          }
         })
    }

    if ( f.formData?.get('action')=="change-status-subtodo") {
      console.log("status optimistic")
      let data = Object.fromEntries(f.formData)
        subTodos = subTodos?.map((todo)=> {
          if(todo.id == data.id){
            todo.status = data.status as any
            return todo
          }
          else{
            return todo
          }
         })
    }
    return memo;
  }, []);

  if (subTodos) {
    subTodos = [...optimisticSubTodos, ...subTodos] as any;
  }

  return (
    <div className=" min-w-80 bg-slate-300 rounded-xl p-2 ">
      <Form
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
          let formData = new FormData(e.currentTarget);
          let data = Object.fromEntries(formData);
          e.currentTarget.reset();
          submit(
            {
              ...data,
              completed: "false",
              action: "add-subtodo",
              id: window.crypto.randomUUID(),
            },
            { navigate: false, method: "post" }
          );
        }}
      >
        <div className="flex gap-2 justify-center ">
          <input
            type="text"
            name="title"
            className="p-1 bg-slate-100 rounded-xl"
            placeholder="add subtodo.."
            required
          />
          <input type="hidden" name="todo_id" value={todoId as string} />
          <button type="submit" className="bg-black text-white p-2 rounded-xl">
            Add
          </button>
        </div>
      </Form>

      <h1 className="text-center font-semibold mt-2">SubTodos</h1>
      <ul className="flex flex-col items-center mt-2 gap-2">
        {subTodos
          ?.filter((subTodo) => subTodo.todo_id == todoId)
          .map((subTodo) => (
            <li
              key={subTodo.id}
              className={`${
                subTodo.status == "IN_PROGRESS"
                  ? "bg-yellow-200"
                  : subTodo.status == "COMPLETED"
                  ? "bg-green-200"
                  : "bg-red-200"
              } p-2 flex gap-2 min-w-64 justify-around rounded-xl items-center`}
            >
              <Form method="POST">
                <input type="hidden" name="subTodoId" value={subTodo.id} />
                <input type="hidden" name="id" value={subTodo.id} />
                <input
                  type="hidden"
                  name="completed"
                  value={`${subTodo.completed}`}
                />
                <button
                  type="submit"
                  name="action"
                  value="toggle-subTodo"
                  className="ml-3"
                  onChange={(e) => {
                    e.preventDefault();
                    submit(e.currentTarget, {
                      navigate: false,
                      method: "POST",
                    });
                  }}
                >
                  <input type="hidden" name="todoId" value={todoId} />
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    checked={subTodo.completed}
                  />
                </button>
              </Form>

              {onEdit == subTodo.id ? (
                <>
                  <Form method="POST">
                    <input
                      type="text"
                      name="title"
                      className="w-[150px] p-1"
                      placeholder={subTodo.title}
                    />
                    <input type="hidden" name="subtodoId" value={subTodo.id} />

                    <div className="flex items-center justify-around mt-2">
                      <button
                        type="submit"
                        name="action"
                        value={"edit-subtodo"}
                        className="p-1 bg-blue-600 text-white rounded-xl"
                        onClick={(e) => {
                          e.preventDefault();
                          setOnEdit("");
                          submit(e.currentTarget);
                        }}
                      >
                        save
                      </button>
                      <button
                        onClick={(e) => setOnEdit("")}
                        className="p-1 bg-black text-white rounded-xl"
                      >
                        cancel
                      </button>
                    </div>
                  </Form>
                </>
              ) : (
                <>
                  <h1 className="font-semibold">{subTodo.title}</h1>
                  <button onClick={(e) => setOnEdit(subTodo.id)}>
                    <img
                      src={editImage}
                      alt=""
                      width={"20px"}
                      className="hover:scale-150 duration-100 transition-all ease-linear"
                    />
                  </button>
                </>
              )}
              <Form method="POST">
                <select
                  name="status"
                  defaultValue={subTodo.status}
                  id=""
                  onChange={(e) => {
                    e.preventDefault();
                    submit(
                      {
                        action: "change-status-subtodo",
                        id: subTodo.id,
                        status: e.target.value,
                      },
                      { navigate: false, method: "post" }
                    );
                  }}
                >
                  <option value="IN_PROGRESS">in_progress</option>
                  <option value="ON_HOLD">on_hold</option>
                  <option value="COMPLETED">completed</option>
                </select>
              </Form>
              <Form
                method="POST"
                onSubmit={(e) => {
                  e.preventDefault();
                  let formData = new FormData(e.currentTarget);
                  let id = formData.get("id") as string;
                  //  Todos =  Todos.filter((todo)=> todo.id !== id)

                  submit(
                    { id, action: "delete-subtodo" },
                    { navigate: false, method: "post" }
                  );
                }}
              >
                <input type="hidden" name="id" value={subTodo.id} />
                <button name="action" value={"delete-subtodo"}>
                  <img
                    src={deleteImage}
                    alt="X"
                    width={"25px"}
                    className="hover:scale-150 duration-100 transition-all ease-linear"
                  />
                </button>
              </Form>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SubTodoList;
