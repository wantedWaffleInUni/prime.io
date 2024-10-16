import React, { useEffect, useState } from 'react';
import AdminPage from './AdminPage';
import TeamMemberPage from './TeamMemberPage';
import axios from 'axios';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const [loginType, setLoginType] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loginCount, setLoginCount] = useState<number>(0); // Track the number of admin logins
  const [securityQuestionID, setSecurityQuestionID] = useState<string>(''); // Track chosen question
  const [securityAns, setSecurityAns] = useState<string>(''); // Track answer
  const [retrievedPassword, setRetrievedPassword] = useState<string>(''); // State for displaying the password

  const securityQuestions = [
    "What is your favourite food?",
    "What is your favourite pet?",
    "What city were you born in?",
    "What is your favorite book?"
  ];

  interface User {
    _id: string;
    username: string;
    password: string;
    totalTimelogged: number;
    securityQuestionID: string;
    securityAns: string;
    userStatus: string;
    loginCount: number;
  }

  useEffect(() => {
    fetchUsers();
    const storedLoginCount = localStorage.getItem('loginCount');
    if (storedLoginCount) {
      setLoginCount(Number(storedLoginCount));
    }
  }, []);

  const handleLogin = (type: string) => {
    setLoginType(type);
    setError('');
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/readUser');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();

    if (loginType === 'admin') {
      users.map((user: any) => {
        if (user.username === username && user.password === password) {
          setUser(user);
          setLoginCount(user.loginCount);
          localStorage.setItem('loginCount', user.loginCount.toString());

          if (loginCount === 0) {
            setLoginCount(loginCount + 1);
          } else {
            setIsLoggedIn(true);
          }
        }
      });
    } else if (loginType === 'team-member') {
      users.map((user: any) => {
        if (user.username === username && user.password === password) {
          setUser(user);
          setIsLoggedIn(true);
        }
      });
    } else {
      setError('Invalid username or password');
    }
  };

  const handleCancel = () => {
    setLoginType(null);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleSecurityQuestion = async () => {
    try {
      const userData = {
        securityQuestionID: securityQuestionID,
        securityAns: securityAns,
        loginCount: loginCount + 1,
      };
      const result = await axios.put(
        `http://localhost:5000/updateUserSecurity/${user._id}`,
        userData
      );
      console.log('User security question updated:', result.data);
      const newLoginCount = loginCount + 1;
      setLoginCount(newLoginCount);
      localStorage.setItem('loginCount', newLoginCount.toString());
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error updating user security question:', error);
    }
  };

  const handleForgetPassword = () => {
    const foundUser = users.find(user => user.username === username);
    if (foundUser) {
      const question = securityQuestions[parseInt(foundUser.securityQuestionID, 10)];
      const userAnswer = prompt(`Answer the security question: ${question}`);

      if (userAnswer === foundUser.securityAns) {
        setRetrievedPassword(foundUser.password); // Store the password in the state
      } else {
        alert('Incorrect answer.');
      }
    }
  };

  return (
    <div className="dashboard-page">
      {!isLoggedIn && !loginType && (
        <div className="dashboard-options">
          <button
            onClick={() => handleLogin('admin')}
            className="dashboard-button"
          >
            Admin
          </button>
          <button
            onClick={() => handleLogin('team-member')}
            className="dashboard-button"
          >
            Team Member
          </button>
        </div>
      )}

      {loginType && !isLoggedIn && (
        <div className="login-form">
          <h3>{loginType === 'admin' ? 'Admin' : 'Team Member'} Login</h3>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLoginSubmit}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label>
              Password:
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="login-button">
              Login
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            {loginType === 'admin' && loginCount > 1 && (
              <button onClick={handleForgetPassword} className="forget-password-button">
                Forget Password
              </button>
            )}
          </form>

          {retrievedPassword && (
            <p className="retrieved-password">
              Your password is: {retrievedPassword}
            </p>
          )}
        </div>
      )}

      {loginCount === 1 && loginType === 'admin' && (
        <div className="security-question-form">
          <h3>Security Question Setup</h3>
          <label>
            Choose a security question:
            <select
              value={securityQuestionID}
              onChange={(e) => setSecurityQuestionID(e.target.value)}
              required
            >
              <option value="">Select a question</option>
              {securityQuestions.map((question, index) => (
                <option key={index} value={index.toString()}>
                  {question}
                </option>
              ))}
            </select>
          </label>
          <label>
            Answer:
            <input
              type="text"
              value={securityAns}
              onChange={(e) => setSecurityAns(e.target.value)}
              required
            />
          </label>
          <button type="button" onClick={handleSecurityQuestion}>
            Submit
          </button>
        </div>
      )}

      {isLoggedIn && loginType === 'admin' && <AdminPage />}
      {isLoggedIn && loginType === 'team-member' && (
        <TeamMemberPage user={user} />
      )}
    </div>
  );
};

export default DashboardPage;