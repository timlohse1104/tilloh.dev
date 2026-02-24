export type Todo = {
  id: string;
  title: string;
  done?: boolean;
  amount?: string;
  category?: string;
};

export type TodoList = {
  id: string;
  name: string;
  emoji: string;
  todos: Todo[];
  history: string[];
  isShared?: boolean;
  sharedId?: string;
  version?: number;
};

export type SharedTodoListResponse = {
  _id: string;
  name: string;
  emoji: string;
  todos: Todo[];
  history: string[];
  version: number;
  created: string;
  updated: string;
};
