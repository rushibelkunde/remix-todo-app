import React, { useState } from 'react'
import SubTodos from './SubTodos'
import { Form } from '@remix-run/react'
import { useSearchParams } from "@remix-run/react";
import { useSubmit } from '@remix-run/react';
import type { Todo } from '@prisma/client';

const TodoItem = ({todo, currentPage}: {todo: Todo, currentPage:number}) => {

  const submit = useSubmit()

  const [searchParams, setSearchParams] = useSearchParams();
  

  const [deleteDialog, setDeleteDialog] = useState(false)
  return (
    <>
    <li className={`${todo.completed ? 'bg-green-200' : 'bg-red-200'} p-2 flex gap-4 min-w-80 justify-around rounded-xl items-center relative`}>
      {/* <span className='absolute left-[-20px] top-[50%] translate-y-[-50%] p-1 bg-white rounded-xl text-xs'>{todo.category_name}</span> */}

      <Form method='POST'>
        <input type="hidden" name="todoId"  value={todo.id}/>
        <input type='hidden' name="completed" value={`${todo.completed}`}/>
      <button type="submit" name='action'  value="toggle-todo"  className='ml-3'
      onChange={(e)=> {
        e.preventDefault()
        submit(e.currentTarget , {replace:true})
      }} >
        <input type="checkbox" name="" id="" checked={todo.completed} />
      </button>
      </Form>
      
      <h1 className='font-semibold'>{todo.title}</h1>
      <span className='text-sm font-normal'>{new Date(todo.created_at).toISOString().substring(0, 10)}</span>

      {
        deleteDialog?

        <Form method='POST'> 
        <input type="hidden" name="todoId" value={todo.id}/>
        <div className='flex flex-col justify-center gap-2'>
      <button name='action' value="delete-todo" 
      className='bg-red-600 text-white rounded-xl p-2'>
      Confirm Delete
      </button>

      <button  className='bg-black text-white rounded-xl p-2' onClick={()=> setDeleteDialog(false)}>
      cancel
      </button>
      </div>

      </Form>
      :
      <button  className='font-extrabold text-red-600' onClick={()=> setDeleteDialog(true)}>
      X
     </button>

      }

     
     {searchParams.get("todoId")== todo.id?
      <button onClick={() => {
        const params = new URLSearchParams();
        params.append("cat", searchParams.get('cat') as string)
        params.append("page", searchParams.get('page') as string)
        params.delete('todoId');
        setSearchParams(params, {
          preventScrollReset: true,
        })}}
      
      className='font-bold'>
        -
      </button>
      :
      <button onClick={() => {
        const params = new URLSearchParams();
        params.append("cat", searchParams.get('cat') as string)
        params.append("page", searchParams.get('page') as string)
        params.append("todoId", todo.id);
        setSearchParams(params, {
          preventScrollReset: true,
        })}}
      
      className='font-bold'>
        +
      </button>}

    </li>
    <div>
    {searchParams.get('todoId')== todo.id ? <SubTodos todoId={todo.id} /> : ""}
    </div>
    
    </>
  )
}

export default TodoItem