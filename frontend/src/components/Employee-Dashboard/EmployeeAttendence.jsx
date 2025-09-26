import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/authContext";
// import { FaSignInAlt, FaSignOutAlt, FaClock } from "react-icons/fa";
import { FaUserCircle, FaBell, FaCalendarAlt } from "react-icons/fa";
export const EmployeeAttendence = () => {
  const [attendance, setAttendance] = useState([]);
  const [clockIn, setClockIn] = useState(false);
  const [hasClockedIn, setHasClockedIn] = useState(false);
  const [hasClockedOut, setHasClockedOut] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const Id = user._id;

  useEffect(() => {
    const savedClockIn = localStorage.getItem("clockInTime");
    if (savedClockIn) {
      const parsedTime = new Date(savedClockIn);
      setHasClockedIn(true);
      setClockInTime(parsedTime);
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

  //   const handleClockIn = () => {
  //     const now = new Date();
  //     setClockInTime(now);
  //     localStorage.setItem("clockInTime", now);
  //     setHasClockedIn(true);
  //   };

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
      console.log(res.data.aiResponse.success);
      if (res.data.aiResponse.success) {
        setMessage(
          `Clock-in success. AI-verified: ${
            res.data.ai?.verified ? "Yes" : "No"
          }`
        );
        setElapsedTime("00:00:00");
        const now = new Date();
        localStorage.setItem("clockInTime", now.toISOString()); // ✅ consistent format
        setClockInTime(now);
        setHasClockedIn(true);
        setHasClockedOut(false); // just in case
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

  const handleClockOut = async () => {
    const confirmDelete = window.confirm("Are you sure you want to Check-Out?");
    if (!confirmDelete) return;
    try {
      const now = new Date();
      const diffMs = now - new Date(clockInTime); // ms difference
      const workedSeconds = Math.floor(diffMs / 1000); // total seconds worked

      // Format for UI if needed
      const hrs = Math.floor(workedSeconds / 3600);
      const mins = Math.floor((workedSeconds % 3600) / 60);
      const secs = workedSeconds % 60;

      const workedTimeFormatted = `${String(hrs).padStart(2, "0")}:${String(
        mins
      ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

      // Send numeric hours to backend
      await axios.post(
        `http://localhost:3000/api/attendance/clock-out`,
        {
          Id,
          totalHours: hrs, // number, no padStart here
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
      alert("already Check-out");
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

  return (
    <>
      <div className="col-span-3 bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
        {/* <FaUserCircle className="text-7xl text-gray-500 mb-4" /> */}
          <div className="w-40 h-40 rounded-full overflow-hidden shadow-md border-4 border-purple-300">
              <img
                src={
                  `${user.profileImage}` ||
                  "/default-profile.png"
                }
                className="w-full h-full object-cover"
              />
            </div>
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.role}</p>
        <div className="mt-4 flex flex-col gap-2 w-full">
          <button
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 font-semibold"
            onClick={() => setClockIn(true)}
          >
            Clock In
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg py-2 font-semibold"
            onClick={handleClockOut}
          >
            Clock Out
          </button>
          <div className="mt-2 text-gray-700">
            {!hasClockedOut && (
              <p className="text-lg font-bold">
                🕒 Working Time: {elapsedTime}
              </p>
            )}
            {hasClockedOut && (
              <p className="text-lg font-bold text-green-600">
                ✅ Shift Complete
              </p>
            )}
          </div>
        </div>
      </div>
      {clockIn && (
        <div className=" fixed p-4 top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 z-50 bg-purple-300 rounded shadow">
          <h3 className="text-lg font-semibold mb-3">Clock In</h3>
          {message && (
            <div className="mb-3 text-sm text-gray-700">{message}</div>
          )}
          <div className="mb-3"></div>

          <div className="flex gap-4 items-start">
            <div>
              <video
                ref={videoRef}
                className="w-100 h-56 bg-black"
                autoPlay
                muted
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>

            <div className="grid gap-2">
              {!streaming ? (
                <button
                  onClick={startCamera}
                  className="px-4 py-2 w-50 bg-purple-600 text-white rounded"
                >
                  Start Camera
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 w-50 bg-gray-300 text-black rounded"
                >
                  Stop Camera
                </button>
              )}
              <button
                onClick={captureAndSend}
                // disabled={!streaming || loading}
                className="px-4 py-2 w-50 bg-green-600 text-white rounded disabled:opacity-50"
              >
                {/* {loading ? "Processing..." : "Capture & Clock In"} */}
                Mark Attendance
              </button>
              <button
                onClick={() => setClockIn(false)}
                className="px-4 py-2 w-50 bg-red-500 text-white rounded"
              >
                Close
              </button>
              <div className="text-sm text-gray-500">
                After capture we'll <br />
                send the image for verification.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
