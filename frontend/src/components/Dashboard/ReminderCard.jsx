// import React, { useState } from 'react';

// const ReminderCard = () => {
//   const [task, setTask] = useState('');
//   const [reminders, setReminders] = useState([]);

//   const handleAdd = () => {
//     if (task.trim()) {
//       setReminders([...reminders, task]);
//       setTask('');
//     }
//   };

//   return (
//     <div className="card">
//       <h4>Reminder 🔔</h4>
//       <input
//         type="text"
//         placeholder="Add a task..."
//         value={task}
//         onChange={(e) => setTask(e.target.value)}
//         style={{ width: '100%', padding: '5px', marginTop: '10px' }}
//       />
//       <button onClick={handleAdd} style={{ marginTop: '10px', padding: '5px 10px', background: '#6A1B9A', color: 'white', border: 'none', borderRadius: '5px' }}>Add</button>
//       <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
//         {reminders.map((r, i) => (
//           <li key={i}>{r}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ReminderCard;

// Sidebar.jsx
import { FaTachometerAlt, FaUser, FaMoneyBillWave, FaCogs, FaSignOutAlt, FaCalendarCheck } from "react-icons/fa";

export default function ReminderCard() {
  return (
    <aside className="bg-gradient-to-b from-purple-700 to-purple-900 text-white w-64 flex flex-col p-4 shadow-lg">
      <h1 className="text-2xl font-bold mb-10 tracking-wide">EMPLOYEE</h1>
      <nav className="flex-1 space-y-2">
        <NavItem icon={<FaTachometerAlt />} label="Dashboard" active />
        <NavItem icon={<FaUser />} label="My Profile" />
        <NavItem icon={<FaCalendarCheck />} label="Leaves" />
        <NavItem icon={<FaMoneyBillWave />} label="Salary" />
        <NavItem icon={<FaCogs />} label="Settings" />
      </nav>
      <button className="flex items-center gap-3 text-red-300 hover:text-red-400 mt-auto transition">
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition ${
        active ? "bg-purple-600 shadow-md" : "hover:bg-purple-800"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

