import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Users,
  UserCheck,
  CalendarX,
  ClipboardList,
  Gift,
  PieChart as PieIcon,
  CalendarDays,
  BarChart2,
  Megaphone,
  Wallet,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

// ---------- Utility Components ----------
function StatCard({ icon: Icon, label, value, sublabel, className = "" }) {
  return (
    <Card className={`rounded-2xl shadow-sm ${className}`}>
      <CardContent className="p-5 flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold leading-tight">{value}</p>
          {sublabel && (
            <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Section({ title, right, children }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {right}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ---------- Main Component ----------
export default function AdminDashboard() {
  const [checkedIn, setcheckedIn] = useState("0");
  const [notCheckedIn, setnotCheckedIn] = useState("0");
  const [leaveRequest, setLeaveRequest] = useState("0");
  const [query, setquery] = useState("0");
  const [birthdays, setBirthdays] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeaveToday: 0,
    payrollPaidPct: 0,
  });
  const [announcements, setAnnouncements] = useState([]);
  const [polls, setPolls] = useState([]);
  const [events, setEvents] = useState([]);
  const [deptData,setDeptData]=useState([{}])

  const navigate = useNavigate();

  useEffect(() => {
  const fetchPoll = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/poll/latest");
      console.log("Polls", res.data); // ✅ now data is available
      setPolls(res.data);
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  };

  fetchPoll();
}, []);

const handleDeletePoll=async(pollId)=>{
 const res=await axios.delete(`http://localhost:3000/api/admin/deletePoll/${pollId}`)
 setPolls(res.data)

}

  // Fetch Stats
  useEffect(() => {
    axios.get("http://localhost:3000/api/admin/stats").then((res) => {
      setStats(res.data);
    });
    axios.get("http://localhost:3000/api/admin/counts").then((res) => {
      setcheckedIn(res.data.checkedIn);
      setnotCheckedIn(res.data.notCheckedIn);
      setLeaveRequest(res.data.leaveRequest);
      setquery(res.data.query);
      setBirthdays(res.data.formatted);
      setAttendance(res.data.result);
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
      }
    });
    axios.get("http://localhost:3000/api/admin/getAnnouncements").then((res) =>
      setAnnouncements(res.data.slice(0, 3)) // latest 3 
    );
    axios.get("http://localhost:3000/api/attendance/depAttendance").then((res) =>
      setDeptData(res.data) // latest poll
    );
  }, []);

  

  // Dummy dept-wise attendance

  const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="fixed bg-[#f4f5f7] p-6 r-0 right-0 left-64 bottom-0 top-16 text-gray-800 overflow-y-auto">
      <main className="max-w-7xl mx-auto px-5 py-6 space-y-6">
        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard icon={Users} label="Total Employees" value={stats.totalEmployees} />
          <StatCard icon={UserCheck} label="Present Today" value={stats.presentToday} />
          <StatCard icon={CalendarX} label="On Leave Today" value={stats.onLeaveToday} />
          <StatCard
            icon={Wallet}
            label="Payroll Paid"
            value={`${stats.payrollPaidPct}%`}
            sublabel="This Month"
          />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Attendance Trend + Dept Pie */}
          <div className="lg:col-span-2 space-y-5">
            <Section title="Attendance Trend (7 days)">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendance}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ opacity: 0.2 }} />
                    <Line
                      type="monotone"
                      dataKey="present"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Section>

            <Section title="Department-wise Attendance">
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie data={deptData} dataKey="value" outerRadius={100} label>
        {deptData.map((entry, index) => {
          const hue = (index * 60) % 360; // 6 unique colors before repeating
          return <Cell key={`cell-${index}`} fill={`hsl(${hue},70%,50%)`} />;
        })}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</Section>

          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            <Section title="Pending Approvals" right={<ClipboardList className="h-4 w-4" />}>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span>Leave Requests</span>
                  <span className="font-medium">{leaveRequest}</span>
                </li>
                <li className="flex justify-between">
                  <span>Salary Queries</span>
                  <span className="font-medium">{query}</span>
                </li>
              </ul>
              <Button variant="outline" onClick={() => navigate('/admin-dashboard/leaves')} className="mt-3 w-full rounded-xl">
                View All
              </Button>
            </Section>

            <Section title="Announcements" right={<Megaphone className="h-4 w-4" />}>
              <ul className="space-y-2 text-sm">
                {announcements.map((a, i) => (
                  <li key={i} className="border-b pb-2">
                    <p className="font-medium">{a.message}</p>
                    <span className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Latest Poll" right={<BarChart2 className="h-4 w-4 text-red-300" />}>
              {polls.length > 0 ? (
                <div>
                  <div className="flex justify-between">
                  <p className="font-medium text-blue-300">{polls[0].question}</p><span><button onClick={()=>handleDeletePoll(polls[0]._id)} className="text-red-500">remove</button></span>
                  </div>
                  <ul className="text-sm mt-2">
                    {polls[0].options.map((opt, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{opt.text}</span>
                        <span className="text-muted-foreground">{opt.votes} votes</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active polls</p>
              )}
               {polls.length > 1 ? (
                <div>
                 <div className="flex justify-between">
                  <p className="font-medium text-blue-300">{polls[1].question}</p><span><button onClick={()=>handleDeletePoll(polls[0]._id)} className="text-red-500">remove</button></span>
                  </div>
                  <ul className="text-sm mt-2">
                    {polls[1].options.map((opt, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{opt.text}</span>
                        <span className="text-muted-foreground">{opt.votes} votes</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground"></p>
              )}
            </Section>

           <div className="flex bg-white rounded-xl h-40 shadow-sm p-4 divide-x divide-border"> {/* Checked In */} 
            <div className="flex-1 text-center"> 
              <p className="text-4xl font-semibold">{checkedIn}</p>
               <p className="text-sm text-muted-foreground">Checked In</p> 
               </div> 
               {/* Not Checked In */}
                <div className="flex-1 text-center"> 
                  <p className="text-4xl font-semibold">{notCheckedIn}</p> 
                  <p className="text-sm text-muted-foreground">Not Checked In</p>
                   </div> 
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
