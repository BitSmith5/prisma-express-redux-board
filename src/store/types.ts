export type Board = {
  id: number;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  lists: List[];
};

export type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  boardId: number;
  listId: number;
  createdAt?: string;
  updatedAt?: string;
};

export type List = {
  id: number;
  title: string;
  tasks: Task[];
  boardId: number;
  createdAt?: string;
  updatedAt?: string;
};