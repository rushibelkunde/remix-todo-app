import React, { useState } from "react";
import { Form, useLoaderData } from "@remix-run/react";
import type { Category } from "@prisma/client";

const TodoForm = () => {
  const [category, setCategory] = useState("");
  const { categories }: { categories: any[] } = useLoaderData();

  const [disable, setDisable] = useState(false);

  return (
    <div>
      <Form
        method="POST"
        className="flex gap-2 w-full items-center justify-center mt-10"
      >
        <input
          type="text"
          name="todo"
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
          name="action"
          value={"add-todo"}
          className={`${
            disable ? "bg-gray-700" : "bg-black"
          } rounded-xl p-1 sm:p-2  text-white font-semibold`}
          disabled={disable}
        >
          {disable ? "Adding..." : "Add"}
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
