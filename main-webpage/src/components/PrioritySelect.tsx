import React, { useState } from 'react';
import './dropdownlist.css';

const PrioritySelect: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Priority');
  const [options] = useState(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']); // Static options

  // Toggle dropdown open/close
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle option selection
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false); // Close dropdown after selecting
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
    </div>
  );
};

export default PrioritySelect;
