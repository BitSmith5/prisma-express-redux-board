import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Board, Task, TaskStatus } from '../../types'

// Define the API slice
export const boardApi = createApi({
  reducerPath: 'boardApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    // You can add headers, authentication, etc. here
  }),
  tagTypes: ['Board', 'Task'],
  endpoints: (builder) => ({
    // Boards endpoints
    getBoards: builder.query<Board[], void>({
      query: () => 'boards',
      providesTags: ['Board'],
    }),
    
    getBoard: builder.query<Board, number>({
      query: (id) => `boards/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Board', id }],
    }),
    
    createBoard: builder.mutation<Board, string>({
      query: (title) => ({
        url: 'boards',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      }),
      invalidatesTags: ['Board'],
    }),
    
    updateBoard: builder.mutation<Board, { boardId: number; title: string }>({
      query: ({ boardId, title }) => ({
        url: `boards/${boardId}/title`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: 'Board', id: boardId },
        'Board'
      ],
    }),
    
    deleteBoard: builder.mutation<number, number>({
      query: (id) => ({
        url: `boards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Board'],
    }),
    
    // Tasks endpoints
    getTask: builder.query<Task, number>({
      query: (id) => `tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Task', id }],
    }),
    
    createTask: builder.mutation<Task, { 
      title: string; 
      boardId: number; 
      status: TaskStatus; 
      description: string 
    }>({
      query: ({ title, boardId, status, description }) => ({
        url: 'tasks',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, boardId, status, description }),
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: 'Board', id: boardId },
        'Board'
      ],
    }),
    
    updateTask: builder.mutation<Task, Task>({
      query: (task) => ({
        url: `tasks/${task.id}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      }),
      invalidatesTags: (_result, _error, task) => [
        { type: 'Task', id: task.id },
        { type: 'Board', id: task.boardId },
        'Board'
      ],
    }),
    
    updateTaskBoardId: builder.mutation<Task, { taskId: number; boardId: number }>({
      query: ({ taskId, boardId }) => ({
        url: `tasks/${taskId}/board`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boardId }),
      }),
      invalidatesTags: (_result, _error, { taskId, boardId }) => [
        { type: 'Task', id: taskId },
        { type: 'Board', id: boardId },
        'Board'
      ],
    }),
    
    deleteTask: builder.mutation<{ id: number; deleted: boolean }, number>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Board', 'Task'],
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useGetBoardsQuery,
  useGetBoardQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskBoardIdMutation,
  useDeleteTaskMutation,
} = boardApi
