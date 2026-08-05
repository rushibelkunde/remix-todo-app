// app/types/index.ts
// Shared types used across the entire application.

export type TodoStatus = "IN_PROGRESS" | "ON_HOLD" | "COMPLETED";

export interface TodoFilters {
  user_id: string;
  category_id?: string;
  search?: string;
  page: number;
  records: number;
}

export interface PaginationParams {
  skip: number;
  take: number;
}

export interface CreateTodoData {
  id: string;
  user_id: string;
  title: string;
  category_id?: string;
}

export interface CreateCategoryData {
  id: string;
  user_id: string;
  category_name: string;
  display_name: string;
}

export interface CreateSubTodoData {
  id: string;
  user_id: string;
  todo_id: string;
  title: string;
}

export interface RegisterData {
  name: string;
  username: string;
  password: string;
}
