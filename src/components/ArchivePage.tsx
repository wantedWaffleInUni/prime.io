import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TaskTable.css";

interface Task {
  _id: string;
  id: number;
  taskNumber: number;
  taskName: string;
  tags: { label: string; value: string };
  description: string;
  taskPriority: string;
  createdAt: Date;
  sprintStage: string;
  sprint: string;
}

const ArchivePage: React.FC = () => {
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchDoneTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/readTask"); // Adjust the URL as needed
        const tasks = response.data;
        const filteredTasks = tasks.filter(
          (task: Task) => task.sprintStage === "Done"
        );
        setDoneTasks(filteredTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchDoneTasks();
  }, []);

  return (
    // <div>
      <table>
        <thead>
          <tr>
            <th>Task Number</th>
            <th>Task Name</th>
            <th>Tags</th>
            <th>Description</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {doneTasks.map((task) => (
            <tr key={task.id} style={{ backgroundColor: "#e0e0e0" }}> {/* All rows grey */}
              <td>{task.taskNumber}</td>
              <td>{task.taskName}</td>
              <td>{task.tags.value}</td>
              <td>{task.description}</td>
              <td>{task.taskPriority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    // </div>
  );
};

export default ArchivePage;
