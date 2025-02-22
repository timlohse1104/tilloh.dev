export type ListEntry = {
  title: string;
  done?: boolean;
};

export type List = {
  name: string;
  emoji: string;
  entries: ListEntry[];
  history: string[];
};
