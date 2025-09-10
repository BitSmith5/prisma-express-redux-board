import React, { useState, useEffect } from 'react';
import {
  useGetBoardsQuery,
  useCreateBoardMutation,
  useDeleteBoardMutation,
  useUpdateBoardMutation,
} from '../../store/v2/api/boardApi';

interface BoardsProps {
  currentBoardId: number | null;
  onBoardSelect: (boardId: number | null) => void;
}

const Boards: React.FC<BoardsProps> = ({ currentBoardId, onBoardSelect }) => {
  const { data: boards = [], isLoading: boardsLoading, error: boardsError } = useGetBoardsQuery();
  const [createBoard] = useCreateBoardMutation();
  const [deleteBoard] = useDeleteBoardMutation();
  const [updateBoard] = useUpdateBoardMutation();

  // Auto-select first board when boards load
  useEffect(() => {
    if (boards.length > 0 && !currentBoardId) {
      onBoardSelect(boards[0].id);
    }
  }, [boards, currentBoardId, onBoardSelect]);

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRefs = React.useRef<{ [key: number]: HTMLDivElement | null }>({});

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
    createBoard("Untitled");
  }

  function handleDeleteBoard(boardId: number, event?: React.MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent card click
    }
    deleteBoard(boardId);
    setOpenDropdownId(null);
  }

  function handleToggleDropdown(boardId: number, event: React.MouseEvent) {
    event.stopPropagation(); // Prevent card click
    setOpenDropdownId(openDropdownId === boardId ? null : boardId);
  }

  function handleTitleChange(boardId: number, newTitle: string) {
    updateBoard({ boardId, title: newTitle });
  }

  // Show loading state while fetching boards
  if (boardsLoading) {
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
  if (boardsError) {
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
            className={`card ${currentBoardId === board.id ? 'selected' : ''}`}
            key={board.id}
            onClick={() => onBoardSelect(board.id)}
          >
            <div className="card-header">
              <div style={{ display: "flex", gap: "10px", alignItems: "start", flex: 1 }}>
                <input
                  className="input-title"
                  type="text"
                  placeholder="Enter a title..."
                  value={board.title || "Untitled"}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Boards;