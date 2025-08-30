export type Board = {
  id: number;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  tasks: Task[];
  isTemp?: boolean;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  boardId: number;
  createdAt?: string;
  updatedAt?: string;
  isTemp?: boolean;
};

export type List = {
  id: number;
  title: string;
  tasks: Task[];
  boardId: number;
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";