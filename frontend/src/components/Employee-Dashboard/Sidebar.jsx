import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaMoneyBillWave,
  FaCogs,
  FaSignOutAlt,
  FaCalendarCheck,
} from "react-icons/fa";
import { useAuth } from "../../../context/authContext";

export default function Sidebar() {
  const { user } = useAuth();
  const id = user._id;
  return (
    <aside className="fixed top-0 left-0 min-h-screen w-64 bg-gradient-to-b from-purple-700 to-purple-900 text-white flex flex-col p-4 shadow-lg z-50">
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold mb-10 tracking-wide">EMPLOYEE</h1>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <NavItem
          icon={<FaTachometerAlt />}
          label="Dashboard"
          to="/employee-dashboard"
        />
        <NavItem
          icon={<FaUser />}
          label="My Profile"
          to={`/employee-dashboard/myProfile/${id}`}
        />
        <NavItem
          icon={<FaCalendarCheck />}
          label="Leaves"
          to="/employee-dashboard/leaves"
        />
        <NavItem
          icon={<FaMoneyBillWave />}
          label="Salary"
          to={`/employee-dashboard/salary/${id}`}
        />
        <NavItem
          icon={<FaCogs />}
          label="Settings"
          to="/employee-dashboard/employeeSettings"
        />
      </nav>
    </aside>
  );
}

/* Nav Item Component */
function NavItem({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300
        ${
          isActive
            ? "bg-purple-600 shadow-lg scale-[1.02]"
            : "hover:bg-purple-800"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
