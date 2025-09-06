import React from 'react';
import Task from './task';
import { useState } from 'react';
import type { TaskStatus } from '../../store/v2/types'
import { useGetBoardQuery, useCreateTaskMutation } from '../../store/v2/api/boardApi';

interface ListProps {
  heading: string;
  boardId: number;
  status: TaskStatus;
}

const List: React.FC<ListProps> = ({ heading, boardId, status }) => {
  const { data: board, isLoading: boardLoading } = useGetBoardQuery(boardId);
  const [createTask] = useCreateTaskMutation();
  const [description, setDescription] = useState<string>("");

  // Don't render until board data is loaded
  if (boardLoading || !board || !board.tasks) {
    return (
      <div className="column">
        <div className="column-header">
          <h3 className={`column-title status-${status.toLowerCase()}`}>{heading}</h3>
        </div>
        <div className="items">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const filteredTasks = board.tasks.length > 0 ? board.tasks.filter((task) => task.status === status) : [];

  function handleAddTask() {
    createTask({ title: "Untitled", boardId, status, description });
    setDescription("");
  }

  return (
    <div className="column">
      <div className="column-header">
        <h3 className={`column-title status-${status.toLowerCase()}`}>{heading}</h3>
        <button className="btn btn-primary" onClick={handleAddTask}>ADD TASK</button>
      </div>

      {/* Tasks in List */}
      <div className="items" style={{ marginBottom: '10px' }}>
        {filteredTasks.map((task) => (
          <Task key={task.id} taskId={task.id} boardId={boardId} />
        ))}
      </div>
    </div>
  );
};

export default List;
