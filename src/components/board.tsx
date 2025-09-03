import React from 'react';
import List from './list';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const Board: React.FC = () => {
  const board = useSelector((state: RootState) => state.board.board);
  const boardStatus = useSelector((state: RootState) => state.board.status);

  // Don't render until board data is loaded
  if (boardStatus === "loading" || !board || board.id === 0) {
    return (
      <div className="view">
        <div className="view-header">
          <h2 className="view-title">Loading Board...</h2>
        </div>
        <p>Please wait while the board loads...</p>
      </div>
    );
  }

  return (
    <div className="view">
      <div className="view-header">
        <h2 className="view-title">{board.title}</h2>
      </div>

      {/* Lists Container - Each list contains tasks */}
      <div className="columns">
        <List heading="To Do" boardId={board.id} status="TODO" />
        <List heading="In-Progress" boardId={board.id} status="IN_PROGRESS" />
        <List heading="Done" boardId={board.id} status="DONE" />
      </div>
    </div>
  );
};

export default Board;
