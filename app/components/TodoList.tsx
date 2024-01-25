import {
  redirect,
  useLoaderData,
  useLocation,
  useSubmit,
} from "@remix-run/react";
import TodoItem from "./TodoItem";
import React, { useState, useTransition } from "react";
import { useSearchParams } from "@remix-run/react";
import { Category, Todo } from "@prisma/client";
import { Form } from "@remix-run/react";
import { useFetchers } from "@remix-run/react";

const TodoList = () => {
  const fetchers = useFetchers();
  // const location = useLocation()
  // console.log(location.search)
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSubtodo, setShowSubtodo] = useState("");
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [status, setStatus] = useState("");

  let { categories, todos, pages }: any = useLoaderData();

  // const [page, setPage] = useState('0')

  const [search, setSearch] = useState("");

  let optimisticTodos = fetchers.reduce((memo: Array<Todo>, f) => {
    if (f.formData?.get("intent") == "add-todo") {
      let data: any = Object.fromEntries(f.formData);

      if (!todos.map((todo: Todo) => todo.id).includes(data.id)) {
        data.completed = false;
        memo.push(data);
      }
    }
    if (f.formData?.get("action") == "delete-todo") {
      let data = Object.fromEntries(f.formData);
      todos = todos.filter((todo: Todo) => todo.id !== data.id);
      console.log(todos);
    }

    if (f.formData?.get("action") == "toggle-todo") {
      let data = Object.fromEntries(f.formData);
      todos = todos.map((todo: Todo) => {
        if (todo.id == data.todoId) {
          todo.completed = !JSON.parse(data.completed as string);
          return todo;
        } else {
          return todo;
        }
      });
    }

    if ( f.formData?.get('action')=="edit-todo") {
      console.log("edit optimistic")
      let data = Object.fromEntries(f.formData)
        todos = todos.map((todo: Todo)=> {
          if(todo.id == data.todoId){
            todo.title = data.title as string
            return todo
          }
          else{
            return todo
          }
         })
    }

    if ( f.formData?.get('action')=="change-status") {
      console.log("status optimistic")
      let data = Object.fromEntries(f.formData)
        todos = todos.map((todo: Todo)=> {
          if(todo.id == data.id){
            todo.status = (data.status) as any
            return todo
          }
          else{
            return todo
          }
         })
    }

    if ( f.formData?.get('action')=="toggle-bookmark") {
      console.log("bookmark optimistic")
      let data = Object.fromEntries(f.formData)
        todos = todos.map((todo: Todo)=> {
          if(todo.id == data.id){
            todo.bookmarked = (!data.bookmarked) as any
            return todo
          }
          else{
            return todo
          }
         })
    }

    return memo;
  }, []);

  let Todos = [...optimisticTodos, ...todos];

  if (status) {
    Todos = Todos.filter((todo) => todo.status == status);
  }

  if (showBookmarked) {
    Todos = Todos.filter((todo) => todo.bookmarked);
  }

  // const [stateTodos, setStateTodos] = useState([...Todos])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex gap-3 w-full items-center justify-center mt-2">
        <input
          type="text"
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-200 rounded-xl p-2"
          placeholder="search.."
          value={search}
        />
        {search ? (
          <button
            onClick={() => {
              setSearchParams("");
              setSearch("");
            }}
            className=" -ml-10"
          >
            X
          </button>
        ) : (
          ""
        )}
        <button
          onClick={() => {
            const params = new URLSearchParams();
            params.append(
              "cat",
              searchParams.get("cat")
                ? (searchParams.get("cat") as string)
                : "all"
            );
            params.append(
              "page",
              searchParams.get("page")
                ? (searchParams.get("page") as string)
                : "0"
            );
            params.append("search", search);
            setSearchParams(params, {
              preventScrollReset: true,
            });
          }}
          className="ml-3 bg-green-700 text-white p-2 rounded-xl"
        >
          Search
        </button>
      </div>

      <div className="flex items-center justify-center w-[300px] mt-5">
        <select
          name="category"
          className="m-auto"
          id=""
          // value={searchParams.get("cat") as string}

          onChange={(e) => {
            const params = new URLSearchParams();
            params.append("page", "0");
            params.append("cat", `${e.target.value}`);
            setSearchParams(params, {
              preventScrollReset: false,
            });
            // submit({cat:e.target.value, page},{method:"get"})
          }}
        >
          <option value="all">all</option>
          {categories.map((category: Category) => (
            <option value={category.id}>{category.display_name}</option>
          ))}
        </select>

        <select
          name="status"
          className="m-auto"
          id=""
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
          }}
        >
          <option value="">status</option>
          <option value="IN_PROGRESS">in_progress</option>
          <option value="ON_HOLD">on_hold</option>
          <option value="COMPLETED">completed</option>
        </select>

        <button
          onClick={() => setShowBookmarked(!showBookmarked)}
          className="p-1 text-white bg-black"
        >
          {showBookmarked ? "cancel" : "bookmarked"}
        </button>
      </div>

      {showBookmarked ? (
        <h1 className="text-center font-semibold text-2xl">Bookmarked</h1>
      ) : (
        ""
      )}

      <ul className="flex flex-col items-center gap-2 mt-5">
        {Todos?.map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            showSubtodo={showSubtodo}
            setShowSubtodo={setShowSubtodo}
            currentPage={parseInt(searchParams.get("page") as string)}
          />
        ))}
      </ul>

      <div className="flex justify-center items-center gap-2 w-full">
        <select
          name=""
          id=""
          defaultValue={5}
          onChange={(e) => {
            const params = new URLSearchParams();
            params.append(
              "cat",
              searchParams.get("cat")
                ? (searchParams.get("cat") as string)
                : "all"
            );
            params.append("records", `${e.target.value}`);
            setSearchParams(params, {
              preventScrollReset: true,
            });
          }}
        >
          {Array.from({ length: 10 }, (_, index) => (
            <option value={index + 1}>{index + 1}</option>
          ))}
        </select>
        {Array.from({ length: parseInt(pages) }, (_, index) => (
          <button
            className={`${
              String(index) == searchParams.get("page") ? "bg-gray-400" : ""
            }`}
            onClick={() => {
              const params = new URLSearchParams();
              params.append(
                "records",
                searchParams.get("records")
                  ? (searchParams.get("records") as string)
                  : "5"
              );
              params.append(
                "cat",
                searchParams.get("cat")
                  ? (searchParams.get("cat") as string)
                  : "all"
              );
              params.append("page", `${index}`);
              setSearchParams(params, {
                preventScrollReset: true,
              });
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* {loading ?
          <div role="status" className='mt-10'>
          <svg aria-hidden="true" className="m-auto w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div> 
        :
        ""} */}
    </div>
  );
};

export default TodoList;
