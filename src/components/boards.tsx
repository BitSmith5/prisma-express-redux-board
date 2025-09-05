import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { fetchBoards, createBoard, deleteBoard, updateBoard, updateBoardOptimistic } from '../store/slices/boardsSlice';
import { fetchBoard, updateBoardTitleOptimistic } from '../store/slices/boardSlice';


const Boards: React.FC = () => {
  const boards = useSelector((state: RootState) => state.boards.boards);
  const boardsStatus = useSelector((state: RootState) => state.boards.status);
  const currentBoard = useSelector((state: RootState) => state.board.board);
  const dispatch = useDispatch<AppDispatch>();

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState<{ [key: number]: boolean }>({});
  const dropdownRefs = React.useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  useEffect(() => {
    if (boards.length > 0 && (!currentBoard || currentBoard.id === 0)) {
      dispatch(fetchBoard(boards[0].id));
    }
  }, [boards, currentBoard, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId !== null &&
        dropdownRefs.current[openDropdownId] &&
        !dropdownRefs.current[openDropdownId]!.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  function handleCreateBoard() {
    dispatch(createBoard("Untitled"));
  }

  function handleDeleteBoard(boardId: number, event?: React.MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent card click
    }
    dispatch(deleteBoard(boardId));
    setOpenDropdownId(null);
  }

  function handleToggleDropdown(boardId: number, event: React.MouseEvent) {
    event.stopPropagation(); // Prevent card click
    setOpenDropdownId(openDropdownId === boardId ? null : boardId);
  }

  function handleTitleChange(boardId: number, newTitle: string) {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      const updatedBoard = { ...board, title: newTitle };
      setHasChanges(prev => ({ ...prev, [boardId]: true }));
      // Optimistic update for immediate UI feedback
      dispatch(updateBoardOptimistic(updatedBoard));
      // Also update the current board if it's the same board
      dispatch(updateBoardTitleOptimistic({ id: boardId, title: newTitle }));
    }
  }

  function handleSave(boardId: number) {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      dispatch(updateBoard({ boardId, title: board.title }));
      setHasChanges(prev => ({ ...prev, [boardId]: false }));
    }
  }

  // Show loading state while fetching boards
  if (boardsStatus === "loading") {
    return (
      <div className="section">
        <h1 className="title">My Boards</h1>
        <div className="form-group">
          <button className="btn btn-primary">CREATE BOARD</button>
        </div>
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
        <button className="btn btn-primary" onClick={handleCreateBoard}>CREATE BOARD</button>
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
              <div style={{ display: "flex", gap: "10px", alignItems: "start", flex: 1 }}>
                <input
                  className="input-title"
                  type="text"
                  placeholder="Enter a title..."
                  value={board.title}
                  onChange={(e) => handleTitleChange(board.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="task-actions-dropdown" ref={(el) => { dropdownRefs.current[board.id] = el; }}>
                  <button
                    className="btn btn-icon btn-menu"
                    onClick={(e) => handleToggleDropdown(board.id, e)}
                    style={{ fontSize: '18px', padding: '4px 8px' }}
                  >
                    ⋮
                  </button>

                  {openDropdownId === board.id && (
                    <div className="task-actions-menu">
                      <div
                        className="task-actions-option task-actions-option--danger"
                        onClick={(e) => handleDeleteBoard(board.id, e)}
                      >
                        🗑️ Delete Board
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <span className="badge">{board.tasks?.length || 0} tasks</span>
            {hasChanges[board.id] && (
              <div className="item-actions">
                <button
                  className="btn btn-save"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave(board.id);
                  }}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Boards;
