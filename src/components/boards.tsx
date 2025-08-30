import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { fetchBoards, createBoard } from '../store/slices/boardsSlice';


const Boards: React.FC = () => {
  const boards = useSelector((state: RootState) => state.boards);
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  function handleCreateBoard() {
    console.log(`title: ${title}`);
    dispatch(createBoard(title));
    setTitle("");
  }

  return (
    <div className="section">
      <h1 className="title">My Boards</h1>

      {/* Create New Board */}
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter board title..."
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleCreateBoard}>Create Board</button>
      </div>

      {/* Boards Grid */}
      <div className="grid">
        {boards.boards.map(board => (
          <div className="card" key={board.id}>
            <div className="card-header">
              <h3 className="card-title">{board.title}</h3>
              <div className="card-actions">
                <button className="btn btn-icon btn-danger">🗑️</button>
              </div>
            </div>
            <div className="card-content">
              <span className="badge">{board.tasks?.length || 0} tasks</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Boards;
