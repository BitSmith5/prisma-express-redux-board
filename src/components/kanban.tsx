import React, { useState } from 'react';
import Boards from './v2/boards';
import Board from './v2/board';

export const Kanban: React.FC = () => {
  const [currentBoardId, setCurrentBoardId] = useState<number | null>(null);

  return (
    <div className="container">
      {/* Main Kanban Container */}
      
      {/* This component will manage:
          - Current view (boards list vs individual board)
          - Selected board state
          - Navigation between views
          - Redux state management
      */}
      
      {/* Boards Overview - Shows all boards */}
      <div style={{ marginBottom: '3rem' }}>
        <Boards currentBoardId={currentBoardId} onBoardSelect={setCurrentBoardId}/>
      </div>
      
      {/* Individual Board View - Shows selected board with its lists and tasks */}
      <div style={{ marginBottom: '3rem' }}>
        {currentBoardId && <Board boardId={currentBoardId}/>}
      </div>
    </div>
  );
};

export default Kanban;
