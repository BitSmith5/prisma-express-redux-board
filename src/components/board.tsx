import React from 'react';
import List from './list';
import type { TaskStatus } from '../store/types';

const Board: React.FC = () => {
  return (
    <div className="view">
      <div className="view-header">
        <h2 className="view-title">Sample Project Board</h2>
        <button className="btn btn-secondary">← Back to Boards</button>
      </div>

      {/* Create New List */}
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter list title..."
          className="input"
        />
        <button className="btn btn-primary">Create List</button>
      </div>

      {/* Lists Container - Each list contains tasks */}
      <div className="columns">
        {/* List 1: To Do */}
        <List heading="To Do" boardId={1} status="TODO"/>

        {/* List 2: In Progress */}
        <div className="column">
          <div className="column-header">
            <h3 className="column-title">In Progress</h3>
            <div className="column-actions">
              <button className="btn btn-icon">✏️</button>
              <button className="btn btn-icon btn-danger">🗑️</button>
            </div>
          </div>

          {/* Tasks in this list */}
          <div className="items">
            <div className="item">
              <h4 className="item-title">Implement API Endpoints</h4>
              <p className="item-description">Build the REST API for user management</p>
              <span className="status status-progress">in-progress</span>
              <div className="item-actions">
                <button className="btn btn-icon">✏️</button>
                <button className="btn btn-icon btn-danger">🗑️</button>
              </div>
            </div>
          </div>

          {/* Create New Task in this list */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter task title..."
              className="input"
            />
            <textarea
              placeholder="Enter task description..."
              className="textarea"
            />
            <button className="btn btn-primary">Add Task</button>
          </div>
        </div>

        {/* List 3: Done */}
        <div className="column">
          <div className="column-header">
            <h3 className="column-title">Done</h3>
            <div className="column-actions">
              <button className="btn btn-icon">✏️</button>
              <button className="btn btn-icon btn-danger">🗑️</button>
            </div>
          </div>

          {/* Tasks in this list */}
          <div className="items">
            <div className="item">
              <h4 className="item-title">Project Setup</h4>
              <p className="item-description">Initialize the project structure and dependencies</p>
              <span className="status status-completed">completed</span>
              <div className="item-actions">
                <button className="btn btn-icon">✏️</button>
                <button className="btn btn-icon btn-danger">🗑️</button>
              </div>
            </div>

            <div className="item">
              <h4 className="item-title">Requirements Gathering</h4>
              <p className="item-description">Document all project requirements and specifications</p>
              <span className="status status-completed">completed</span>
              <div className="item-actions">
                <button className="btn btn-icon">✏️</button>
                <button className="btn btn-icon btn-danger">🗑️</button>
              </div>
            </div>
          </div>

          {/* Create New Task in this list */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter task title..."
              className="input"
            />
            <textarea
              placeholder="Enter task description..."
              className="textarea"
            />
            <button className="btn btn-primary">Add Task</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
