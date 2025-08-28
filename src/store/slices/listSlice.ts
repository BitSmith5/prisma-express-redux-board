import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { List, Task } from "../types";

export interface ListState {
  list: List;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const initialState: ListState = {
  list: {
    id: 0,
    title: "",
    tasks: [],
    boardId: 0,
  },
  status: "idle",
  error: null,
};

export const fetchList = createAsyncThunk('list/fetchList', async (listId: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/lists/${listId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch list");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const createList = createAsyncThunk('list/createList', async ({ title, boardId }: { title: string, boardId: number }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/lists`, {
      method: "POST",
      body: JSON.stringify({ title, boardId }),
    });
    if (!response.ok) {
      throw new Error("Failed to create list");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});
export const updateList = createAsyncThunk('list/updateList', async ({ listId, list }: { listId: number, list: List }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/lists/${listId}`, {
      method: "PATCH",
      body: JSON.stringify(list),
    });
    if (!response.ok) {
      throw new Error("Failed to update list");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const updateListTitle = createAsyncThunk('list/updateListTitle', async ({ listId, title }: { listId: number, title: string }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/lists/${listId}/title`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    });
    if (!response.ok) {
      throw new Error("Failed to update list title");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const updateListTasks = createAsyncThunk('list/updateListTasks', async ({ listId, tasks }: { listId: number, tasks: Task[] }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/lists/${listId}/tasks`, {
      method: "PATCH",
      body: JSON.stringify({ tasks }),
    });
    if (!response.ok)
      throw new Error("Failed to update list tasks");
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const updateListBoardId = createAsyncThunk('list/updateListBoardId', async ({listId, boardId}: {listId: number, boardId: number}, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/lists/${listId}/board`, {
      method: "PATCH",
      body: JSON.stringify({ boardId }),
    });
    if (!response.ok) {
      throw new Error("Failed to update list board id");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const deleteList = createAsyncThunk('list/deleteList', async (listId: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/lists/${listId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete list");
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    setList: (state, action: PayloadAction<List>) => {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchList.fulfilled, (state, action: PayloadAction<List>) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the list";
      })
      .addCase(createList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createList.fulfilled, (state, action: PayloadAction<List>) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(createList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the list";
      })
      .addCase(updateList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateList.fulfilled, (state, action: PayloadAction<List>) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(updateList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the list";
      })
      .addCase(updateListTitle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateListTitle.fulfilled, (state, action: PayloadAction<List>) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(updateListTitle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the list";
      })
      .addCase(updateListTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateListTasks.fulfilled, (state, action: PayloadAction<List>) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(updateListTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the list";
      })
      .addCase(updateListBoardId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateListBoardId.fulfilled, (state, action: PayloadAction<List>) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(updateListBoardId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the list";
      })
      .addCase(deleteList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteList.fulfilled, (state, action: PayloadAction<List>) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong with the list";
      })
    }
});

export const { setList } = listSlice.actions;
export default listSlice.reducer;