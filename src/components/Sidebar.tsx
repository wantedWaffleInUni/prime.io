import React, { useState } from 'react';
import './Sidebar.css';

interface SidebarProps {
  onHomeClick: () => void;
  onSprintClick: () => void;
  onDashboardClick: () => void; 
  onArchiveClick: () => void;
  setTheme: (theme: string) => void;
  className?: string; // Add className to the props
}

const Sidebar: React.FC<SidebarProps> = ({ onHomeClick, onSprintClick, setTheme, onDashboardClick, onArchiveClick, className }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const homeButtonClick = () => {
    onHomeClick();
  };

  const sprintButtonClick = () => {
    onSprintClick();
  };

  const dashboardButtonClick = () => {
    onDashboardClick(); 
  };

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
    setIsDropdownOpen(false);
  };

  return (
    <aside className={`sidebar ${className || ''}`}> {/* Apply className here */}
      <nav>
        <ul>
          <li>
            <button onClick={homeButtonClick} className="sidebar-button">Home</button>
          </li>
          <li>
            <button onClick={dashboardButtonClick} className="sidebar-button">Dashboard</button>
          </li>
          <li>
            <button onClick={sprintButtonClick} className="sidebar-button">Sprint</button>
          </li>
          <li>
            <button onClick={onArchiveClick} className="sidebar-button">Archive</button> {/* Enable and handle click */}
          </li>
        </ul>
        <div className="sidebar-lower">
          <ul>
            <li>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="sidebar-lower-button">Theme</button>
              {isDropdownOpen && (
                <div className="theme-dropdown">
                  <ul>
                    <li><button onClick={() => handleThemeChange('default-light')}>Default Light</button></li>
                    <li><button onClick={() => handleThemeChange('default-dark')}>Default Dark</button></li>
                    <li><button onClick={() => handleThemeChange('barbie')}>Barbie</button></li>
                    <li><button onClick={() => handleThemeChange('anime-aot')}>Scout Regiment</button></li>
                    <li><button onClick={() => handleThemeChange('nature')}>Nature</button></li>
                    <li><button onClick={() => handleThemeChange('futuristic')}>Futuristic</button></li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
