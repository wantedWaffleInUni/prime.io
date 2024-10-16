import React, { useState } from 'react';

interface SortButtonsProps {
  onSortOptionChange?: (option: string) => void;
  onSortOrderChange?: (order: 'asc' | 'desc') => void;
}

const SortButtons: React.FC<SortButtonsProps> = ({ onSortOptionChange, onSortOrderChange }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleSortOption = (option: string) => {
    setDropdownVisible(false);
    if (onSortOptionChange) {
      onSortOptionChange(option);
    }
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    if (onSortOrderChange) {
      onSortOrderChange(newOrder);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* Sort By Button */}
      <div style={{ position: 'relative' }}>
        <button onClick={toggleDropdown} style={{ padding: '10px' }}>
          Sort by...
        </button>
        {isDropdownVisible && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              listStyleType: 'none',
              padding: 0,
              margin: 0,
              zIndex: 1000,
            }}
          >
            <li
              style={{ padding: '10px', cursor: 'pointer' }}
              onClick={() => handleSortOption('priority')}
            >
              Sort by Priority
            </li>
            <li
              style={{ padding: '10px', cursor: 'pointer' }}
              onClick={() => handleSortOption('date')}
            >
              Sort by Date
            </li>
          </ul>
        )}
      </div>

      {/* Sort Order Button */}
      <button
        onClick={toggleSortOrder}
        style={{
          padding: '10px',
          marginLeft: '5px',
        }}
      >
        {sortOrder === 'asc' ? '⬆️' : '⬇️'}
      </button>
    </div>
  );
};

export default SortButtons;
