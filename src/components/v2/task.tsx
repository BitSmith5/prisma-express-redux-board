import React, { useState, useEffect } from 'react';
import { useGetBoardQuery, useUpdateTaskMutation, useDeleteTaskMutation } from '../../store/v2/api/boardApi';
import type { Task as TaskType } from '../../store/v2/types';

const Task: React.FC<{ taskId: number, boardId: number }> = ({ taskId, boardId }) => {
  const { data: board } = useGetBoardQuery(boardId);
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const task = board?.tasks.find(task => task.id === taskId) as TaskType;

  const [title, setTitle] = useState<string>(task?.title || '');
  const [description, setDescription] = useState<string>(task?.description || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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
  }, [description]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setHasChanges(true);
  };

  const handleStatusChange = (value: string) => {
    const newTask = { ...task, status: value as "TODO" | "IN_PROGRESS" | "DONE" };
    setHasChanges(true);
    updateTask(newTask);
    setHasChanges(false);
    setIsDropdownOpen(false);
  };

  const handleDelete = () => {
    deleteTask(taskId);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    if (!task) return;
    const newTask = { ...task, title, description };
    updateTask(newTask);
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
          value={title}
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
                    className={`task-actions-option`}
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
        value={description}
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
