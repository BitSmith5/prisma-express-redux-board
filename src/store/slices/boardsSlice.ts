import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Board } from "../types";
import { fetchBoard } from './boardSlice';

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
      return await response.json();
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
        state.boards.filter(board => !board.isTemp);
      })
      .addCase(deleteBoard.pending, (state, action) => {
        state.status = "loading";
        const boardId = action.meta.arg;
        const deletedBoard = state.boards.find(board => board.id === boardId);
        if(deletedBoard)
          state.deletedBoard = deletedBoard;
        state.boards.filter(board => board.id !== boardId);
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
  }
});

export const { setBoards, resetStatus } = boardsSlice.actions;
export default boardsSlice.reducer;