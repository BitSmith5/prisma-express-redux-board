import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./slices/boardSlice";
import taskReducer from "./slices/taskSlice";
import boardsReducer from './slices/boardsSlice';

export const store = configureStore({
  reducer: {
    boards: boardsReducer,
    board: boardReducer,
    task: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;