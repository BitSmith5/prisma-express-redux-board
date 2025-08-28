import React from 'react';
import Boards from './boards';
import Board from './board';

export const Kanban: React.FC = () => {
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
        <h2>Boards Overview:</h2>
        <Boards />
      </div>
      
      {/* Individual Board View - Shows selected board with its lists and tasks */}
      <div style={{ marginBottom: '3rem' }}>
        <h2>Individual Board View:</h2>
        <Board />
      </div>
    </div>
  );
};

export default Kanban;
