import React, { useState } from 'react'
import TaskTable from './TaskTable';
import TaskForm from './TaskForm';

interface MainContentProps {
  currentSection: string;
}

const MainContent: React.FC<MainContentProps> = ({ currentSection }) => {
  const [showForm, setShowForm] = useState(false);
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <main className="main-content">
      {currentSection === 'home' && (
        <section>
          <h2>
            <TaskTable />
          </h2>
          <button onClick={toggleForm} className="toggle-task-form-button">
            +
          </button>          
          {showForm && <TaskForm />}
        </section>
      )}
    </main>
  );
};

export default MainContent;
