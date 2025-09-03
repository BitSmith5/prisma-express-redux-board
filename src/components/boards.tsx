import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { fetchBoards, createBoard } from '../store/slices/boardsSlice';
import { fetchBoard } from '../store/slices/boardSlice';


const Boards: React.FC = () => {
  const boards = useSelector((state: RootState) => state.boards.boards);
  const boardsStatus = useSelector((state: RootState) => state.boards.status);
  const currentBoard = useSelector((state: RootState) => state.board.board);
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  useEffect(() => {
    if (boards.length > 0 && (!currentBoard || currentBoard.id === 0)) {
      dispatch(fetchBoard(boards[0].id));
    }
  }, [boards, currentBoard, dispatch]);

  function handleCreateBoard() {
    dispatch(createBoard(title));
    setTitle("");
  }

  // Show loading state while fetching boards
  if (boardsStatus === "loading") {
    return (
      <div className="section">
        <h1 className="title">My Boards</h1>
        <p>Loading boards...</p>
      </div>
    );
  }

  // Show error state if fetch failed
  if (boardsStatus === "failed") {
    return (
      <div className="section">
        <h1 className="title">My Boards</h1>
        <p>Error loading boards. Please try again.</p>
      </div>
    );
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
        {boards.map(board => (
          <div 
            className={`card ${currentBoard?.id === board.id ? 'selected' : ''}`} 
            key={board.id} 
            onClick={() => dispatch(fetchBoard(board.id))}
          >
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
