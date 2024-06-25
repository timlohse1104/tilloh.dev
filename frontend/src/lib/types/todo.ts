export type Todo = {
  title: string;
  done?: boolean;
};

export type TodoList = {
  name: string;
  emoji: string;
  todos: Todo[];
  history: string[];
};
