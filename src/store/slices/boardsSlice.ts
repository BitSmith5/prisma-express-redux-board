import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Board } from "../types";
import { fetchBoard } from './boardSlice';
import { createTask, deleteTask } from './taskSlice';

export interface BoardsState {
  boards: Board[];
  deletedBoard: Board | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  deletedBoard: null,
  status: "idle",
  error: null,
}

export const fetchBoards = createAsyncThunk(
  "boards/fetchBoards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/boards");
      if (!response.ok) {
        throw new Error("Failed to fetch boards");
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

export const createBoard = createAsyncThunk(
  "boards/createBoard",
  async (title: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`/api/boards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        throw new Error("Failed to create board");
      }
      const newBoard = await response.json();
      dispatch(fetchBoard(newBoard.id));
      return newBoard;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteBoard = createAsyncThunk(
  "board/deleteBoard",
  async (boardId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete board");
      }
      return boardId;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateBoard = createAsyncThunk(
  "boards/updateBoard",
  async ({ boardId, title }: { boardId: number; title: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/boards/${boardId}/title`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        throw new Error("Failed to update board");
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

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
    updateBoardOptimistic: (state, action: PayloadAction<Board>) => {
      const index = state.boards.findIndex(board => board.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
    },
    deleteBoardOptimistic: (state, action: PayloadAction<number>) => {
      state.boards = state.boards.filter(board => board.id !== action.payload);
    },
    createBoardOptimistic: (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBoards.fulfilled, (state, action: PayloadAction<Board[]>) => {
        state.status = "succeeded";
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the boards";
      })
      .addCase(createBoard.pending, (state, action) => {
        state.status = "loading";
        const tempBoard = {
          id: Date.now(),
          title: action.meta.arg,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tasks: [],
          isTemp: true
        };
        state.boards.push(tempBoard);
      })
      .addCase(createBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        state.status = "succeeded";
        const index = state.boards.findIndex(board => 
          board.title === action.payload.title &&
          board.isTemp
        );
        if(index !== -1)
          state.boards[index] = action.payload;
      })
             .addCase(createBoard.rejected, (state, action) => {
         state.status = "failed";
         state.error = action.error.message ?? "Failed to create a board";
         state.boards = state.boards.filter(board => !board.isTemp);
       })
             .addCase(deleteBoard.pending, (state, action) => {
         state.status = "loading";
         const boardId = action.meta.arg;
         const deletedBoard = state.boards.find(board => board.id === boardId);
         if(deletedBoard)
           state.deletedBoard = deletedBoard;
         state.boards = state.boards.filter(board => board.id !== boardId);
       })
      .addCase(deleteBoard.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with deleting the board";
        if(state.deletedBoard) {
          state.boards.push(state.deletedBoard);
          state.deletedBoard = null;
        }
      })
      .addCase(updateBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        state.status = "succeeded";
        const index = state.boards.findIndex(board => board.id === action.payload.id);
        if (index !== -1) {
          state.boards[index] = action.payload;
        }
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to update board";
      })
      .addCase(createTask.pending, (state, action) => {
        // Optimistically update task count in boards list
        const boardId = action.meta.arg.boardId;
        const boardIndex = state.boards.findIndex(board => board.id === boardId);
        if (boardIndex !== -1) {
          // Create a temporary task for counting
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
          state.boards[boardIndex].tasks = state.boards[boardIndex].tasks || [];
          state.boards[boardIndex].tasks.push(tempTask);
        }
      })
      .addCase(createTask.fulfilled, (state, action) => {
        // Replace temp task with real task
        const boardId = action.payload.boardId;
        const boardIndex = state.boards.findIndex(board => board.id === boardId);
        if (boardIndex !== -1 && state.boards[boardIndex].tasks) {
          const tempIndex = state.boards[boardIndex].tasks.findIndex(t => 
            t.title === action.payload.title && 
            t.boardId === action.payload.boardId &&
            t.status === action.payload.status &&
            t.isTemp
          );
          if (tempIndex !== -1) {
            state.boards[boardIndex].tasks[tempIndex] = action.payload;
          }
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        // Remove temp task on failure
        const boardId = action.meta.arg.boardId;
        const boardIndex = state.boards.findIndex(board => board.id === boardId);
        if (boardIndex !== -1 && state.boards[boardIndex].tasks) {
          state.boards[boardIndex].tasks = state.boards[boardIndex].tasks.filter(t => !t.isTemp);
        }
      })
      .addCase(deleteTask.pending, (state, action) => {
        // Optimistically remove task from boards list
        const taskId = action.meta.arg;
        state.boards.forEach(board => {
          if (board.tasks) {
            board.tasks = board.tasks.filter(task => task.id !== taskId);
          }
        });
      })
      .addCase(deleteTask.fulfilled, () => {
        // Task already removed optimistically, no additional action needed
      })
      .addCase(deleteTask.rejected, () => {
        // On failure, we would need to restore the task, but we don't have the task data here
        // This would require a more complex rollback mechanism
      })
  }
});

export const { setBoards, resetStatus, updateBoardOptimistic, deleteBoardOptimistic, createBoardOptimistic } = boardsSlice.actions;
export default boardsSlice.reducer;