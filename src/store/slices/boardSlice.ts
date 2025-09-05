import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Board, Task } from "../types";
import { createTask, deleteTask } from './taskSlice'
import { deleteBoard } from './boardsSlice'

export interface BoardState {
  board: Board | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  rollbackTasks: Task[]; // Array to store previous task states for rollback
}

const initialState: BoardState = {
  board: null,
  status: "idle",
  error: null,
  rollbackTasks: [],
};

export const fetchBoard = createAsyncThunk(
  "board/fetchBoard",
  async (boardId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/boards/${boardId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch board");
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateBoard = createAsyncThunk(
  "board/updateBoard",
  async (board: Board, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/boards/${board.id}`, {
        method: "PATCH",
        body: JSON.stringify(board),
      });
      if (!response.ok) {
        throw new Error("Failed to update board");
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateBoardTitle = createAsyncThunk(
  "board/updateBoardTitle",
  async ({ boardId, title }: { boardId: number, title: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/boards/${boardId}/title`, {
        method: "PATCH",
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        throw new Error("Failed to update board title");
      }
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<Board>) => {
      state.board = action.payload;
      state.status = "succeeded";
    },
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
    // Set rollback tasks for a specific task
    setRollbackTask: (state, action: PayloadAction<Task>) => {
      const existingIndex = state.rollbackTasks.findIndex(t => t.id === action.payload.id);
      if (existingIndex !== -1) {
        state.rollbackTasks[existingIndex] = action.payload;
      } else {
        state.rollbackTasks.push(action.payload);
      }
    },
    // Optimistic update for entire task
    updateTaskOptimistic: (state, action: PayloadAction<Task>) => {
      if (state.board) {
        const taskIndex = state.board.tasks.findIndex(t => t.id === action.payload.id);
        if (taskIndex !== -1) {
          state.board.tasks[taskIndex] = action.payload;
        }
      }
    },
    // Rollback action for failed task update
    rollbackTask: (state, action: PayloadAction<number>) => {
      if (state.board) {
        const rollbackTask = state.rollbackTasks.find(t => t.id === action.payload);
        if (rollbackTask) {
          const taskIndex = state.board.tasks.findIndex(t => t.id === action.payload);
          if (taskIndex !== -1) {
            state.board.tasks[taskIndex] = rollbackTask;
          }
        }
      }
    },
    // Clear rollback task after successful save
    clearRollbackTask: (state, action: PayloadAction<number>) => {
      state.rollbackTasks = state.rollbackTasks.filter(t => t.id !== action.payload);
    },
    // Optimistic update for board title
    updateBoardTitleOptimistic: (state, action: PayloadAction<{ id: number; title: string }>) => {
      if (state.board && state.board.id === action.payload.id) {
        state.board.title = action.payload.title;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        state.status = "succeeded";
        state.board = action.payload;
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the board";
      })
      .addCase(updateBoard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        state.status = "succeeded";
        state.board = action.payload;
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the board";
      })
      .addCase(updateBoardTitle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBoardTitle.fulfilled, (state, action: PayloadAction<Board>) => {
        state.status = "succeeded";
        state.board = action.payload;
      })
      .addCase(updateBoardTitle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the board";
      })
      .addCase(createTask.pending, (state, action) => {
        if (state.board) {
          const tempTask = { 
            id: Date.now(), 
            title: action.meta.arg.title, 
            status: action.meta.arg.status, 
            description: action.meta.arg.description, 
            boardId: action.meta.arg.boardId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isTemp: true
          };
          state.board.tasks.push(tempTask);
        }
        state.status = 'loading';
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = 'succeeded';
        if (state.board) {
          // Replace temp task with real one
          const tempIndex = state.board.tasks.findIndex(t => 
            t.title === action.payload.title && 
            t.boardId === action.payload.boardId &&
            t.status === action.payload.status &&
            t.isTemp
          );
          
          if (tempIndex !== -1) {
            state.board.tasks[tempIndex] = action.payload;
          }
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? "Failed to create a task"
        if (state.board) {
          // Remove temp task on failure
          state.board.tasks = state.board.tasks.filter(t => !t.isTemp);
        }
      })
      .addCase(deleteTask.pending, () => {
        // Optimistic update will be handled by the boardsSlice
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<{ id: number; deleted: boolean }>) => {
        if (state.board) {
          // Remove the deleted task from the board's tasks array
          state.board.tasks = state.board.tasks.filter(task => task.id !== action.payload.id);
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? "Failed to delete a task"
        if (state.board) {
          state.board.tasks = state.board.tasks.filter(t => !t.isTemp);
        }
      })
      .addCase(deleteBoard.fulfilled, (state, action: PayloadAction<number>) => {
        // If the deleted board is the current board, set it to null
        if (state.board && state.board.id === action.payload) {
          state.board = null;
        }
      })
  },
});

export const { setBoard, resetStatus, updateTaskOptimistic, rollbackTask, setRollbackTask, clearRollbackTask, updateBoardTitleOptimistic } = boardSlice.actions;
export default boardSlice.reducer;
