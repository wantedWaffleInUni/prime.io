import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import axios from "axios";
import SprintColumn from "./SprintColumn";
import "./SprintKanban.css"; // Add custom CSS for the popup
import BurndownChart from "./BurndownChart";

interface SprintKanbanProps {
  sprint: {
    _id: string;
    sprintName: string;
    sprintStartDate: string;
    sprintEndDate: string;
    status: string;
    totalLoggedTime: number;
  };
}

const SprintKanban: React.FC<SprintKanbanProps> = ({ sprint }) => {
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
    completionDate: Date;
  }

  interface TeamMember {
    _id: string;
    username: string;
    password: string;
    totalTimeLogged: number;
    securityQuestionID: string;
    securityAns: string;
    userStatus: string;
  }

  const [sprintStatus, setSprintStatus] = useState<string>("Not Started");
  const [Done, setDone] = useState<Task[]>([]);
  const [notStarted, setNotStarted] = useState<Task[]>([]);
  const [backlog, setBacklog] = useState<Task[]>([]);
  const [inProgress, setInProgress] = useState<Task[]>([]);

  // New state to manage the team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | null>(
    null
  );

  // State to manage the visibility of the Log Time form
  const [isLogTimePopupVisible, setLogTimePopupVisible] = useState(false);
  const [loggedHours, setLoggedHours] = useState<number>(0);
  const [loggedMinutes, setLoggedMinutes] = useState<number>(0);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  // Calculate the sprint status based on current date, start, and end date
  useEffect(() => {
    const calculateSprintStatus = () => {
      const currentDate = new Date();
      const startDate = new Date(sprint.sprintStartDate);
      const endDate = new Date(sprint.sprintEndDate);

      if (currentDate < startDate) {
        return "Not Started";
      } else if (currentDate >= startDate && currentDate <= endDate) {
        return "Active";
      } else {
        return "Completed";
      }
    };

    const status = calculateSprintStatus();
    setSprintStatus(status); // Update sprint status dynamically
  }, [sprint.sprintStartDate, sprint.sprintEndDate]);

  // Fetch tasks and team members
  useEffect(() => {
    const fetchTasksAndMembers = async () => {
      try {
        // Fetch tasks
        const taskResponse = await axios.get("http://localhost:5000/readTask"); // Adjust the URL based on your backend route
        const memberResponse = await axios.get("http://localhost:5000/readUser"); // Adjust the URL to fetch team members
        const tasks = taskResponse.data.map((task: any) => ({
          ...task,
        }));
        setBacklog(
          tasks.filter(
            (task: { sprintStage: string; sprint: string }) =>
              task.sprintStage === "Backlog" && task.sprint === ""
          )
        );
        setInProgress(
          tasks.filter(
            (task: { sprintStage: string; sprint: string }) =>
              task.sprintStage === "In Progress" && task.sprint === sprint._id
          )
        );
        setDone(
          tasks.filter(
            (task: { sprintStage: string; sprint: string }) =>
              task.sprintStage === "Done" && task.sprint === sprint._id
          )
        );
        setNotStarted(
          tasks.filter(
            (task: { sprintStage: string; sprint: string }) =>
              task.sprintStage === "Not Started" && task.sprint === sprint._id
          )
        );

        // Fetch team members
        const users = memberResponse.data.map((user: any) => ({
          ...user,
          _id : user._id,
          username : user.username
        }));
        setTeamMembers(users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTasksAndMembers();
  }, [sprint._id]);

  const handleDragEnd = (result: {
    destination: any;
    source: any;
    draggableId: string;
  }) => {
    if (sprintStatus === "Completed") return;
    const { destination, source, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    deletePreviousState(source.droppableId, draggableId);

    const task = findItemById(draggableId, [
      ...notStarted,
      ...Done,
      ...inProgress,
      ...backlog,
    ]);

    setNewState(destination.droppableId, task);
  };

  function deletePreviousState(sourceDroppableId: string, taskId: string) {
    switch (sourceDroppableId) {
      case "1":
        setNotStarted(removeItemById(taskId, notStarted));
        break;
      case "2":
        setDone(removeItemById(taskId, Done));
        break;
      case "3":
        setInProgress(removeItemById(taskId, inProgress));
        break;
      case "4":
        setBacklog(removeItemById(taskId, backlog));
        break;
    }
  }

  async function setNewState(destinationDroppableId: string, task: any) {
    let updatedTask;
    switch (destinationDroppableId) {
      case "1": // TO DO
        updatedTask = {
          ...task,
          sprintStage: "Not Started",
          sprint: sprint._id,
        };
        console.log(sprint._id); 
        setNotStarted([updatedTask, ...notStarted]);
        axios.put(
          "http://localhost:5000/update/${updatedTask.id}",
          updatedTask
        );
        break;
      case "2": // DONE
        updatedTask = {
          ...task,
          sprintStage: "Done",
          sprint: sprint._id,
          completionDate: new Date(),
        };
        setDone([updatedTask, ...Done]);
        axios.put(
          "http://localhost:5000/update/${updatedTask.id}",
          updatedTask
        );
        break;
      case "3": // IN PROGRESS
        updatedTask = {
          ...task,
          sprintStage: "In Progress",
          sprint: sprint._id,
        };
        setInProgress([updatedTask, ...inProgress]);
        axios.put(
          "http://localhost:5000/update/${updatedTask.id}",
          updatedTask
        );
        break;
      case "4": // BACKLOG
        updatedTask = { ...task, sprintStage: "Backlog", sprint: "" };
        setBacklog([updatedTask, ...backlog]);
        axios.put(
          "http://localhost:5000/update/${updatedTask.id}",
          updatedTask
        );
        break;
    }
  }

  function findItemById(id: string, array: Task[]) {
    return array.find((item) => item.taskNumber.toString() === id);
  }

  function removeItemById(id: string, array: Task[]) {
    return array.filter((item) => item.taskNumber.toString() !== id);
  }

  const handleForceEndSprint = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/forceEndSprint/${sprint._id}`
      );

      // Log and update the sprint status in the frontend
      console.log("Sprint ended:", response.data);
      setSprintStatus("Completed"); // Update the state in the frontend
      alert("Sprint ended successfully!");
    } catch (error) {
      console.error("Error ending sprint:", error);
      alert("Failed to end sprint. Please try again.");
    }
  };

  // Log time function to open the popup
  const openLogTimePopup = () => {
    setLogTimePopupVisible(true); // Show the popup
  };

  const closeLogTimePopup = () => {
    setLogTimePopupVisible(false); // Hide the popup
  };

  const handleLogTimeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      selectedTask &&
      (loggedHours > 0 || loggedMinutes > 0) &&
      selectedTeamMember
    ) {
      const loggedTime = loggedHours + loggedMinutes / 60;
      try {
        console.log(sprint._id); // Debugging

        await axios.post(`http://localhost:5000/logTime`, {
          sprintId: sprint._id,
          taskId: selectedTask,
          userId: selectedTeamMember,
          hours: loggedTime,
        });

        await axios.put(`http://localhost:5000/updateSprintTime/${sprint._id}`, {
          hours: loggedTime,
        });

        await axios.put(`http://localhost:5000/updateUserTime/${selectedTeamMember}`, {
          hours: loggedTime,
        });

        await axios.put(`http://localhost:5000/updateTaskTime/${selectedTask}`, {
          hours: loggedTime,
        });

        alert("Time logged successfully!");
      } catch (error) {
        console.error("Error logging time:", error);
      }
      setLoggedHours(0);
      setLoggedMinutes(0);
      setSelectedTask(null);
      setSelectedTeamMember(null);
      closeLogTimePopup(); // Close the popup
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Render the Sprint Kanban board
  return (
    <div className="sprint-kanban-page">
      <div className="kanban-board">
        <h2>Sprint Status: {sprintStatus}</h2>
        {sprintStatus === "Active" && (
          <>
            <button onClick={openLogTimePopup} className="log-time-button">
              Log Time
            </button>
            <button onClick={handleForceEndSprint} className="force-end-button">
              Force End Sprint
            </button>
          </>
        )}

        {/* Log Time Form Popup */}
        {isLogTimePopupVisible && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Log Time</h3>
              <form onSubmit={handleLogTimeSubmit}>
                <div>
                  {/* hours and minutes logged  */}
                  <label>
                    Hours Logged:
                    <input
                      type="number"
                      value={loggedHours}
                      onChange={(e) => setLoggedHours(Number(e.target.value))}
                      min="0"
                      required
                    />
                  </label>
                  <label>
                    Minutes Logged:
                    <input
                      type="number"
                      value={loggedMinutes}
                      onChange={(e) => setLoggedMinutes(Number(e.target.value))}
                      min="0"
                      required
                    />
                  </label>
                </div>

                <label>
                  Select Task:
                  <select
                    value={selectedTask ?? ""}
                    onChange={(e) => setSelectedTask(e.target.value)}
                    required
                  >
                    <option value="">-- Select a task --</option>
                    {inProgress.map((task) => (
                      <option key={task._id} value={task._id}>
                        {task.taskName}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Select Team Member:
                  <select
                    value={selectedTeamMember ?? ""}
                    onChange={(e) => setSelectedTeamMember(e.target.value)}
                    required
                  >
                    <option value="">-- Select a team member --</option>
                    {teamMembers.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.username}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="modal-actions">
                  <button type="submit" className="submit-log-time">
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={closeLogTimePopup}
                    className="cancel-log-time"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Conditional rendering of columns based on sprint status */}
        <DragDropContext onDragEnd={handleDragEnd}>
          {sprintStatus === "Not Started" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                width: "800px",
                margin: "0 auto",
              }}
            >
              {/* Only Sprint Backlog and Product Backlog columns */}
              <SprintColumn
                title={"SPRINT BACKLOG"}
                tasks={notStarted}
                id={"1"}
              />
              <SprintColumn title={"PRODUCT BACKLOG"} tasks={backlog} id={"4"} />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                width: "1300px",
                margin: "0 auto",
              }}
            >
              {/* Existing columns */}
              <SprintColumn title={"NOT STARTED"} tasks={notStarted} id={"1"} />
              <SprintColumn title={"IN PROGRESS"} tasks={inProgress} id={"3"} />
              <SprintColumn title={"DONE"} tasks={Done} id={"2"} />
            </div>
          )}
        </DragDropContext>
      </div>

      {/* Burndown Chart section */}
      <div className="sprint-burndown">
        <h1>Burndown chart for sprint: {sprint.sprintName}</h1>
        <BurndownChart sprint={sprint} />
      </div>

    </div>
  );
};
export default SprintKanban;
