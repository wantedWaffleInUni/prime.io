// EditSprintModal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SprintModal.css';

interface Sprint {
  _id: string;
  sprintName: string;
  sprintStartDate: string;
  sprintEndDate: string;
  status: string;
  totalLoggedTime: number;
}

interface EditSprintModalProps {
  sprint: Sprint;
  onUpdate: (updatedSprint: Sprint) => void;
  onClose: () => void;
}

const EditSprintModal: React.FC<EditSprintModalProps> = ({ sprint, onUpdate, onClose }) => {
  const [sprintName, setSprintName] = useState(sprint.sprintName);
  const [sprintStartDate, setSprintStartDate] = useState(sprint.sprintStartDate);
  const [sprintEndDate, setSprintEndDate] = useState(sprint.sprintEndDate);
  const [error, setError] = useState('');

  useEffect(() => {
    setSprintName(sprint.sprintName);
    setSprintStartDate(sprint.sprintStartDate);
    setSprintEndDate(sprint.sprintEndDate);
  }, [sprint]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    if (new Date(sprintEndDate) < new Date(sprintStartDate)) {
      setError('End date cannot be before start date.'); // Set error message
      return; // Exit if the end date is invalid; no submission occurs
    }

    const updatedSprint = {
      _id: sprint._id,
      sprintName,
      sprintStartDate: new Date(sprintStartDate).toISOString(),
      sprintEndDate: new Date(sprintEndDate).toISOString(),
      status: sprint.status,
      totalLoggedTime: sprint.totalLoggedTime,
    };

    try {
      const response = await axios.put(`http://localhost:5000/updateSprint`, updatedSprint);
      if (response.status === 200) {
        alert("Sprint updated");
        onUpdate(updatedSprint);
        onClose();
      }
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update sprint");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Sprint</h2>
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
              value={new Date(sprintStartDate).toISOString().split("T")[0]}
              onChange={(e) => setSprintStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={new Date(sprintEndDate).toISOString().split("T")[0]}
              onChange={(e) => setSprintEndDate(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-date-validation">{error}</p>}
          <button type="submit" className="button submit-button">Update</button>
        </form>
        <button onClick={onClose} className="button close-button">Close</button>
      </div>
    </div>
  );
};

export default EditSprintModal;
