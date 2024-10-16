import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select"; // Use Select from react-select
import "./TaskForm.css"; // CSS for styling
import CreatableSelect from "react-select/creatable";

interface Task {
  id: number;
  taskNumber: number;
  taskName: string;
  taskPriority: string;
  taskStage: string;
  taskType: string;
  taskStatus: string;
  tags: { label: string; value: string }; // Array of tag objects
  description: string;
  taskSize: number | null;
  taskAssignedto: { label: string; value: string };
  createdAt: Date;
  sprintStage: string;
  sprint: string;
}

const existingTags = [
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Database", value: "database" },
];

const TaskForm: React.FC = () => {
  const [taskData, setTaskData] = useState<Task>({
    id: 0,
    taskNumber: 0,
    taskName: "",
    taskPriority: "",
    taskStage: "",
    taskType: "",
    taskStatus: "",
    tags: { label: "", value: "" },
    description: "",
    taskSize: null,
    taskAssignedto: { label: "", value: "" },
    createdAt: new Date(),
    sprintStage: "Backlog",
    sprint: "",
    });

  const [teamMembers, setTeamMembers] = useState<{ label: string; value: string }[]>([]); // State to hold team members

  // Fetch team members from the database
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/readUser"); // Replace with your actual API endpoint
        const users = response.data.map((user: any) => ({
          label: user.username, // Assuming the user object has 'username'
          value: user._id,      // Assuming the user object has '_id'
        }));
        setTeamMembers(users);  // Set team members for the dropdown
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value,
    });
  };

  const createOption = (label: string) => ({
    label: label,
    value: label,
  });

  const handleCreateTag = (inputValue: string) => {
    const newTag = createOption(inputValue);
    existingTags.push(newTag);
    setTaskData({
      ...taskData,
      tags: newTag,
    });
  };

  // Handle tag changes (select and create)
  const handleTagChange = (newTags: any) => {
    setTaskData({
      ...taskData,
      tags: newTags, // Set tags
    });
  };

  const handleTaskAssignedToChange = (newValue: any) => {
    setTaskData({
      ...taskData,
      taskAssignedto: newValue,
    });
  };

  const handleTaskSizeChange = (size: number) => {
    setTaskData({
      ...taskData,
      taskSize: size,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert tags from {label, value} to strings
      const taskWithFormattedTags = {
        ...taskData,
        tags: taskData.tags,
        taskAssignedto: taskData.taskAssignedto,
      };
      await axios.post(
        "http://localhost:5000/createTask",
        taskWithFormattedTags
      );

      setTaskData({
        id: 0,
        taskNumber: 0,
        taskName: "",
        taskPriority: "",
        taskStage: "",
        taskType: "",
        taskStatus: "",
        tags: { label: "", value: "" },
        description: "",
        taskSize: null,
        taskAssignedto: { label: "", value: "" },
        createdAt: new Date(),
        sprintStage: "Backlog",
        sprint: "",
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {/* Task Name */}
        <div className="form-row">
          <label>
            Task Name:
            <input
              type="text"
              name="taskName"
              value={taskData.taskName}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        {/* Task Priority */}
        <div className="form-row">
          <label>
            Task Priority:
            <input
              type="text"
              name="taskPriority"
              value={taskData.taskPriority}
              onChange={handleChange}
              required
            />
          </label>

          {/* Task Status */}
          <label>
            Task Status:
            <input
              type="text"
              name="taskStatus"
              value={taskData.taskStatus}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        {/* Project Stage and Tags */}
        <div className="form-row">
          <label>
            Project Stage:
            <input
              type="text"
              name="taskStage"
              value={taskData.taskStage}
              onChange={handleChange}
              required
            />
          </label>

          {/* Tags */}
          <label>
            Tags:
            <CreatableSelect
              isClearable
              onCreateOption={handleCreateTag}
              onChange={handleTagChange}
              options={existingTags}
              value={taskData.tags}
              placeholder="Select or create tags"
            />
          </label>
        </div>

        {/* Task Type and Assignees */}
        <div className="form-row">
          <label>
            Task Type:
            <input
              type="text"
              name="taskType"
              value={taskData.taskType}
              onChange={handleChange}
              required
            />
          </label>

          {/* Assignees */}
          <label>
            Assigned To:
            <Select
              isClearable
              onChange={handleTaskAssignedToChange}
              options={teamMembers} // Use dynamically fetched team members from the database
              value={taskData.taskAssignedto}
              placeholder="Select an assignee"
            />
          </label>
        </div>

        {/* Description */}
        <div className="form-row">
          <label>
            Story Points:
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        {/* Task Size */}
        <div className="form-row">
          <label>Task Size:</label>
          <div className="task-size-buttons">
            {[...Array(10)].map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleTaskSizeChange(index + 1)}
                className={taskData.taskSize === index + 1 ? "selected" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default TaskForm;