import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskStatus, updateTaskTitle, updateTaskDescription, deleteTask } from '../store/slices/taskSlice';
import type { RootState, AppDispatch } from '../store/store';

const Task: React.FC<{ taskId: number }> = ({ taskId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { task, status, error } = useSelector((state: RootState) => state.task);
  const [isEditing, setIsEditing] = useState(false);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!task) {
    return <div>No task found.</div>;
  }

  return (
    <div className="item">
      {isEditing ? (
        <>
          <input
            className="item-title"
            type="text"
            placeholder="Enter a title..."
            value={task.title}
            onChange={(e) => dispatch(updateTaskTitle({ taskId, title: e.target.value }))}
          />
          <input
            className="item-description"
            type="text"
            placeholder="Enter a description..."
            value={task.description}
            onChange={(e) => dispatch(updateTaskDescription({ taskId, description: e.target.value }))}
          />

          {/* Status Dropdown */}
          <div className="task-status-section">
            <label htmlFor="task-status" className="status-label">
              Status:
            </label>
            <select
              id="task-status"
              className="status-dropdown"
              value={task.status || ""}
              onChange={(e) => {
                dispatch(updateTaskStatus({ taskId, status: e.target.value }))
              }}
            >
              <option value="">Select Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </>
      ) : (
        <>
          <h4 className="item-title">{task.title}</h4>
          <p className="item-description">{task.description}</p>
        </>
      )}

      <span className="status status-pending">{task.status}</span>
      <div className="item-actions">
        <button className="btn btn-icon" onClick={() => setIsEditing((prev) => !prev)}>✏️</button>
        <button className="btn btn-icon btn-danger" onClick={() => dispatch(deleteTask(taskId))}>🗑️</button>
      </div>
    </div>
  );
};

export default Task;
