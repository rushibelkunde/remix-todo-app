import React, { Ref, useRef, useState } from "react";
import SubTodoList from "./SubTodos";
import { Form, Link, useNavigation } from "@remix-run/react";
import { useSearchParams } from "@remix-run/react";
import { useSubmit } from "@remix-run/react";
import type { Todo } from "@prisma/client";
import { SubTodo } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/home";
import { Outlet } from "@remix-run/react";
import deleteIcon from "public/delete.png";
import editIcon from "public/edit.png";
const TodoItem = ({
  todo,
  currentPage,
  showSubtodo,
  setShowSubtodo,
}: {
  todo: Todo;
  currentPage: number;
  showSubtodo: string;
  setShowSubtodo: Function;
}) => {
  const submit = useSubmit();

  const data = useLoaderData();

  console.log("data", data);

  const [searchParams, setSearchParams] = useSearchParams();
  const [onEdit, setOnEdit] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState("");
  const navigation = useNavigation();

  // let {  allSubTodos }= useLoaderData<typeof loader>();

  // let subTodos : SubTodo[] = [];

  // let index = allSubTodos?.findIndex((s)=> s.todoId == todo.id)

  // if(index !== -1){
  //   console.log('all', allSubTodos)
  //   subTodos = allSubTodos[index]?.subtodos
  //   console.log('subTodos', subTodos)
  // }

  return (
    <>
      <li
        className={ ` border-2 ${
          todo.status == "IN_PROGRESS"
            ? "border-yellow-200"
            : todo.status == "COMPLETED"
            ? "border-green-200"
            : "border-red-200"
        } p-3 flex gap-4 min-w-80 justify-around rounded-xl items-center relative shadow-md `}
      >
        {/* <span className='absolute left-[-20px] top-[50%] translate-y-[-50%] p-1 bg-white rounded-xl text-xs'>{todo.category_name}</span> */}

        {/* <Form method="POST">
          <input type="hidden" name="todoId" value={todo.id} />
          <input type="hidden" name="completed" value={`${todo.completed}`} />
          <button
            type="submit"
            name="action"
            value="toggle-todo"
            onChange={(e) => {
              submit(e.currentTarget, { navigate: false, method: "POST" });
            }}
            className="ml-3"
          >
            <input type="hidden" name="id" value={todo.id} />
            <input type="checkbox" name="" id="" checked={todo.completed} />
          </button>
        </Form> */}

        {onEdit ? (
          <div className="flex flex-col">
            <Form method="POST">
              <input
                type="text"
                name="title"
                className="w-[150px] p-1"
                placeholder={todo.title}
              />
              <input type="hidden" name="todoId" value={todo.id} />
              <input type="hidden" name="status" value={todo.status} />
              <input
                type="hidden"
                name="completed"
                value={`${todo.completed}`}
              />

              <div className="flex justify-center items-center w-full gap-1">
                <button
                  type="submit"
                  name="action"
                  value={"edit-todo"}
                  className="p-1 bg-blue-600 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    setOnEdit(false);
                    submit(e.currentTarget, {
                      navigate: false,
                      method: "post",
                    });
                  }}
                >
                  save
                </button>
                <button
                  onClick={(e) => setOnEdit(false)}
                  className="p-1 bg-black text-white"
                >
                  cancel
                </button>
              </div>
            </Form>
          </div>
        ) : (
          <>
            <h1 className="font-semibold">{todo.title}</h1>
            <button className="absolute top-[-15px] right-2 bg-white p-1" onClick={(e) => setOnEdit(true)}>
              <img
                src={editIcon}
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
            value={todo.status}
            id=""
            onChange={(e) => {
              e.preventDefault();
              submit(
                {
                  action: "change-status",
                  id: todo.id,
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

        {/* <span className="text-sm font-light text-gray-700 absolute  -top-4">
          {todo.created_at
            ? new Date(todo.created_at).toISOString().substring(0, 10)
            : new Date().toISOString().substring(0, 10)}
        </span> */}

        {deleteDialog == todo.id ? (
          <div className="fixed w-full h-full top-0 z-[1] backdrop-blur-sm bg-gray-500 bg-opacity-10 selection:shadow-sm">
            <div className="bg-white w-[300px] rounded-xl p-2 fixed mt-10 left-[50%] -translate-x-[50%]">
              <h1 className="text-center font-semibold mb-5">
                Are you sure you want to delete this Todo?
              </h1>
              <Form
                method="POST"
                onSubmit={(e) => {
                  e.preventDefault();
                  let formData = new FormData(e.currentTarget);
                  let id = formData.get("todoId") as string;
                  //  Todos =  Todos.filter((todo)=> todo.id !== id)

                  submit(
                    { id, action: "delete-todo" },
                    { navigate: false, method: "post" }
                  );
                  setDeleteDialog("");
                }}
              >
                <input type="hidden" name="action" value={"delete-todo"} />
                <input type="hidden" name="todoId" value={todo.id} />
                <div className=" flex justify-center gap-2">
                  <button
                    type="submit"
                    name="action"
                    value={"delete-todo"}
                    disabled={
                      navigation.formData?.get("action") == "delete-todo" &&
                      navigation.state !== "idle"
                        ? true
                        : false
                    }
                    className="bg-red-600 text-white rounded-xl p-2"
                  >
                    Yes, Delete
                  </button>

                  <button
                    className="bg-black text-white rounded-xl p-2"
                    onClick={() => setDeleteDialog("")}
                  >
                    No, cancel
                  </button>
                </div>
              </Form>
            </div>
          </div>
        ) : (
          <button
            className="font-extrabold  absolute top-[-18px] right-10 bg-white p-1"
            onClick={() => setDeleteDialog(todo.id)}
          >
            <img
              src={deleteIcon}
              alt=""
              width={27}
              className="hover:scale-150 duration-100 transition-all ease-linear"
            />
          </button>
        )}

        {showSubtodo == todo.id ? (
          <button>
            <Link
              onClick={() => {
                setShowSubtodo("");
              }}
              to={`/home?${searchParams.toString()}`}
            >
              -
            </Link>
          </button>
        ) : (
          <button>
            <Link
              onClick={() => {
                setShowSubtodo(todo.id);
              }}
              prefetch="viewport"
              to={`/home/${todo.id}?${searchParams.toString()}`}
            >
              +
            </Link>
          </button>
        )}

        <Form method="POST">
          <button
            type="submit"
            name="action"
            value={"toggle-bookmark"}
            onClick={(e) => {
              e.preventDefault();

              submit(
                {
                  action: "toggle-bookmark",
                  bookmarked: todo.bookmarked,
                  id: todo.id,
                },
                { method: "post", navigate: false }
              );
            }}
          >
            {todo.bookmarked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="primary"
                className="w-7 h-7  absolute top-[50%] left-[-15px] bg-white p-1 rotate-90"
              >
                <path
                  fill-rule="evenodd"
                  d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                  clip-rule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-7 h-7  absolute top-[50%] translate-y-[-50%] left-[-15px] bg-white p-1 rotate-[90deg]"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            )}
          </button>
        </Form>
      </li>
      <div>{showSubtodo === todo.id ? <Outlet /> : ""}</div>
    </>
  );
};

export default TodoItem;