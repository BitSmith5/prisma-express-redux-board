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
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Don't render until board data is loaded
  if (boardStatus === "loading" || !board.tasks) {
    return (
      <div className="column">
        <div className="column-header">
          <h3 className="column-title">{heading}</h3>
        </div>
        <div className="items">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const filteredTasks = board.tasks.length > 0 ? board.tasks.filter((task) => task.status === status) : [];

  function handleAddTask() {
    dispatch(createTask({ title, boardId, status, description }));
    setTitle("");
    setDescription("");
  }

  return (
    <div className="column">
      <div className="column-header">
        <h3 className="column-title">{heading}</h3>
      </div>

      {/* Tasks in List */}
      <div className="items" style={{ marginBottom: '10px' }}>
        {filteredTasks.map((task) => (
          <Task key={task.id} taskId={task.id} />
        ))}
      </div>

      {/* Create New Task in List */}
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter task title..."
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter task description..."
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddTask}>Add Task</button>
      </div>
    </div>
  );
};

export default List;
