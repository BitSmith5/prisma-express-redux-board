import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Board } from "../types";

export interface BoardsState {
  boards: Board[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  status: "idle",
  error: null,
}

const fetchBoards = createAsyncThunk(
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

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
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
  }
});

export const { setBoards } = boardsSlice.actions;
export default boardsSlice.reducer;