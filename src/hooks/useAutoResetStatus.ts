import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import type { AppDispatch } from '../store/store';
import { resetStatus as resetBoardStatus } from '../store/slices/boardSlice';
import { resetStatus as resetTaskStatus } from '../store/slices/taskSlice';
import { resetStatus as resetBoardsStatus } from '../store/slices/boardsSlice';

export const useAutoResetStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const boardStatus = useSelector((state: RootState) => state.board.status);
  const taskStatus = useSelector((state: RootState) => state.task.status);
  const boardsStatus = useSelector((state: RootState) => state.boards.status);

  useEffect(() => {
    const timers: number[] = [];

    // Reset board status after 3 seconds if succeeded or failed
    if (boardStatus === 'succeeded' || boardStatus === 'failed') {
      const timer = setTimeout(() => {
        dispatch(resetBoardStatus());
      }, 3000);
      timers.push(timer);
    }

    // Reset task status after 3 seconds if succeeded or failed
    if (taskStatus === 'succeeded' || taskStatus === 'failed') {
      const timer = setTimeout(() => {
        dispatch(resetTaskStatus());
      }, 3000);
      timers.push(timer);
    }

    // Reset boards status after 3 seconds if succeeded or failed
    if (boardsStatus === 'succeeded' || boardsStatus === 'failed') {
      const timer = setTimeout(() => {
        dispatch(resetBoardsStatus());
      }, 3000);
      timers.push(timer);
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [boardStatus, taskStatus, boardsStatus, dispatch]);
};
