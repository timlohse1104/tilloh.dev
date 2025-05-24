export type Todo = {
  id: string;
  title: string;
  done?: boolean;
};

export type TodoList = {
  id: string;
  name: string;
  emoji: string;
  todos: Todo[];
  history: string[];
};
