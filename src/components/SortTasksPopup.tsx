// import React, { useState } from 'react';

// interface Task {
//   _id: string;
//   id: number;
//   taskNumber: number;
//   taskName: string;
//   taskPriority: string;
//   taskStage: string;
//   taskType: string;
//   taskStatus: string;
//   tags: { label: string; value: string };
//   description: string;
//   taskSize: number | null;
//   taskAssignedto: { label: string; value: string };
//   createdAt: Date; // Using createdAt instead of date
// }

// interface SortTasksPopupProps {
//   tasks: Task[];
//   setSortedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
// }

// const SortTasksPopup: React.FC<SortTasksPopupProps> = ({ tasks, setSortedTasks }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [sortBy, setSortBy] = useState<string | null>(null); // 'taskPriority' or 'createdAt'
//   const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');

//   // Function to toggle the popup
//   const togglePopup = () => {
//     setIsOpen(!isOpen);
//   };

//   // Function to sort tasks by taskPriority or createdAt
//   const handleSort = (sortKey: keyof Task) => {
//     const sorted = [...tasks].sort((a, b) => {
//       if (a[sortKey] < b[sortKey]) {
//         return sortOrder === 'ascending' ? -1 : 1;
//       }
//       if (a[sortKey] > b[sortKey]) {
//         return sortOrder === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });
//     setSortedTasks(sorted);
//   };

//   return (
//     <div>
//       <button onClick={togglePopup}>
//         Sort Tasks
//       </button>

//       {isOpen && (
//         <div className="sort-popup">
//           <h4>Sort By:</h4>
//           <div className="sort-options">
//             <button 
//               onClick={() => setSortBy('taskPriority')} 
//               className={sortBy === 'taskPriority' ? 'selected' : ''}
//             >
//               Task Priority
//             </button>
//             <button 
//               onClick={() => setSortBy('createdAt')} 
//               className={sortBy === 'createdAt' ? 'selected' : ''}
//             >
//               Date Created
//             </button>
//           </div>

//           {sortBy && (
//             <div className="sort-order">
//               <h5>Sort Order:</h5>
//               <button onClick={() => setSortOrder('ascending')}>
//                 ↑ Ascending
//               </button>
//               <button onClick={() => setSortOrder('descending')}>
//                 ↓ Descending
//               </button>
//             </div>
//           )}

//           <button 
//             onClick={() => {
//               if (sortBy) {
//                 handleSort(sortBy as keyof Task);
//                 togglePopup(); // Close the popup after sorting
//               }
//             }}
//           >
//             Apply Sort
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SortTasksPopup;
