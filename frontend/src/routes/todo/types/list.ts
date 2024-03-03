import type { Todo } from './todo';

export type TodoList = {
  name: string;
  emoji: string;
  todos: Todo[];
  history: string[];
};
