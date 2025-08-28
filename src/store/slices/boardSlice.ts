import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Board, List } from "../types";

export interface BoardState {
  board: Board;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BoardState = {
  board: {
    id: 0,
    title: "",
    lists: [],
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

export const updateBoardLists = createAsyncThunk(
  "board/updateBoardLists",
  async ({ boardId, lists }: { boardId: number, lists: List[] }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/boards/${boardId}/lists`, {
        method: "PATCH",
        body: JSON.stringify({ lists }),
      });
      if (!response.ok) {
        throw new Error("Failed to update board lists");
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
  "board/createBoard",
  async (title: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/boards`, {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        throw new Error("Failed to create board");
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
    .addCase(updateBoardLists.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateBoardLists.fulfilled, (state, action: PayloadAction<Board>) => {
      state.status = "succeeded";
      state.board = action.payload;
    })
    .addCase(updateBoardLists.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message ?? "Something went wrong with the board";
    })
    .addCase(deleteBoard.pending, (state) => {
      state.status = "loading";
    })
    .addCase(deleteBoard.fulfilled, (state, action: PayloadAction<Board>) => {
      state.status = "succeeded";
      state.board = action.payload;
    })
    .addCase(deleteBoard.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message ?? "Something went wrong with the board";
    })
  },
});

export const { setBoard } = boardSlice.actions;
export default boardSlice.reducer;
