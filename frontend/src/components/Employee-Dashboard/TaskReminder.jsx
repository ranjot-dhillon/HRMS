import React from "react";
import { useState, useEffect } from "react";
import { FaTasks } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { useAuth } from "../../../context/authContext";
import { FaCheck, FaTrash } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TaskReminder = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    startDate: "",
    deadline: "",
  });
  const [taskReminder, setTaskReminder] = useState(false);
  const {user} = useAuth();
  const Id = user._id;

  useEffect(() => {
    getTask();
  }, []);

  const getTask = async () => {
    console.log("Id",Id)
    await axios
      .get("http://localhost:3000/api/task", {Id,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")} `,
        },
      })
      .then((res) => {
        const pendingTask = res.data.tasks.filter(
          (task) => task.status !== "completed"
        );
        setTasks(pendingTask);
      });
  };
  const addTask = async () => {
    if (!newTask.name || !newTask.startDate || !newTask.deadline) return;
    const res = await axios.post(
      "http://localhost:3000/api/task",
      { newTask, Id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")} `,
        },
      }
    );
    // setTasks([...tasks, res.data.tasks]);
    getTask();
    setNewTask({ name: "", startDate: "", deadline: "" });
  };

  const daysLeft = (deadline) => {
    const diff = new Date(deadline) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Delete Task
  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;
    await axios.delete(`http://localhost:3000/api/task/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")} `,
      },
    });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  // Complete Task
  const completeTask = async (id) => {
    const res = await axios.put(`http://localhost:3000/api/task/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")} `,
      },
    });
    setTasks(tasks.map((task) => (task._id === id ? res.data.task : task)));
  };

  // const chartData = {
  //   labels: tasks.map(t => t.name),
  //   datasets: [
  //     {
  //       label: "Days Remaining",
  //       data: tasks.map(t => daysLeft(t.deadline)),
  //       borderColor: "#4f46e5",
  //       backgroundColor: "rgba(79, 70, 229, 0.2)",
  //       fill: true
  //     }
  //   ]
  // };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaTasks className="text-indigo-500" /> Tasks & Reminders
        </h3>
        {tasks.length === 0 ? (
          <>
          <p className="text-gray-500">No tasks found.</p>
          <button
              onClick={() => setTaskReminder(true)}
              className="bg-green-500 text-white px-2  rounded hover:bg-green-600"
            >
              Add Reminder
            </button>
            </>
        ) : (
          <>
            <ul className="text-gray-600 space-y-2 mb-6  max-h-20 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {tasks.map((task) => (
                <li key={task._id} className="flex justify-between">
                  <span className="font-bold">
                    {task.name} ({new Date(task.startDate).toLocaleDateString()}{" "}
                    → {new Date(task.deadline).toLocaleDateString()})
                  </span>
                  <span
                    className={
                      daysLeft(task.deadline) <= 3 ? "text-red-500" : ""
                    }
                  >
                    {daysLeft(task.deadline)} days left
                  </span>
                  <div className="flex gap-4">
                    <button
                      onClick={() => completeTask(task._id)}
                      title="Mark Complete"
                    >
                      <FaCheck color="green" />
                    </button>
                    <button
                      className="m-0"
                      onClick={() => deleteTask(task._id)}
                      title="Delete Task"
                    >
                      <FaTrash color="red" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setTaskReminder(true)}
              className="bg-green-500 text-white px-2  rounded hover:bg-green-600"
            >
              Add Reminder
            </button>

            {/* <Line data={chartData} /> */}
          </>
        )}
        {taskReminder && (
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  bg-white border border-gray-300 shadow-lg rounded-lg p-6 w-90 z-50"
          >
            <div className="font-semibold text-green-600 text-lg text-center">
              ✅ Add Task
            </div>
            <div className="mb-4 grid gap-2 p-2">
              <input
                type="text"
                placeholder="Task Name"
                className="border p-2 rounded "
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
              />
              from
              <input
                type="date"
                className="border p-2 rounded"
                value={newTask.startDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, startDate: e.target.value })
                }
              />
              deadline
              <input
                type="date"
                className="border p-2 rounded"
                value={newTask.deadline}
                onChange={(e) =>
                  setNewTask({ ...newTask, deadline: e.target.value })
                }
              />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => {
                  addTask(), setTaskReminder(false);
                }}
              >
                Submit
              </button>
              <button
                className="text-sm bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
                onClick={() => setTaskReminder(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TaskReminder;
