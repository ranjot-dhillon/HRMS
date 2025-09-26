import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/authContext";
// import { FaSignInAlt, FaSignOutAlt, FaClock } from "react-icons/fa";
import { FaUserCircle, FaBell, FaCalendarAlt } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import TaskReminder from "./TaskReminder";
import { EmployeeAttendence } from "./EmployeeAttendence";
import HrAssistant from "./HrAssistant";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmployeeSummary = () => {
  const [employee, setEmployee] = useState({});
  const [newQuery, setNewQuery] = useState("");

  const [attendance, setAttendance] = useState([]);
  const [hasClockedIn, setHasClockedIn] = useState(false);
  const [hasClockedOut, setHasClockedOut] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const timerRef = useRef(null);

  const [notices, setNotices] = useState([]);
  const { user } = useAuth();
  const Id = user._id;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [poll, setPoll] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
   const [selectedOptions, setSelectedOptions] = useState({}); 

  const [weeklyHoursData, setWeeklyHoursData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/notifications/${Id}`)
      .then((res) => setNotifications(res.data));
  }, [Id]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleOpen = () => {
    // Mark all as read
    axios
      .patch(`http://localhost:3000/api/notifications/${Id}/read-all`)
      .then((res) => setNotifications(res.data));
    // setNotifications(prev => prev.filter(n => !n.isRead));
  };

useEffect(() => {
  const fetchPoll = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/poll/latest");
      console.log("Polls", res.data); // ✅ now data is available
      setPoll(res.data);
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  };

  fetchPoll();
}, []);

  const submitVote = () => {
    if (!selectedOption) return;
    axios
      .post(`/api/polls/${poll._id}/vote`, { optionId: selectedOption })
      .then(() => setHasVoted(true));
  };

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const empRes = await axios.get("/api/employee/profile");
  //         const overviewRes = await axios.get("/api/employee/overview");
  //         const noticeRes = await axios.get("/api/notices");

  //         setEmployee(empRes.data);
  //         setOverview(overviewRes.data);
  //         setNotices(noticeRes.data);
  //       } catch (error) {
  //         console.error("Error fetching dashboard data:", error);
  //       }
  //     };

  //     fetchData();
  //   }, []);

  // Restore from localStorage
  useEffect(() => {
    const savedClockIn = localStorage.getItem("clockInTime");
    if (savedClockIn) {
      setHasClockedIn(true);
      setClockInTime(new Date(savedClockIn));
    }
  }, []);

  // Timer
  useEffect(() => {
    if (hasClockedIn && !hasClockedOut) {
      timerRef.current = setInterval(() => {
        if (clockInTime) {
          const diff = new Date() - new Date(clockInTime);
          const hrs = String(Math.floor(diff / 3600000)).padStart(2, "0");
          const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(
            2,
            "0"
          );
          const secs = String(Math.floor((diff % 60000) / 1000)).padStart(
            2,
            "0"
          );
          setElapsedTime(`${hrs}:${mins}:${secs}`);
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [hasClockedIn, hasClockedOut, clockInTime]);

  useEffect(() => {
    // fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const res = await axios.get(
      `http://localhost:3000/api/attendance/my-logs`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    setAttendance(res.data.logs);

    const today = new Date().toDateString();
    const todayLog = res.data.logs.find(
      (log) => new Date(log.date).toDateString() === today
    );
    if (todayLog) {
      setHasClockedIn(!!todayLog.clockIn);
      setHasClockedOut(!!todayLog.clockOut);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setStreaming(true);
    } catch (err) {
      setMessage("Camera access was denied or not available.");
      console.error(err);
    }
  };

  // Stop camera (call when done)
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  // Capture photo and send to server
  const captureAndSend = async () => {
    if (!streaming) return setMessage("Camera not started.");
    setLoading(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // get base64
    const imageBase64 = canvas.toDataURL("image/jpeg", 0.9); // "data:image/jpeg;base64,..."
    console.log(imageBase64.length);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/api/attendance/clock-in",
        { imageBase64: imageBase64, Id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage(
          `Clock-in success. AI-verified: ${
            res.data.ai?.verified ? "Yes" : "No"
          }`
        );
        setElapsedTime("00:00:00");
        timerRef.current = setInterval(() => {
          const diff = new Date() - now;
          const hrs = String(Math.floor(diff / 3600000)).padStart(2, "0");
          const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(
            2,
            "0"
          );
          const secs = String(Math.floor((diff % 60000) / 1000)).padStart(
            2,
            "0"
          );
          setElapsedTime(`${hrs}:${mins}:${secs}`);
        }, 1000);
      } else {
        setMessage(res.data.message || "Clock-in response received.");
      }
    } catch (err) {
      setMessage(err?.response?.data?.message || "Clock-in failed.");
      console.error(err);
    } finally {
      setLoading(false);
      stopCamera();
    }
  };

  // fetchLogs();

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now);
    localStorage.setItem("clockInTime", now);
    setHasClockedIn(true);
  };

  const handleClockOut = async () => {
    try {
      const now = new Date();
      const diffMs = now - new Date(clockInTime); // ms difference
      const workedSeconds = Math.floor(diffMs / 1000); // total seconds worked

      // Format for UI if needed
      const hrs = String(Math.floor(workedSeconds / 3600)).padStart(2, "0");
      const mins = String(Math.floor((workedSeconds % 3600) / 60)).padStart(
        2,
        "0"
      );
      const secs = String(workedSeconds % 60).padStart(2, "0");
      const workedTimeFormatted = `${hrs}:${mins}:${secs}`;

      // Send worked time to backend
      await axios.post(
        `http://localhost:3000/api/attendance/clock-out`,
        {
          Id,
          hrs, // backend can convert to hrs/min if needed
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setElapsedTime(formatTime(workedSeconds));
      setHasClockedOut(true);
      clearInterval(timerRef.current);
      localStorage.removeItem("clockInTime");

      console.log(`Worked Time: ${workedTimeFormatted}`);
    } catch (error) {
      console.error("Clock-out failed", error);
    }
  };
  function formatTime(totalSeconds) {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  }

  const hasAlerted = useRef(false);

  useEffect(() => {
    const fetchQueries = async () => {
      // console.log(user._id)
      // if (hasAlerted.current) return; // ✅ Prevent multiple alerts
      // hasAlerted.current = true;
      const res = await axios.get(
        `http://localhost:3000/api/query/resolvedQuery/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      console.log("fetch query", res.data.resolvedQueries[0]);
      const latestQuery = res.data.resolvedQueries[0];
      // const latestQuery = (res.data.resolvedQueries)[0];

      // if (!queries || queries.length === 0) return;

      // ✅ Sort queries by createdAt in descending order
      // const latestQuery =  queries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      if (latestQuery) {
        if (latestQuery.status === "Resolved") {
          alert(
            `✅ Your latest query has been resolved:\nMessage: ${latestQuery.message}`
          );
          setNewQuery(latestQuery);
        }
      }
    };
    fetchQueries();
  }, [user._id]);

  const deleteQuery = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/query/deleteQuery/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      if (response.data.success) {
        setNewQuery(null);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/attendance/weeklyData/${Id}`
        );
        console.log("attRes", res);
        setWeeklyHoursData(res.data);
      } catch (err) {
        console.error(err);
        // fallback default
        alert("eroor missing attendece data");
        setWeeklyHoursData({
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          datasets: [
            {
              label: "Hours Worked",
              data: [0, 0, 0, 0, 0],
              backgroundColor: "rgba(99, 102, 241, 0.6)",
              borderRadius: 10,
            },
          ],
        });
      }
    }
    fetchData();
  }, [Id]);

   const handleOptionChange = (pollId, optionId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [pollId]: optionId,
    }));
  };


   const handleSubmit = (pollId) => {
    if (!selectedOptions[pollId]) {
      alert("Please select an option before submitting!");
      return;
    }
    console.log("Submitting vote:", pollId, selectedOptions[pollId]);

    // Example API call
    axios.put(`http://localhost:3000/api/admin/submitPoll/${pollId}`, {
      optionId: selectedOptions[pollId],
    })
    .then(() => alert("Vote submitted successfully"))
    .catch((err) => console.error("Error submitting vote:", err));
  };


  return (
    <>
      <div className="fixed bg-[#f4f5f7] p-6 r-0 bottom-0 right-0 left-64 top-16 text-gray-800">

        {/* Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Profile Card */}
          <EmployeeAttendence />

          {/* Attendance & Holidays */}
          <div className="col-span-6 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2">
                Attendance Overview
              </h3>
            
              <Bar data={weeklyHoursData} />
            </div>
            {/* <div className="bg-white p-6 rounded-2xl shadow-lg"> */}
            <TaskReminder />
            {/* </div> */}
          </div>

          {/* Notifications + Poll */}
          <div className="col-span-3 flex flex-col gap-6">
            {/* Notifications */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Notifications</h3>
              <ul>
                {notifications.length > 0 && (
                  <button
                    onClick={() => handleOpen()}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <li
                      key={n._id}
                      className={
                        n.isRead ? "text-gray-500" : "text-black font-medium"
                      }
                    >
                      {n.title} — {n.message}
                    </li>
                  ))
                ) : (
                  <li>No new notifications</li>
                )}
              </ul>
            </div>

            {/* Poll Section */}
      <div className="bg-white p-6 rounded shadow-md">
  <h2 className="text-xl font-bold mb-4">Active Polls</h2>

  {/* Scrollable container */}
  <div className="max-h-[400px] overflow-y-auto pr-2">
    {poll && poll.length > 0 ? (
      poll.map((polls) => (
        <div key={polls._id} className="border p-4 mt-4 rounded">
          <h3 className="font-semibold">{polls.question}</h3>

          <div className="mt-2">
            {polls.options && polls.options.length > 0 ? (
              polls.options.map((opt) => (
                <label
                  key={opt._id}
                  className="flex items-center space-x-2 mb-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`poll-${polls._id}`}
                    value={opt._id}
                    // checked={selectedOptions[polls._id] === opt._id}
                    onChange={() => handleOptionChange(polls._id, opt._id)}
                  />
                  <span>{opt.text}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No options available</p>
            )}
          </div>

          <button
            onClick={() => handleSubmit(polls._id)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-3"
          >
            Submit
          </button>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No polls available</p>
    )}
  </div>
</div>
    </div>
          </div>
          
        </div>
      <HrAssistant/>
    </>
  );
};

export default EmployeeSummary;
