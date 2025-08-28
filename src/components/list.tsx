import React from 'react';

interface ListProps {
  title: string;
}

const List: React.FC<ListProps> = ({ title }) => {
  return (
    <div className="column">
      <div className="column-header">
        <h3 className="column-title">{title}</h3>
        <div className="column-actions">
          <button className="btn btn-icon">✏️</button>
          <button className="btn btn-icon btn-danger">🗑️</button>
        </div>
      </div>

      {/* Tasks in List */}
      <div className="items">
        {/* Task components will be rendered here */}
      </div>

      {/* Create New Task in List */}
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
  );
};

export default List;
