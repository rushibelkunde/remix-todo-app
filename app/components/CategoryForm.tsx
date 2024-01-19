import { useFetchers, useLoaderData, useSubmit } from "@remix-run/react";
import React, { useRef, useState } from "react";
import { Form } from "@remix-run/react";
import type { Category } from "@prisma/client";
import { loader } from "~/routes/_index";

const CategoryForm = () => {
  let { categories }  = useLoaderData<typeof loader>();
  console.log("categories", categories);
  const [deleteDialog, setDeleteDialog] = useState("");
  const submit = useSubmit()
  const fetchers = useFetchers()

  const dialogRef = useRef(null)

  let optimisticCats = fetchers.reduce((memo : Array<Category>, f) => {
    if (f.formData && f.formData.get('intent')=="add-cat") {
      let data = Object.fromEntries(f.formData)

      if (!categories.map((e) => e.id).includes(data.id as string)) {
        memo.push(data as Category);
      }
    }

    if (f.formData && f.formData.get('action')=="delete-cat") {
      console.log("delete optimistic")
      let data = Object.fromEntries(f.formData)

        categories = categories.filter((cat)=> cat.id !== data.id)
        
        
    }

   return memo;
 }, []);

let cats = [...categories,...optimisticCats]

  return (
    <div className="w-60  absolute left-1/2 translate-x-[-50%] bg-slate-400 p-3 rounded-xl z-50">
    
      <Form
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
          let formData = new FormData(e.currentTarget);
          let data = Object.fromEntries(formData);
          submit(
            { ...data, intent: "add-cat", id: window.crypto.randomUUID() },
            { navigate: false, method: "post" }
          );
        }}
        className="flex flex-col gap-2"
      >
        <input type="hidden" name="action" value={"add-cat"} />
        <input
          type="text"
          name="category_name"
          placeholder="category_name"
          className="p-2 bg-slate-100 rounded-xl"
        />

        <input
          type="text"
          name="display_name"
          placeholder="display_name"
          className="p-2 bg-slate-100 rounded-xl"
        />

        <button
          type="submit"
          name="action"
          value={"add-cat"}
          className="bg-black p-2 rounded-xl text-white font-semibold"
        >
          Create category
        </button>
      </Form>
      <ul className="mt-2">
        <h1 className="text-center font-semibold text-black">Categories</h1>
        {cats?.map((category: Category) => (
          <li className="p-2 bg-slate-100 flex flex-col  mt-2 rounded-xl">
            <div className="flex justify-around items-center">
              <span>{category.display_name}</span>

              {deleteDialog == category.id ? (
                ""
              ) : (
                <button onClick={() => setDeleteDialog(category.id)}>X</button>
              )}
            </div>
            {deleteDialog == category.id ? (
              <div className="flex flex-col bg-gray-700 text-white p-2 gap-2 rounded-xl">
                <p>
                  if you delete this category all todos of this category will be
                  deleted !!!
                </p>
                <div className="flex justify-around"></div>
                <Form method="POST"
                onSubmit={(e) => {
                  e.preventDefault();
                  let formData = new FormData(e.currentTarget);
                  let id = formData.get('id') as string
                  //  Todos =  Todos.filter((todo)=> todo.id !== id)
    
                  submit({id, action: "delete-cat"}, { navigate: false, method: "post" });
                }}>
                  <input name="id" value={category.id} type="hidden" />
                  <button
                    name="action"
                    value={"delete-cat"}
                    className="p-2 bg-red-500 text-white font-semibold rounded-xl"
                  >
                    Confirm
                  </button>
                </Form>

                <button
                  onClick={() => setDeleteDialog("")}
                  className="p-2 bg-black text-white font-semibold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            ) : (
              ""
            )}
          </li>
        ))}
        {/* {loading? 
         <div role="status" className='mt-3'>
         <svg aria-hidden="true" className="m-auto w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
           <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
         </svg>
         <span className="sr-only">Loading...</span>
       </div> :
       ""} */}
      </ul>

      
    </div>
  );
};

export default CategoryForm;
