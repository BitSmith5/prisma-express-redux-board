import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Board, Task } from "../types";
import { createTask } from './taskSlice'

export interface BoardState {
  board: Board;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BoardState = {
  board: {
    id: 0,
    title: "",
    tasks: [],
  },
  status: "idle",
  error: null,
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
        state.status = 'loading';
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = 'succeeded';
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
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? "Failed to create a task"
        // Remove temp task on failure
        state.board.tasks = state.board.tasks.filter(t => !t.isTemp);
      })
  },
});

export const { setBoard } = boardSlice.actions;
export default boardSlice.reducer;
