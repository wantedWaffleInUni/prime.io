// SprintBoard.tsx
import React, { useEffect, useState } from 'react';
import SprintCard from './SprintCard';
import SprintModal from './SprintModal';
import axios from 'axios';
import SprintView from './SprintView';
import EditSprintModal from './EditSprintModal';
import './SprintPage.css';
import SprintKanban from './SprintKanban'; // Import the SprintKanban component

interface SprintKanbanProps {
  sprint: {
    _id: string;
    sprintName: string;
    sprintStartDate: string;
    sprintEndDate: string;
    status: string;
    totalLoggedTime: number;
  };
}
interface Sprint {
  _id: string;
  sprintName: string;
  sprintStartDate: string;
  sprintEndDate: string;
  status: string; // Add status field to track sprint status
  totalLoggedTime: number;
}

const SprintBoard: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSprintStarted, setIsSprintStarted] = useState(false); // Track if a sprint is started
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // State for managing ForceStartSprintButton's disabled state
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await axios.get("http://localhost:5000/readSprint");
        setSprints(response.data);
      } catch (error) {
        console.error('Error fetching sprints:', error);
      }
    };

    fetchSprints();
  }, []);

  const addSprint = (_id: string, sprintName: string, sprintStartDate: string, sprintEndDate: string) => {
    const newSprint: Sprint = { _id, sprintName, sprintStartDate, sprintEndDate , status: "Not Started", totalLoggedTime: 0 };
    setSprints([...sprints, newSprint]);
  };
  // Function to lock the sprint page and switch to the Kanban board
  const handleSprintClick = (sprint: Sprint) => {
    setActiveSprint(sprint);
  };

  const handleEditClick = (event: React.MouseEvent, sprint: Sprint) => {
    event.stopPropagation();
    setActiveSprint(sprint);
    setShowEditModal(true);
  };

  const handleUpdateSprint = (updatedSprint: Sprint) => {
    setSprints((prevSprints) =>
      prevSprints.map((sprint) =>
        sprint._id === updatedSprint._id ? updatedSprint : sprint
      )
    );
  };

  const handleBackToBoard = () => {
    setActiveSprint(null);  // Reset active sprint to show sprint board
  };

  return (
    <div className="sprint-board">
      {/* Render only the SprintKanban if a sprint is started */}
      {isSprintStarted && activeSprint ? (
        <SprintKanban sprint={activeSprint} /> // Show SprintKanban when the sprint is active
      ) : (
        <>
          {/* <ForceStartSprintButton
            onStart={handleForceStart}
            isDisabled={isDisabled}
          /> */}

          {activeSprint ? (
            <SprintView
              sprint={activeSprint}
              onBack={handleBackToBoard}
            />
          ) : (
            <>
              {sprints.map((sprint) => (
                <SprintCard
                  key={sprint._id}
                  sprintName={sprint.sprintName}
                  startDate={new Date(sprint.sprintStartDate).toDateString()}
                  endDate={new Date(sprint.sprintEndDate).toDateString()}
                  onClick={() => handleSprintClick(sprint)}
                  onEditClick={(event) => handleEditClick(event, sprint)}
                />
              ))}

              <SprintCard onAddClick={() => setShowModal(true)} />
            </>
          )}

          {showModal && (
            <SprintModal
              onClose={() => setShowModal(false)}
              onSubmit={addSprint}
            />
          )}

          {showEditModal && activeSprint && (
            <EditSprintModal
              sprint={activeSprint}
              onUpdate={handleUpdateSprint}
              onClose={() => setShowEditModal(false)}
            />
          )}
        </>
      )}
    {/*
  Force Start Sprint button at the bottom right
  <div className="force-start-wrapper">
    <ForceStartSprint sprints={sprints} onSprintStart={handleSprintStart} />
  </div>
*/}

    </div>
  );
};

export default SprintBoard;
