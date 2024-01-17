import React, { useState } from "react";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useSubmit } from "@remix-run/react";

import type { JsonObject } from "@prisma/client/runtime/library";

import type { SubTodo } from "@prisma/client";

const SubTodos = ({ todoId }: { todoId: String }) => {
  const [onEdit, setOnEdit] = useState("");


  const { subTodos }: { subTodos: any[] } = useLoaderData();
  const submit = useSubmit();

  return (
    <div className=" min-w-80 bg-slate-300 rounded-xl p-2 ">
      <Form method="POST">
        <div className="flex gap-2 justify-center ">
          <input
            type="text"
            name="subTodo"
            className="p-1 bg-slate-100 rounded-xl"
            placeholder="add subtodo.."
          />
          <input type="hidden" name="todoId" value={todoId as string} />
          <button
            type="submit"
            name="action"
            value={"add-subtodo"}
            className="bg-black text-white p-2 rounded-xl"
          >
            Add
          </button>
        </div>
      </Form>

      <h1 className="text-center font-semibold mt-2">SubTodos</h1>
      <ul className="flex flex-col items-center mt-2 gap-2">
        {subTodos?.map((subTodo: SubTodo) => (
          <li
            key={subTodo.id}
            className={`${
              subTodo.completed ? "bg-green-200" : "bg-red-200"
            } p-2 flex gap-2 w-60 justify-around rounded-xl items-center`}
          >
            <Form method="POST">
              <input type="hidden" name="subTodoId" value={subTodo.id} />
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
                  submit(e.currentTarget, { replace: true });
                }}
              >
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
                    src="edit.png"
                    alt=""
                    width={"20px"}
                    className="hover:scale-150 duration-100 transition-all ease-linear"
                  />
                </button>
              </>
            )}
            <Form method="POST">
              <input type="hidden" name="subtodoId" value={subTodo.id} />
              <button name="action" value={"delete-subtodo"}>
                <img
                  src="delete.png"
                  alt=""
                  width={"25px"}
                  className="hover:scale-150 duration-100 transition-all ease-linear"
                />
              </button>
            </Form>
          </li>
        ))}
      </ul>
      {/* {loading? 
         <div role="status" className='mt-3 m-auto'>
         <svg aria-hidden="true" className="m-auto w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
           <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
         </svg>
         <span className="sr-only">Loading...</span>
       </div> :
       ""} */}
    </div>
  );
};

export default SubTodos;
