import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import EditTaskForm from "./EditTaskForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./TaskTable.css";

interface Task {
  _id: string;
  id: number;
  taskNumber: number;
  taskName: string;
  taskPriority: string;
  taskStage: string;
  taskType: string;
  taskStatus: string;
  tags: { label: string; value: string };
  description: string;
  taskSize: number | null;
  taskAssignedto: { label: string; value: string };
  createdAt: Date;
  sprintStage: string;
  sprint: string;
  totalTimeLogged: number;
  completionDate: Date;
}

// Define the sort key types explicitly
type SortKey = "taskPriority" | "createdAt";

const SprintTaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({
    key: "taskPriority", // Default sort key
    direction: "asc",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/readTask"); // Adjust the URL based on your backend route
        const tasks = response.data.map((task: any) => ({
          ...task,
          tags: task.tags,
          taskAssignedto: task.taskAssignedto,
        }));
        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const getRowColor = (task: Task) => {
    switch (task.taskPriority) {
      case "Urgent":
        return "#ffa69e";
      case "Less Urgent":
        return "#fdffb6";
      case "Not Urgent":
        return "#caffbf";
      default:
        return "#bfbaba";
    }
  };

  // Function to always sort in ascending order
  const sortTasksAscending = (key: SortKey) => {
    let sortedTasks = [...tasks].sort((a, b) => {
      if (key === "taskPriority") {
        const priorityValues: { [key: string]: number } = {
          "Urgent": 1,
          "Less Urgent": 2,
          "Not Urgent": 3,
        };
        return priorityValues[a.taskPriority] - priorityValues[b.taskPriority];
      } else if (key === "createdAt") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });

    setTasks(sortedTasks);
    setSortConfig({ key, direction: "asc" }); // Set direction to "asc" after sorting
  };

  // Toggle sort order (ascending/descending)
  const toggleSortOrder = () => {
    const newDirection = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({
      ...sortConfig,
      direction: newDirection,
    });

    // Re-sort based on the new direction
    let sortedTasks = [...tasks].sort((a, b) => {
      if (sortConfig.key === "taskPriority") {
        const priorityValues: { [key: string]: number } = {
          "Urgent": 1,
          "Less Urgent": 2,
          "Not Urgent": 3,
        };
        return newDirection === "asc"
          ? priorityValues[a.taskPriority] - priorityValues[b.taskPriority]
          : priorityValues[b.taskPriority] - priorityValues[a.taskPriority];
      } else if (sortConfig.key === "createdAt") {
        return newDirection === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    setTasks(sortedTasks); // Apply sorting
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    closeModal();
  };

  // Helper to format the createdAt date
  const formatDate = (dateString: Date) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {/* Sort by buttons integrated directly inside SprintTaskTable */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
        <button 
          onClick={() => sortTasksAscending('taskPriority')} 
          style={{ padding: '12px 25px', minWidth: '180px', fontSize: '16px', backgroundColor: sortConfig.key === 'taskPriority' ? '#6c757d' : '#e0e0e0', color: sortConfig.key === 'taskPriority' ? 'white' : 'black', borderRadius: '5px', border: 'none', margin: '0 10px' }}
        >
          Sort by Priority
        </button>
        <button 
          onClick={() => sortTasksAscending('createdAt')} 
          style={{ padding: '12px 25px', minWidth: '180px', fontSize: '16px', backgroundColor: sortConfig.key === 'createdAt' ? '#6c757d' : '#e0e0e0', color: sortConfig.key === 'createdAt' ? 'white' : 'black', borderRadius: '5px', border: 'none', margin: '0 10px' }}
        >
          Sort by Date
        </button>
        <button 
          onClick={toggleSortOrder} 
          style={{ padding: '12px 25px', minWidth: '60px', fontSize: '16px', margin: '0 10px' }}
        >
          {sortConfig.direction === 'asc' ? '⬆️' : '⬇️'}
        </button>
      </div>

      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="SprintTaskTable">
          {(provided) => (
            <table ref={provided.innerRef} {...provided.droppableProps}>
              <thead>
                <tr>
                  <th>Task Number</th>
                  <th>Task Name</th>
                  <th>Tags</th>
                  <th>Story Points</th>
                  <th>Priority</th>
                  <th
                    onClick={() => sortTasksAscending("createdAt")}
                    style={{ cursor: "pointer" }}
                  >
                    Creation Date{" "}
                    {sortConfig.key === "createdAt" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <Draggable key={task.taskNumber} draggableId={task._id.toString()} index={task.id}>
                    {(provided) => (
                      <tr
                        key={task.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => handleTaskClick(task)}
                        style={{
                          backgroundColor: getRowColor(task),
                          cursor: "pointer"
                        }}
                      >
                        <td>{task.taskNumber}</td>
                        <td>{task.taskName}</td>
                        <td>{task.tags.value}</td>
                        <td>{task.description}</td>
                        <td>{task.taskPriority}</td>
                        <td>{formatDate(task.createdAt)}</td> {/* New column for Creation Date */}
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>

      {modalIsOpen && selectedTask && (
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
          <EditTaskForm
            task={selectedTask}
            onUpdate={handleTaskUpdate}
            onClose={closeModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default SprintTaskTable;
