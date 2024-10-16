import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SprintModal.css'; // For modal styling

interface SprintModalProps {
  onClose: () => void;
  onSubmit: (_id: string, sprintName: string, sprintStartDate: string, sprintEndDate: string) => void;
}

const SprintModal: React.FC<SprintModalProps> = ({ onClose, onSubmit }) => {
  const [sprintName, setSprintName] = useState('');
  const [sprintStartDate, setSprintStartDate] = useState('');
  const [sprintEndDate, setSprintEndDate] = useState('');
  const [error, setError] = useState('');
  const [existingSprints, setExistingSprints] = useState([]); // Store existing sprints

  // Fetch existing sprints when the component mounts
  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await axios.get("http://localhost:5000/readSprint"); // Fetch existing sprints from the server
        setExistingSprints(response.data); // Store sprints in state
      } catch (error) {
        console.error("Error fetching sprints:", error);
      }
    };

    fetchSprints();
  }, []);

  // Function to check for date conflicts
  const checkDateConflict = (newStartDate: Date, newEndDate: Date) => {
    return existingSprints.some((sprint: { sprintStartDate: string, sprintEndDate: string }) => {
      const existingSprintStart = new Date(sprint.sprintStartDate);
      const existingSprintEnd = new Date(sprint.sprintEndDate);

      // Check if new sprint's start or end date overlaps with any existing sprint
      return (
        (newStartDate <= existingSprintEnd && newEndDate >= existingSprintStart) // Overlapping condition
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    const newStartDate = new Date(sprintStartDate);
    const newEndDate = new Date(sprintEndDate);

    // Validate that end date is not before start date
    if (newEndDate < newStartDate) {
      setError('End date cannot be before start date.');
      return;
    }

    // Validate that the new sprint dates do not overlap with existing sprints
    if (checkDateConflict(newStartDate, newEndDate)) {
      setError('Sprint dates overlap with an existing sprint.');
      return; // Exit if the dates overlap
    }

    // If no conflicts, proceed with creating the sprint
    const sprintData = {
      sprintName,
      sprintStartDate,
      sprintEndDate,
      status: 'Not Started' // Default status for a new sprint
    };

    try {
      const response = await axios.post("http://localhost:5000/createSprint", sprintData);
      console.log("Sprint created:", response.data);
      const { _id } = response.data;
      onSubmit(_id, sprintName, sprintStartDate, sprintEndDate);
      onClose();
    } catch (error) {
      console.error("Error creating sprint:", error);
      alert("Failed to create sprint. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create a New Sprint</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Sprint Name</label>
            <input
              type="text"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={sprintStartDate}
              onChange={(e) => setSprintStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={sprintEndDate}
              onChange={(e) => setSprintEndDate(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-date-validation">{error}</p>}
          <button type="submit" className="button submit-button">Submit</button>
        </form>
        <button onClick={onClose} className="button close-button">Close</button>
      </div>
    </div>
  );
};

export default SprintModal;
