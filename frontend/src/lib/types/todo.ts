export type HistoryEntry = {
  title: string;
  category: string;
};

export type Todo = {
  id: string;
  title: string;
  done?: boolean;
  category?: string;
};

export type TodoList = {
  id: string;
  name: string;
  emoji: string;
  todos: Todo[];
  history: HistoryEntry[];
  categories: string[];
  isShared?: boolean;
  sharedId?: string;
  version?: number;
};

export type SharedTodoListResponse = {
  _id: string;
  name: string;
  emoji: string;
  todos: Todo[];
  history: HistoryEntry[];
  categories: string[];
  version: number;
  created: string;
  updated: string;
};
