import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './sort.css'; // Adjust the path as needed

type Status = 'Urgent' | 'Normal' | 'Not urgent';

interface Task {
  id: number;
  status: Status;
  date: string;
  description: string;
}

const TaskSorter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Sort by');
  const [tasks, setTasks] = useState<Task[]>([]); // Empty array initially
  const [loading, setLoading] = useState<boolean>(true);

  const statusOrder: Record<Status, number> = {
    Urgent: 1,
    Normal: 2,
    'Not urgent': 3,
  };

  // Fetch tasks from the database
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Replace '/api/tasks' with your actual API endpoint
        const response = await axios.get('/api/tasks'); 
        setTasks(response.data); // Store the tasks from the database
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false); // In case of error, stop loading
      }
    };

    fetchTasks(); // Call the function to fetch tasks on component mount
  }, []); // Empty dependency array means this runs once on mount

  // Toggle dropdown open/close
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle sorting
  const handleSort = (sortType: string) => {
    setSelectedOption(sortType === 'status' ? 'Status' : 'Date');
    setIsOpen(false); // Close the dropdown after selection

    let sortedTasks = [...tasks];

    if (sortType === 'status') {
      sortedTasks = sortedTasks.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    } else if (sortType === 'date') {
      sortedTasks = sortedTasks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort latest to oldest
    }

    setTasks(sortedTasks); // Update tasks in state
  };

  if (loading) {
    return <div>Loading tasks...</div>; // Show loading state while fetching
  }

  return (
    <div className="dropdown-container">
      <label htmlFor="sort-button">Group by</label>
      <div className="dropdown">
        <button className="dropdown-toggle" id="sort-button" onClick={toggleDropdown}>
          {selectedOption}
        </button>
        <li onClick={() => handleSort('status')}>Status</li>
        <li onClick={() => handleSort('date')}>Date</li>
    </div><div id="task-list">
        <h2>Task List</h2>
        <ul id="tasks">
          {tasks.map((task) => (
            <li key={task.id}>
              {task.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskSorter;