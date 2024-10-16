import React, { useState } from 'react';
import './dropdownlist.css'; // Import your existing CSS for styling

const Dropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Select an assignee');
  const [options, setOptions] = useState(['Aqraine', 'Marcus', 'Yanly']);
  const [newOption, setNewOption] = useState('');

  // Toggle dropdown open/close
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle option selection
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  // Handle adding a new option
  const addNewOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption]);
      setNewOption(''); // Clear input after adding
    }
  };

  return (
    <div className="dropdown-container">
      <div className="dropdown">
        <div className="select" onClick={toggleDropdown}>
          <span className="selected">{selectedOption}</span>
          <div className={`caret ${isOpen ? 'caret-rotate' : ''}`}></div>
        </div>

        <ul className={`menu ${isOpen ? 'menu-open' : ''}`}>
          {options.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      </div>

      <div className="add-option-container">
        <input
          id="new-option"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Add new assignee"
        />
        <button id="add-option-btn" onClick={addNewOption}>
          Add
        </button>
      </div>
    </div>
  );
};

export default Dropdown;
