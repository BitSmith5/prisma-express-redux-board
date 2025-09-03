import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Task, TaskStatus } from "../types";
import { updateTaskOptimistic, rollbackTask, clearRollbackTask } from './boardSlice';

export interface TaskState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TaskState = {
  status: "idle",
  error: null,
};

export const createTask = createAsyncThunk('task/createTask', async ({ title, boardId, status, description }: { title: string, boardId: number, status: TaskStatus, description: string }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/tasks`, {
      method: "POST",
      body: JSON.stringify({ title, boardId, status, description }),
      headers: { 'Content-Type': 'application/json' },
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

export const updateTask = createAsyncThunk('task/updateTask', async (task: Task, { rejectWithValue, dispatch }) => {
  try {
    // Optimistic update
    dispatch(updateTaskOptimistic(task));
    
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      body: JSON.stringify(task),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error("Failed to update task");
    }
    
    // Clear rollback task on success
    dispatch(clearRollbackTask(task.id));
    return response.json();
  } catch (error) {
    // Rollback on failure using rollbackTasks array
    dispatch(rollbackTask(task.id));
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
      headers: { 'Content-Type': 'application/json' },
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
export const deleteTask = createAsyncThunk('task/deleteTask', async (taskId: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
    // For DELETE operations, the server returns 204 No Content
    // We don't need to parse JSON response
    return { id: taskId, deleted: true };
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
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTask.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the task";
      })
      .addCase(updateTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTask.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the task";
      })
      .addCase(updateTaskBoardId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTaskBoardId.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateTaskBoardId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the task";
      })
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTask.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the task";
      })
  }
});

export const { resetStatus } = taskSlice.actions;
export default taskSlice.reducer;