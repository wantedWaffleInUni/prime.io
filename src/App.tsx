import React, { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Header from './components/Header';
import SprintBoard from './components/SprintPage'; // Import the SprintBoard component
import DashboardPage from './components/DashboardPage';
import ArchivePage from './components/ArchivePage';


const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [theme, setTheme] = useState<string>('default');
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleHomeClick = () => {
    setCurrentSection('home');
  };

  const handleSprintClick = () => {
    setCurrentSection('sprint');
  };

  const handleDashboardClick = () => {
    setCurrentSection('dashboard');
  };

  const handleArchiveClick = () => {
    setCurrentSection('archive');
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible); 
  };

  return (
    <div className="app-container">
      <Header />
      <div>
        <button className="toggle-sidebar-button" onClick={toggleSidebar}>
          {isSidebarVisible ? '>>' : '<<'}
        </button>
      </div>

      <div className={`content-container ${isSidebarVisible ? '' : 'content-full'}`}>
        <Sidebar 
          className={isSidebarVisible ? '' : 'sidebar-hidden'}
          onHomeClick={handleHomeClick} 
          onSprintClick={handleSprintClick}  // Pass handleSprintClick to Sidebar
          onDashboardClick={handleDashboardClick}
          onArchiveClick={handleArchiveClick}
          setTheme={setTheme}
        />
        {/* Conditional Rendering based on currentSection */}
        {currentSection === 'home' && <MainContent currentSection={currentSection} />}
        {currentSection === 'sprint' && <SprintBoard />}
        {currentSection === 'dashboard' && <DashboardPage />}
        {currentSection === 'archive' && <ArchivePage />}
      </div>
    </div>
  );
};

export default App;
