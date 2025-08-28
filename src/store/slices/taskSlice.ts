import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../types";

export interface TaskState {
  task: Task;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TaskState = {
  task: {
    id: 0,
    title: "",
    description: "",
    status: "",
    boardId: 0,
    listId: 0,
  },
  status: "idle",
  error: null,
};

export const createTask = createAsyncThunk('task/createTask', async ({ title, listId }: { title: string, listId: number }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/tasks`, {
      method: "POST",
      body: JSON.stringify({ title, listId }),
    });
    if (!response.ok) {
      throw new Error("Failed to create task");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const fetchTask = createAsyncThunk('task/fetchTask', async (taskId: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch task");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const updateTask = createAsyncThunk('task/updateTask', async (task: Task, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error("Failed to update task");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const updateTaskTitle = createAsyncThunk('task/updateTaskTitle', async ({ taskId, title }: { taskId: number, title: string }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}/title`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    });
    if (!response.ok) {
      throw new Error("Failed to update task title");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});
export const updateTaskDescription = createAsyncThunk('task/updateTaskDescription', async ({ taskId, description }: { taskId: number, description: string }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}/description`, {
      method: "PATCH",
      body: JSON.stringify({ description }),
    });
    if (!response.ok) {
      throw new Error("Failed to update task description");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const updateTaskStatus = createAsyncThunk('task/updateTaskStatus', async ({ taskId, status }: { taskId: number, status: string }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error("Failed to update task status");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});
export const updateTaskBoardId = createAsyncThunk('task/updateTaskBoardId', async ({ taskId, boardId }: { taskId: number, boardId: number }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}/board`, {
      method: "PATCH",
      body: JSON.stringify({ boardId }),
    });
    if (!response.ok) {
      throw new Error("Failed to update task board id");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});
export const updateTaskListId = createAsyncThunk('task/updateTaskListId', async ({ taskId, listId }: { taskId: number, listId: number }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}/list`, {
      method: "PATCH",
      body: JSON.stringify({ listId }),
    });
    if (!response.ok) {
      throw new Error("Failed to update task list id");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});
export const deleteTask = createAsyncThunk('task/deleteTask', async (taskId: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTask: (state, action: PayloadAction<Task>) => {
      state.task = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = "succeeded";
        state.task = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the task";
      })
      .addCase(updateTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = "succeeded";
        state.task = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the task";
      })
      .addCase(updateTaskTitle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTaskTitle.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = "succeeded";
        state.task = action.payload;
      })
      .addCase(updateTaskTitle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the task";
      })
      .addCase(updateTaskDescription.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTaskDescription.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = "succeeded";
        state.task = action.payload;
      })
      .addCase(updateTaskDescription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the task";
      })
      .addCase(updateTaskStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTaskStatus.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = "succeeded";
        state.task = action.payload;
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the task";
      })
      .addCase(updateTaskBoardId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTaskBoardId.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = "succeeded";
        state.task = action.payload;
      })
      .addCase(updateTaskBoardId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the task";
      })
      .addCase(updateTaskListId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTaskListId.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = "succeeded";
        state.task = action.payload;
      })
      .addCase(updateTaskListId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the task";
      })
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = "succeeded";
        state.task = action.payload;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the task";
      })
  }
});

export const { setTask } = taskSlice.actions;
export default taskSlice.reducer;