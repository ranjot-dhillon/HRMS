import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import CreatePoll from "./CreatePoll";
import { motion } from "framer-motion";

export default function AdminCommunity() {
  const [polls, setPolls] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [Birthdays,setBirthdays]=useState("")
  const [events,setEvents]=useState([])
  const [monthEvents, setMonthEvents] = useState([]);


  useEffect(() => {
    axios.get("http://localhost:3000/api/admin/poll/latest").then(res => setPolls(res.data));
    axios.get("http://localhost:3000/api/admin/getAnnouncements").then(res => setAnnouncements(res.data));
     axios.get("http://localhost:3000/api/admin/counts").then((res) => {
      setBirthdays(res.data.formatted);
      console.log("Birthdays",Birthdays)
    });
     axios.get("http://localhost:3000/api/admin/holidays").then((res) => {
      if (res.data.success) {
        const formatted = res.data.holidays.map((h) => ({
          title: h.name,
          start: new Date(h.date),
          end: new Date(h.date),
          allDay: true,
        }));
        setEvents(formatted);
        console.log(events)
      
      }
    });
  }, []);
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const filtered = events.filter(
      (e) => new Date(e.start).getMonth() === currentMonth
    );
    setMonthEvents(filtered);
    console.log("Event",monthEvents)
  }, [events]); 
  

  const postAnnouncement = async () => {
    if (!newAnnouncement) return;
    const res = await axios.post("http://localhost:3000/api/admin/postAnnouncements", { text: newAnnouncement });
    setAnnouncements([res.data, ...announcements]);
    setNewAnnouncement("");
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6 bg-[#f4f5f7] min-h-screen">
      <h1 className="text-3xl text-center font-extrabold mb-10 text-gray-800">🌐 Admin Community</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 🔹 Announcements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white col-span-2 p-5 rounded-2xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">📢 Announcements</h2>
          <textarea
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            placeholder="Write an announcement..."
            className="border p-3 w-full rounded-lg mb-3"
          />
          <Button onClick={postAnnouncement} className="bg-blue-600 hover:bg-blue-700 text-white">
            Post Announcement
          </Button>

          {/* <div className="mt-4 max-h-60 overflow-y-auto space-y-3">
            {announcements.map((a, i) => (
              <div key={i} className="border p-3 rounded-lg bg-gray-50">
                <p className="text-gray-800">{a.text}</p>
                <span className="text-xs text-gray-500 block mt-1">
                  📅 {new Date(a.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div> */}
        </motion.div>

        {/* 🔹 Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-4">📊 Quick Stats</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Active Polls: <b>{polls.length}</b></li>
            <li>📢 Announcements: <b>{announcements.length}</b></li>
             {/* <li>👥 Engagement Rate: <b>78%</b></li> */}
            <li>🎂 Birthdays This Week: <b>{Birthdays.length}</b></li> 
          </ul>
        </motion.div>
      </div>

      {/* 🔹 Poll Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white mt-8 p-5 rounded-2xl w-195 shadow hover:shadow-lg transition"
      >
        <h2 className="text-xl font-semibold mb-3">🗳️ Polls</h2>
        <CreatePoll />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {polls.map((poll) => (
            <div key={poll._id} className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-bold text-gray-800">{poll.question}</h3>
              <PieChart width={280} height={220}>
                <Pie
                  data={poll.options}
                  dataKey="votes"
                  nameKey="text"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {poll.options.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 🔹 Upcoming Events */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white mt-8 p-5 rounded-2xl shadow hover:shadow-lg transition"
      >
        <h2 className="text-xl font-semibold mb-3">📅 Upcoming Events</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          {/* <li>🎉 Team Building Event - 25th Aug</li> */}
          <li>📅 Holidays -<span><ul>
  {monthEvents.map((event, idx) => (
    <li key={idx}>
      {event.title} – {new Date(event.start).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}
    </li>
  ))}
</ul>
</span></li>
          <li>🎂 Employee Birthdays this Month:<span><ul>
{(Birthdays || []).map((emp, index) => (
  <li key={index}>
    <span>{emp.name}</span> - <span>{emp.date}</span>
  </li>
))}

</ul></span></li>
        </ul>
      </motion.div>
    </div>
  );
}
