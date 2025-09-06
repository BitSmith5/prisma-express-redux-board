import React from 'react';
import List from './list';
import { useGetBoardQuery } from '../../store/v2/api/boardApi';

const Board: React.FC<{ boardId: number }> = ({ boardId }) => {
  const { data: board, isLoading: boardLoading, error: boardError } = useGetBoardQuery(boardId);
  
  // Don't render until board data is loaded
  if (boardLoading || !board) {
    return (
      <></>
    );
  }

  return (
    <>
      <div className="view-header">
        <h2 className="view-title">{board.title}</h2>
      </div>

      {/* Lists Container - Each list contains tasks */}
      <div className="columns">
        <List heading="To Do" boardId={board.id} status="TODO" />
        <List heading="In-Progress" boardId={board.id} status="IN_PROGRESS" />
        <List heading="Done" boardId={board.id} status="DONE" />
      </div>
    </>
  );
};

export default Board;
