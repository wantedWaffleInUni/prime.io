import React, { useEffect, useState } from 'react';
import SprintKanban from './SprintKanban';
import ForceStartSprintButton from './ForceStartSprintButton';
import axios from 'axios';
import './SprintView.css';

interface SprintViewProps {
  sprint: {
    _id: string;
    sprintName: string;
    sprintStartDate: string;
    sprintEndDate: string;
    status: string;
    totalLoggedTime: number;
  };
  onBack: () => void;  // Function to go back to sprint board
}

const SprintView: React.FC<SprintViewProps> = ({ sprint, onBack }) => {
  const [sprintStatus, setSprintStatus] = useState<string>('Not Started');
  const [isActive, setIsActive] = useState(false); // Track if the sprint is active
  const [isDisabled, setIsDisabled] = useState(false); // Track if the Force Start button is disabled

  useEffect(() => {
    const now = new Date();
    const startDate = new Date(sprint.sprintStartDate);
    const endDate = new Date(sprint.sprintEndDate);

    if (now < startDate) {
      setSprintStatus('Not Started');
    } else if (now >= startDate && now <= endDate) {
      setSprintStatus('Active');
    } else if (now > endDate) {
      setSprintStatus('Completed');
    }
  }, [sprint.sprintStartDate, sprint.sprintEndDate]);

  // Load active state from local storage when the component mounts
  useEffect(() => {
    const storedActiveState = localStorage.getItem(`activeSprint_${sprint.sprintName}`);
    if (storedActiveState === 'true') {
      setIsActive(true);
    }
  }, [sprint.sprintName]);

  const handleStartSprint = async () => {
    setIsActive(true); // Set sprint as active
    setSprintStatus('Active');
    const currentDate = new Date();
    const startSprint = { ...sprint, status: 'Active', sprintStartDate: currentDate.toISOString() };
    disableForceStartButton();
    try {
      const response = await axios.put(`http://localhost:5000/updateSprint`, startSprint);
      if (response.status === 200) {
        alert("Sprint started");
      }
    } catch (error) {
      console.error('Error starting sprint:', error);
    }
  };

  const disableForceStartButton = () => {
    setIsDisabled(true);
  }

  const handleEndSprint = () => {
    setIsActive(false); // Set sprint as inactive
    localStorage.removeItem(`activeSprint_${sprint.sprintName}`); // Remove active state
  };

  return (
    <div className="sprint-view-container">
    <button 
      onClick={onBack} 
      style={{ 
        marginBottom: '1rem', 
        padding: '1rem 2rem', 
        backgroundColor: '#e2b7b7',
        color: '#fff', 
        border: 'none', 
        borderRadius: '5px', 
        cursor: 'pointer', 
        fontSize: '1rem', 
        width: '100%', 
        maxWidth: '250px', 
        textAlign: 'center',
      }}
    >
      Back to Sprint Board
    </button>
    <div className='sprint-view-content'>
      <h2>{sprint.sprintName} - Kanban Board</h2>
      {/* condition: show force start button only if sprint is not started */}
      {sprintStatus === 'Not Started' && (
        <p>
          <ForceStartSprintButton onStart={handleStartSprint} isDisabled={isDisabled}/>
        </p>
      )}
      <p>
        <strong>Start Date:</strong> {new Date(sprint.sprintStartDate).toDateString()} <br />
        <strong>End Date:</strong> {new Date(sprint.sprintEndDate).toDateString()}
      </p>
      <SprintKanban 
        sprint ={sprint}/>
    </div>
    </div>
  );
};

export default SprintView;