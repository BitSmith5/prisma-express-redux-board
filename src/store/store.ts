import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./slices/boardSlice";
import listReducer from "./slices/listSlice";
import taskReducer from "./slices/taskSlice";

export const store = configureStore({
  reducer: {
    board: boardReducer,
    list: listReducer,
    task: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;