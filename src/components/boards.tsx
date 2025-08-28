import React from 'react';

const Boards: React.FC = () => {
  return (
    <div className="section">
      <h1 className="title">My Boards</h1>
      
      {/* Create New Board */}
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter board title..."
          className="input"
        />
        <button className="btn btn-primary">Create Board</button>
      </div>

      {/* Boards Grid */}
      <div className="grid">
        {/* Board Card 1 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Sample Project Board</h3>
            <div className="card-actions">
              <button className="btn btn-icon">✏️</button>
              <button className="btn btn-icon btn-danger">🗑️</button>
            </div>
          </div>
          <div className="card-content">
            <span className="badge">3 lists</span>
            <span className="badge">5 tasks</span>
          </div>
        </div>

        {/* Board Card 2 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Marketing Campaign</h3>
            <div className="card-actions">
              <button className="btn btn-icon">✏️</button>
              <button className="btn btn-icon btn-danger">🗑️</button>
            </div>
          </div>
          <div className="card-content">
            <span className="badge">4 lists</span>
            <span className="badge">8 tasks</span>
          </div>
        </div>

        {/* Board Card 3 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Bug Fixes</h3>
            <div className="card-actions">
              <button className="btn btn-icon">✏️</button>
              <button className="btn btn-icon btn-danger">🗑️</button>
            </div>
          </div>
          <div className="card-content">
            <span className="badge">2 lists</span>
            <span className="badge">3 tasks</span>
          </div>
        </div>

        {/* Board Card 4 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Feature Development</h3>
            <div className="card-actions">
              <button className="btn btn-icon">✏️</button>
              <button className="btn btn-icon btn-danger">🗑️</button>
            </div>
          </div>
          <div className="card-content">
            <span className="badge">5 lists</span>
            <span className="badge">12 tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boards;
