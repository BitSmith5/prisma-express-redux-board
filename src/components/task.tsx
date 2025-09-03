import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, deleteTask } from '../store/slices/taskSlice';
import { updateTaskOptimistic, setRollbackTask } from '../store/slices/boardSlice';
import type { RootState, AppDispatch } from '../store/store';
import type { Task as TaskType } from '../store/types';

const Task: React.FC<{ taskId: number }> = ({ taskId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const board = useSelector((state: RootState) => state.board.board);
  const task = board.tasks.find(task => task.id === taskId) as TaskType;

  const [hasChanges, setHasChanges] = useState(false);

  // Set rollback task on component mount
  useEffect(() => {
    dispatch(setRollbackTask(task));
  }, [dispatch, task]); // Run when task changes

  // Handle changes with optimistic updates
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTask = { ...task, title: e.target.value };
    setHasChanges(true);
    // Optimistic update for immediate UI feedback
    dispatch(updateTaskOptimistic(newTask));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTask = { ...task, description: e.target.value };
    setHasChanges(true);
    // Optimistic update for immediate UI feedback
    dispatch(updateTaskOptimistic(newTask));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTask = { ...task, status: e.target.value as "TODO" | "IN_PROGRESS" | "DONE" };
    setHasChanges(true);
    // Optimistic update for immediate UI feedback
    dispatch(updateTaskOptimistic(newTask));

    // Auto-save status changes immediately
    dispatch(setRollbackTask(newTask)); // Set new state as rollback
    dispatch(updateTask(newTask)); // Save to server
    setHasChanges(false);
  };

  // Save changes to server
  const handleSave = () => {
    // Set current state as rollback before saving
    dispatch(setRollbackTask(task));
    dispatch(updateTask(task));
    setHasChanges(false);
  };

  return (
    <div className="item">
      <input
        className="input-title"
        type="text"
        placeholder="Enter a title..."
        value={task.title}
        style={{ marginBottom: "10px" }}
        onChange={handleTitleChange}
      />
      <textarea
        className="input-description"
        placeholder="Enter a description..."
        value={task.description}
        style={{ marginBottom: "10px" }}
        onChange={handleDescriptionChange}
      />

      {/* Status Dropdown */}
      <div className="select">
        <label htmlFor="task-status" className="select-label">
          Status:
        </label>
        <select
          id="task-status"
          className="status-dropdown"
          value={task.status || ""}
          style={{ marginBottom: "10px" }}
          onChange={handleStatusChange}
        >
          <option value="">Select Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <span className="status status-pending">{task.status}</span>

      <div className="item-actions">
        {hasChanges && (
          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={{ marginRight: "10px" }}
          >
            💾 Save
          </button>
        )}
        <button className="btn btn-icon btn-danger" onClick={() => dispatch(deleteTask(taskId))}>
          🗑️
        </button>
      </div>
    </div>
  );
};

export default Task;
