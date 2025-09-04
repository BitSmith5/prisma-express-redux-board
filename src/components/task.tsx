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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Set rollback task on component mount
  useEffect(() => {
    dispatch(setRollbackTask(task));
  }, [dispatch, task]); // Run when task changes

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-resize textarea when description changes
  useEffect(() => {
    if (textareaRef.current) {
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
      }, 0);
    }
  }, [task.description]);

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

    // Auto-resize textarea to fit content
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };



  const handleStatusChange = (value: string) => {
    const newTask = { ...task, status: value as "TODO" | "IN_PROGRESS" | "DONE" };
    setHasChanges(true);
    // Optimistic update for immediate UI feedback
    dispatch(updateTaskOptimistic(newTask));

    // Auto-save status changes immediately
    dispatch(setRollbackTask(newTask)); // Set new state as rollback
    dispatch(updateTask(newTask)); // Save to server
    setHasChanges(false);
    setIsDropdownOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteTask(taskId));
    setIsDropdownOpen(false);
  };

  // Save changes to server
  const handleSave = () => {
    // Set current state as rollback before saving
    dispatch(setRollbackTask(task));
    dispatch(updateTask(task));
    setHasChanges(false);
  };

  const statusOptions = [
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" }
  ];

  return (
    <div className="item">
      <div style={{ display: "flex", gap: "10px", alignItems: "start", marginBottom: "10px" }}>
        <input
          className="input-title"
          type="text"
          placeholder="Enter a title..."
          value={task.title}
          onChange={handleTitleChange}
        />
        <div className="task-actions-dropdown" ref={dropdownRef}>
          <button
            className="btn btn-icon btn-menu"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ fontSize: '18px', padding: '4px 8px' }}
          >
            ⋮
          </button>

          {isDropdownOpen && (
            <div className="task-actions-menu">
              <div className="task-actions-section">
                <div className="task-actions-label">Status</div>
                {statusOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`task-actions-option ${option.value === task.status ? 'task-actions-option--selected' : ''}`}
                    onClick={() => handleStatusChange(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
              <div className="task-actions-divider"></div>
              <div
                className="task-actions-option task-actions-option--danger"
                onClick={handleDelete}
              >
                🗑️ Delete Task
              </div>
            </div>
          )}
        </div>
      </div>
      <textarea
        ref={textareaRef}
        className="input-description"
        placeholder="Enter a description..."
        value={task.description}
        style={{
          marginBottom: "10px",
          resize: "none",
          overflow: "hidden",
          minHeight: "20px"
        }}
        onChange={handleDescriptionChange}
      />

      <div className="item-actions">
        {hasChanges && (
          <button
            className="btn btn-save"
            onClick={handleSave}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default Task;
