import React, { useState } from "react";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import type { Category } from "@prisma/client";
import { useNavigation } from "@remix-run/react";

const TodoForm = () => {
  const [category, setCategory] = useState("");
  const { categories }: { categories: any[] } = useLoaderData();

  const navigation = useNavigation();

  const submit = useSubmit();

  return (
    <div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          let formData = new FormData(e.currentTarget);
          let data = Object.fromEntries(formData);
          e.currentTarget.reset();
          submit(
            {
              ...data,
              completed: "false",
              status: "IN_PROGRESS",
              intent: "add-todo",
              id: window.crypto.randomUUID(),
            },
            { navigate: false, method: "post" }
          );
        }}
        method="POST"
        className="flex gap-2 w-full items-center justify-center mt-10"
      >
        <input type="hidden" name="action" value={"add-todo"} />
        <input
          type="text"
          name="title"
          placeholder="todo.."
          className="bg-slate-200 rounded-xl p-2"
          required={true}
        />
        <select
          name="category"
          id=""
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">select</option>
          {categories.map((category) => (
            <option value={category.id} onChange={(e) => {}}>
              {category.display_name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className={`${"bg-black"} rounded-xl p-1 sm:p-2  text-white font-semibold`}
        >
          Add
        </button>
      </Form>

      {/* <div className='flex gap-2 w-full items-center justify-center mt-2'>
        <input
          type="text"
          name='search'
          placeholder='Search...'
          onChange={(e) => handleSearch(e.target.value)}
          className='bg-slate-200 rounded-xl p-2'
        />

      </div> */}
    </div>
  );
};

export default TodoForm;
