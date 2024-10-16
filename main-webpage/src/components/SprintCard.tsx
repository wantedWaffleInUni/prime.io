import React from 'react';
import SprintEditIcon from './SprintEditIcon';

interface SprintCardProps {
  sprintName?: string;
  startDate?: string;
  endDate?: string;
  onAddClick?: () => void;
  onClick?: () => void;
  onEditClick?: (event: React.MouseEvent) => void;
}

const SprintCard: React.FC<SprintCardProps> = ({
  sprintName,
  startDate,
  endDate,
  onAddClick,
  onClick,
  onEditClick = () => {},
}) => {

  // Calculate the status based on current date
  const calculateStatus = () => {
    const currentDate = new Date();
    const start = new Date(startDate || '');
    const end = new Date(endDate || '');

    if (currentDate < start) {
      return 'Not Started';
    } else if (currentDate >= start && currentDate <= end) {
      return 'Active';
    } else {
      return 'Completed';
    }
  };

  const status = calculateStatus();

  return (
    <div className="sprint-card" onClick={onClick}>
      {sprintName ? (
        <div className="sprint-details">
          <h3>{sprintName}</h3>
          <p><strong>Start:</strong> {startDate}</p>
          <p><strong>End:</strong> {endDate}</p>
          <p><strong>Status:</strong> {status}</p> {/* Display status */}
          <SprintEditIcon onClick={onEditClick} />
        </div>
      ) : (
        <div className="add-sprint" onClick={onAddClick}>
          <span>+</span>
          <p>Create Sprint</p>
        </div>
      )}
    </div>
  );
};

export default SprintCard;
