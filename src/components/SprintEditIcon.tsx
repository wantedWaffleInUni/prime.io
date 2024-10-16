import React from 'react';
import './SprintEditIcon.css';

interface SprintEditIconProps {
  onClick?: (event: React.MouseEvent) => void;
}

const SprintEditIcon: React.FC<SprintEditIconProps> = ({ onClick }) => {
  return (
    <div className='sprint-detail-icons'>
      <button onClick={onClick} className='edit-button'>
      ✎
      </button>
    </div>
  );
};

export default SprintEditIcon;