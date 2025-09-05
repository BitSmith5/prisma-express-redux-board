import React from 'react';
import Task from './task';
import { useState } from 'react';
import type { TaskStatus } from '../store/types'
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { createTask } from '../store/slices/taskSlice';

interface ListProps {
  heading: string;
  boardId: number;
  status: TaskStatus;
}

const List: React.FC<ListProps> = ({ heading, boardId, status }) => {
  const board = useSelector((state: RootState) => state.board.board);
  const boardStatus = useSelector((state: RootState) => state.board.status);
  const dispatch = useDispatch<AppDispatch>();
  const [description, setDescription] = useState<string>("");

  // Don't render until board data is loaded
  if (boardStatus === "loading" || !board || !board.tasks) {
    return (
      <div className="column">
        <div className="column-header">
          <h3 className={`column-title status-${status.toLowerCase()}`}>{heading}</h3>
        </div>
        <div className="items">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const filteredTasks = board.tasks.length > 0 ? board.tasks.filter((task) => task.status === status) : [];

  function handleAddTask() {
    dispatch(createTask({ title: "Untitled", boardId, status, description }));
    setDescription("");
  }

  return (
    <div className="column">
      <div className="column-header">
        <h3 className={`column-title status-${status.toLowerCase()}`}>{heading}</h3>
        <button className="btn btn-primary" onClick={handleAddTask}>ADD TASK</button>
      </div>

      {/* Tasks in List */}
      <div className="items" style={{ marginBottom: '10px' }}>
        {filteredTasks.map((task) => (
          <Task key={task.id} taskId={task.id} />
        ))}
      </div>
    </div>
  );
};

export default List;
