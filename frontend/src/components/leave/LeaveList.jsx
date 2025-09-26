import React, { useState, useEffect } from "react";
import LeaveHistory from "./LeaveHistory";
import { Link } from "react-router-dom";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaCalendarAlt } from "react-icons/fa";

const localizer = momentLocalizer(moment);

function LeaveList() {
  const [events, setEvents] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/api/admin/holidays").then((res) => {
      if (res.data.success) {
        const formatted = res.data.holidays.map((h) => ({
          title: h.name,
          start: new Date(h.date),
          end: new Date(h.date),
          allDay: true,
        }));
        setEvents(formatted);
      }
    });
  }, []);

  return (

 <div className="bg-white rounded shadow p-5 m-8">
      <h3 className=" text-3xl  text-center font-semibold mb-2">My Leaves</h3>

     <div className="flex justify-between items-center">
        {/* Right side: Apply button + Calendar icon */}
        <p></p>
        <div className="flex items-center gap-2">
           {/* Calendar Icon */}
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          >
            <FaCalendarAlt size={20} />
          </button>
          <Link
            to="/employee-dashboard/add-leave"
            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Apply for Leave
          </Link>

        </div>
      </div>

      {/* Small Inline Calendar */}
      {showCalendar && (
        <div className="fixed z=[9999] mt-4 border rounded-lg mr-10 ml-120 shadow p-2 bg-white">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 350 }}   
            views={["month"]}
          />
        </div>
      )}

      <div className="py-5">
        <LeaveHistory />
      </div>
    </div>
  );
}

export default LeaveList;

