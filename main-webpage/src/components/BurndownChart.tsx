import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './BurndownChart.css';

interface sprintProps {
  sprint: {
    _id: string;
    sprintName: string;
    sprintStartDate: string;
    sprintEndDate: string;
    status: string;
    totalLoggedTime: number;
  };
}

interface Task {
  _id: string;
  taskName: string;
  taskSize: number; // Story points or task size
  completionDate: Date | null;
  sprint: string;
}

const BurndownChart: React.FC<sprintProps> = ({ sprint }) => {
  const [dateFrame, setDateFrame] = useState<string[]>([]); // Dates for x-axis
  const [idealSizeArray, setIdealSizeArray] = useState<number[]>([]); // Ideal burndown points
  const [remainingSizeArray, setRemainingSizeArray] = useState<number[]>([]); // Actual burndown points

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/readTask');
        const tasks: Task[] = response.data.filter((task: Task) => task.sprint === sprint._id);

        if (tasks.length > 0) {
          calculateBurndownChart(tasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [sprint._id]);

  // Calculate the burndown chart with both ideal and actual burndown lines
  const calculateBurndownChart = (tasks: Task[]) => {
    const startDate = new Date(sprint.sprintStartDate);
    const endDate = new Date(sprint.sprintEndDate);

    // 1. Total story points (task size)
    const totalStoryPoints = tasks.reduce((sum, task) => sum + task.taskSize, 0);

    // 2. Calculate the total days in the sprint
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // 3. Calculate the ideal decrement per day
    const idealDecrement = totalStoryPoints / totalDays;

    // 4. Set up arrays for the x-axis (dates), y-axis (ideal story points), and y-axis (actual remaining work)
    const newDateFrame: string[] = [];
    const newIdealSizeArray: number[] = [];
    const newRemainingSizeArray: number[] = [];

    let currentDate = new Date(startDate);
    let currentStoryPoints = totalStoryPoints;
    let remainingSize = totalStoryPoints; // Start with the full story points for actual burndown

    // 5. Loop through each day of the sprint
    for (let i = 0; i <= totalDays; i++) {
      newDateFrame.push(currentDate.toDateString()); // Add the date to the x-axis

      // Add the remaining story points to the y-axis (idealSizeArray)
      newIdealSizeArray.push(Math.max(currentStoryPoints, 0));

      // Filter tasks that have been completed by this date
      const completedTasks = tasks.filter(
        (task) => task.completionDate && new Date(task.completionDate) <= currentDate
      );

      // Decrease the remaining work based on completed tasks
      completedTasks.forEach((task) => {
        remainingSize -= task.taskSize;
      });

      // Add the remaining story points for the actual burndown
      newRemainingSizeArray.push(Math.max(remainingSize, 0));

      // Decrease the ideal burndown story points for the next day
      currentStoryPoints -= idealDecrement;

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Make sure the last point is 0 for both ideal and actual burndown
    newIdealSizeArray[newIdealSizeArray.length - 1] = 0;
    newRemainingSizeArray[newRemainingSizeArray.length - 1] = 0;

    // Set state
    setDateFrame(newDateFrame);
    setIdealSizeArray(newIdealSizeArray);
    setRemainingSizeArray(newRemainingSizeArray); // Actual burndown values
  };

  // Render the chart when data is available
  useEffect(() => {
    if (dateFrame.length > 0 && idealSizeArray.length > 0 && remainingSizeArray.length > 0) {
      const ctx = document.getElementById('burndownChart') as HTMLCanvasElement;
      if (!ctx) {
        console.error('Canvas element not found');
        return;
      }

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: dateFrame, // X-axis: Date Frame
          datasets: [
            {
              label: 'Actual Burndown',
              data: remainingSizeArray, // Y-axis: Actual remaining story points
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: false, // Disable fill below the line
            },
            {
              label: 'Ideal Burndown',
              data: idealSizeArray, // Y-axis: Ideal story points remaining each day
              borderColor: 'rgba(255, 99, 132, 1)',
              borderDash: [5, 5], // Dashed line for ideal burndown
              borderWidth: 2,
              fill: false, // Disable fill below the line
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Sprint Dates',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Remaining Story Points',
              },
            },
          },
        },
      });
    }
  }, [dateFrame, idealSizeArray, remainingSizeArray]);

  return (
    <div className="chart-container">
      <canvas id="burndownChart"></canvas>
    </div>
  );
};

export default BurndownChart;
