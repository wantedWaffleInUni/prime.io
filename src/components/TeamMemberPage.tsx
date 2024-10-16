import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import axios from 'axios';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './TeamMemberPage.css'

interface userProps {
  user: {
    _id: string;
    username: string;
    password: string;
    totalTimelogged: number;
    securityQuestionID: string; 
    securityAns: string;
    userStatus: string;
  }
}

interface Task {
  taskNumber: number;
  taskName: string;
  taskAssignedto: { label: string, value: string };
  taskStatus: string;
  dueDate?: Date;
  sprintStage: string;
  tags: { label: string, value: string };
  description: string;
  taskPriority: string;
}

const TeamMemberPage: React.FC<userProps> = ({user}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  // const [dayCount, setDayCount] = useState(0);
  const [times, setTimes] = useState<any>([]);
  const [tasks, setTasks] = useState<Task[]>([]); // State to store tasks

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  };

  const handleSelect = (date: any) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    // setDayCount(Math.round((date.selection.endDate - date.selection.startDate) / (1000 * 60 * 60 * 24)));
  };

  useEffect(() => {
    const fetchLoggedTime = async () => {
      try {
        const response = await axios.get('http://localhost:5000/readTime');
        setTimes(response.data);
      } catch (error) {
        console.error('Error fetching times:', error);
      }
    };
    fetchLoggedTime();
  }, []);

  useEffect(() => {
    // Fetch tasks assigned to the user and exclude tasks marked as "Done" in the sprint stage
    const fetchAssignedTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/readTask');
        const assignedTasks = response.data
          .filter((task: Task) => task.taskAssignedto.value === user._id && task.sprintStage !== 'Done');
        setTasks(assignedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchAssignedTasks();
  }, [user._id]);

  return (
    <div className='team-dashboard'>
      {/* Date Range Picker */}
      <div className="date-range">
        <DateRangePicker 
          className="date-range-picker"
          ranges={[selectionRange]}
          onChange={handleSelect}
        />
      </div>

      {/* Assigned Tasks */}
      <div className='assigned-tasks'>
        <h1>Tasks Assigned</h1>
        <table>
          <thead>
            <tr>
              <th>Task Number</th>
              <th>Task Name</th>
              <th>Tags</th>
              <th>Story Points</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task: Task) => (
              <tr key={task.taskNumber}>
                <td>{task.taskNumber}</td>
                <td>{task.taskName}</td>
                <td>{task.tags.label}</td>
                <td>{task.description}</td>
                <td>{task.taskPriority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Time Log */}
      <div className='total-time-log'>
        <h1>Total Time Log</h1>
        <table>
          <thead>
            <tr>
              <th>Date Range</th>
              <th>Total Time Logged (hours)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{startDate.toDateString()} - {endDate.toDateString()}</td>
              <td>{times.filter((time: any) => time.userId === user._id)
              .reduce((acc: number, curr: any) => {
                const timeDate = new Date(curr.date);
                const time = curr.time;
                if (timeDate >= startDate && timeDate <= endDate) {
                  return acc + time;
                }
                return acc;
              }, 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMemberPage;