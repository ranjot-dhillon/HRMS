import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaPlaneDeparture,
  FaMoneyBill,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 w-75 bg-[#E1BEE7] shadow-lg p-0">
      {/* Header */}
      <div className="bg-[#6A1B9A] text-white py-0 px-5 w-75 text-2xl mr-0 font-bold text-center shadow-md tracking-wide uppercase">
        Employee Management
      </div>
      {/* Spacer added here */}
      <div className="h-6" /> {/* <- this creates vertical space */}
      {/* Sidebar menu */}
      <div className="flex flex-col gap-6 px-3 h-screen p-0">
        {[
          {
            label: "Dashboard",
            icon: <FaTachometerAlt />,
            to: "/admin-dashboard",
          },
          {
            label: "Employees",
            icon: <FaUsers />,
            to: "/admin-dashboard/employee",
          },
          {
            label: "Departments",
            icon: <FaBuilding />,
            to: "/admin-dashboard/departments",
          },
          {
            label: "Leaves",
            icon: <FaPlaneDeparture />,
            to: "/admin-dashboard/leaves",
          },
          {
            label: "Salary",
            icon: <FaMoneyBill />,
            to: "/admin-dashboard/salary",
          },
          {
            label: "Settings",
            icon: <FaCog />,
            to: "/admin-dashboard/settings",
          },
        ].map(({ label, icon, to }, index) => (
          <NavLink
            to={to}
            key={index}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6  py-3 text-xl rounded-md border-2 transition-all font-semibold shadow-md ${
                isActive
                  ? "bg-[#F3E5F5] border-[#9C27B0] text-[#6A1B9A]"
                  : "bg-white border-[#E1BEE7] text-gray-800 hover:bg-[#F8EAFB] hover:border-[#BA68C8]"
              }`
            }
          >
            <span className="text-2xl">{icon}</span>
            <span className="uppercase tracking-wide">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
