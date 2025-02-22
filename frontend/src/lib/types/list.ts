export type ListEntry = {
  id: string;
  title: string;
  done?: boolean;
};

export type List = {
  id: string;
  name: string;
  emoji: string;
  entries: ListEntry[];
  history: string[];
};
