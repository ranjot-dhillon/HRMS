// src/components/Attendance/AttendanceSummary.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload, FaCalendarAlt } from "react-icons/fa";

export default function AttendanceSummary() {
  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
    percent: 0,
  });
  const [todayList, setTodayList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:3000/api/attendance/summary",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.success) {
        setSummary(res.data.summary || summary);
        setTodayList(res.data.todayList || []);
      }
    } catch (err) {
      console.error("attendance fetch error", err);
      // optionally set default values or show UI error state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    // optional: poll every N seconds
    // const iv = setInterval(fetchAttendance, 60_000);
    // return () => clearInterval(iv);
  }, []);

  const exportCsv = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/attendance/export/today",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    } catch (err) {
      console.error("export error", err);
      alert("Export failed.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
        <div className="bg-white p-3 rounded shadow">
          <p className="text-xs text-gray-500">Today Present</p>
          <h3 className="text-xl font-semibold">{summary.present}</h3>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <p className="text-xs text-gray-500">Today Absent</p>
          <h3 className="text-xl font-semibold">{summary.absent}</h3>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <p className="text-xs text-gray-500">Late</p>
          <h3 className="text-xl font-semibold">{summary.late}</h3>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <p className="text-xs text-gray-500">Monthly %</p>
          <h3 className="text-xl font-semibold">{summary.percent ?? 0}%</h3>
        </div>
      </div>

      <div className="bg-white p-3 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-md font-semibold">Today's Attendance</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded text-sm shadow"
            >
              <FaDownload /> Export CSV
            </button>
            <button
              onClick={() =>
                (window.location.href = "/admin-dashboard/attendance")
              }
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-sm"
            >
              <FaCalendarAlt /> Full Report
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-6 text-center text-gray-500">Loading…</div>
        ) : (
          <div className="overflow-auto max-h-48">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Emp ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2">Check-in</th>
                  <th className="p-2">Check-out</th>
                  <th className="p-2">Device</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No records for today
                    </td>
                  </tr>
                ) : (
                  todayList.map((r) => (
                    <tr key={r._id} className="border-b">
                      <td className="p-2">
                        {r.employee?.employeeId || r.employee}
                      </td>
                      <td className="p-2">{r.employee?.userId?.name || "—"}</td>
                      <td className="p-2">
                        {r.checkIn
                          ? new Date(r.checkIn).toLocaleTimeString()
                          : "—"}
                      </td>
                      <td className="p-2">
                        {r.checkOut
                          ? new Date(r.checkOut).toLocaleTimeString()
                          : "—"}
                      </td>
                      <td className="p-2">
                        {r.deviceInfo?.slice(0, 24) || "—"}
                      </td>
                      <td className="p-2">{r.status || "Present"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
