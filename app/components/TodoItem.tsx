import React, { Ref, useRef, useState } from "react";
import SubTodoList from "./SubTodos";
import {
  Form,
  useNavigation,
} from "@remix-run/react";
import { useSearchParams } from "@remix-run/react";
import { useSubmit } from "@remix-run/react";
import type { Todo } from "@prisma/client";

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

  const [searchParams, setSearchParams] = useSearchParams();
  const [onEdit, setOnEdit] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const navigation = useNavigation();
  return (
    <>
      <li
        className={`${
          todo.completed ? "bg-green-200" : "bg-red-200"
        } p-2 flex gap-4 min-w-80 justify-around rounded-xl items-center relative`}
      >
        {/* <span className='absolute left-[-20px] top-[50%] translate-y-[-50%] p-1 bg-white rounded-xl text-xs'>{todo.category_name}</span> */}

        <Form method="POST">
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
        </Form>

        {onEdit ? (
          <>
            <Form method="POST">
              <input
                type="text"
                name="title"
                className="w-[200px] p-1"
                placeholder={todo.title}
              />
              <input type="hidden" name="todoId" value={todo.id} />
              <input type="hidden" name="completed" value={`${todo.completed}`} />
              <button
                type="submit"
                name="action"
                value={"edit-todo"}
                className="p-1 bg-blue-600 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  setOnEdit(false);
                  submit(e.currentTarget , {navigate:false, method:"post"});
                }}
              >
                save
              </button>
            </Form>
            <button
              onClick={(e) => setOnEdit(false)}
              className="p-1 bg-black text-white"
            >
              cancel
            </button>
          </>
        ) : (
          <>
            <h1 className="font-semibold">{todo.title}</h1>
            <button onClick={(e) => setOnEdit(true)}>
              <img
                src="edit.png"
                alt=""
                width={"20px"}
                className="hover:scale-150 duration-100 transition-all ease-linear"
              />
            </button>
          </>
        )}

        <span className="text-sm font-normal">
          {todo.created_at
            ? new Date(todo.created_at).toISOString().substring(0, 10)
            : new Date().toISOString().substring(0, 10)}
        </span>

        {deleteDialog ? (
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
            }}
          >
            <input type="hidden" name="action" value={"delete-todo"} />
            <input type="hidden" name="todoId" value={todo.id} />
            <div className="flex flex-col justify-center gap-2">
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
                {navigation.formData?.get("action") == "delete-todo" &&
                navigation.state !== "idle"
                  ? "Deleting..."
                  : "Delete"}
              </button>

              <button
                className="bg-black text-white rounded-xl p-2"
                onClick={() => setDeleteDialog(false)}
              >
                cancel
              </button>
            </div>
          </Form>
        ) : (
          <button
            className="font-extrabold text-red-600"
            onClick={() => setDeleteDialog(true)}
          >
            <img
              src="delete.png"
              alt=""
              width={25}
              className="hover:scale-150 duration-100 transition-all ease-linear"
            />
          </button>
        )}

        {showSubtodo == todo.id ? (
          <button
            onClick={() => {
              setShowSubtodo("");
              // const params = new URLSearchParams();
              // params.append("cat", searchParams.get("cat") as string);
              // params.append("page", searchParams.get("page") as string);
              // params.delete("todoId");
              // setSearchParams(params, {
              //   preventScrollReset: true,
              // });
            }}
            className="font-bold"
          >
            -
          </button>
        ) : (
          <button
            onClick={() => {
              setShowSubtodo(todo.id);
              // const params = new URLSearchParams();
              // params.append(
              //   "cat",
              //   (searchParams.get("cat") as string) || "all"
              // );
              // params.append(
              //   "page",
              //   (searchParams.get("page") as string) || "0"
              // );
              // params.append("todoId", todo.id);
              // setSearchParams(params, {
              //   preventScrollReset: true,
              // });
            }}
            className="font-bold hover:scale-[2] duration-100 transition-all ease-linear"
          >
            +
          </button>
        )}
      </li>
      <div>
        {showSubtodo === todo.id ? <SubTodoList todoId={todo.id} /> : ""}
      </div>
    </>
  );
};

export default TodoItem;
