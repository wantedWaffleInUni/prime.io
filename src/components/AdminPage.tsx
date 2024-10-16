import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import { BarChart } from '@mui/x-charts/BarChart';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './AdminPage.css';

const AdminPage: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [times, setTimes] = useState([]);
  const [dayCount, setDayCount] = useState(0);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/readUser');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

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

  const handleSelect = (date: any) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setDayCount(Math.round((date.selection.endDate - date.selection.startDate) / (1000 * 60 * 60 * 24)));
  };

  const handleCreateUser = async () => {
    try {
      const response = await axios.post('http://localhost:5000/createUser', {
        username,
        password,
        userStatus: 'team-member',  // You can make this dynamic based on your need
      });
      console.log('User created:', response.data);
      alert('User created successfully');
      setShowForm(false); // Hide form after successful creation
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    }
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  };

  return (
    <div className="admin-dashboard">
      {/* Date Range Picker */}
      <div className="date-range">
        <DateRangePicker 
          className="date-range-picker"
          ranges={[selectionRange]}
          onChange={handleSelect}
        />
      </div>

      {/* Create User Section */}
      <div className="create-user-section">
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="create-user-toggle-button">
          {showForm ? 'Cancel' : 'Create New User'}
        </button>
        
        {showForm && (
          <div className="create-user-form">
            <h2>Create New User</h2>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="create-user-input"
            />
            
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="create-user-input"
            />

            <button 
              onClick={handleCreateUser} 
              className="create-user-submit-button">
              Submit
            </button>
          </div>
        )}
      </div> 

      {/* Team Logged Time Table */}
      <div className="team-log-time">
        <h1>Team Logged Time</h1>
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Average Logged Time Per Day (hours)</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.userStatus}</td>
                <td>
                  {(times
                    .filter((timeLog: any) => timeLog.userId === user._id)
                    .reduce((acc: number, curr: any) => {
                      const timeDate = new Date(curr.date);
                      const time = curr.time;
                      if (timeDate >= startDate && timeDate <= endDate) {
                        return acc + time;
                      }
                      return acc;
                    }, 0) / dayCount).toFixed(2) || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Contributions Section */}
      <div className="total-contributions">
        <h1>Contribution Chart</h1>
        <div className='bar-chart'>
        <BarChart className='bar-chart'
        dataset={users.map((user: any) => ({
          username: user.username,
          value: (times
            .filter((timeLog: any) => timeLog.userId === user._id)
            .reduce((acc: number, curr: any) => {
              const timeDate = new Date(curr.date);
              const time = curr.time;
              if (timeDate >= startDate && timeDate <= endDate) {
                return acc + time;
              }
              return acc;
            }, 0)) || 0,
        }))}
        xAxis={[{scaleType: 'band', dataKey: 'username'}]}
        yAxis={[{scaleType: 'linear', dataKey: 'value'}]}
        series={[{type: 'bar', dataKey: 'value'}]}
        height={400}
        width={800}
        
        />
        </div>
      </div>

      
    </div>
  );
};

export default AdminPage;