import {configureStore} from '@reduxjs/toolkit';
import {boardApi} from './api/boardApi';

export const store = configureStore({
  reducer: {
    [boardApi.reducerPath]: boardApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(boardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;