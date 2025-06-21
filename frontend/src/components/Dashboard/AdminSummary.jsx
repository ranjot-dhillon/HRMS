import React from 'react';
import './adminDashboard.css'; // Import your CSS file
import { FaUsers, FaBuilding, FaDollarSign, FaBell, FaClipboardList, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

// Helper component for uniform card structure
const DashboardCard = ({ icon, iconBgColor, title, value, button }) => (
  <div className="card">
    <div className={`card-icon ${iconBgColor}`}>
      {icon}
    </div>
    <div>
      <div className="text-gray-500 text-sm">{title}</div>
      {value && <div className="text-2xl font-bold text-gray-800">{value}</div>}
      {button && button}
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      {/* Main Grid for Dashboard Sections (e.g., Overview and Leave Details) */}
      <div className="dashboard-sections-grid">
        
        {/* TOP ROW OF CARDS: Total Employees, Total Departments, Monthly Salary, Reminder */}
        {/* This div will manage the alignment of the overview cards */}
        <div className="dashboard-overview-cards">
          <DashboardCard
            icon={<FaUsers />}
            iconBgColor="bg-teal"
            title="Total Employees"
            value="13"
          />
          <DashboardCard
            icon={<FaBuilding />}
            iconBgColor="bg-yellow"
            title="Total Departments"
            value="5"
          />
          <DashboardCard
            icon={<FaDollarSign />}
            iconBgColor="bg-red"
            title="Monthly Salary"
            value="$654"
          />
          {/* Reminder Card - This one appears like the fourth card in your initial screenshot, 
              but the new reference image (316.jpg) doesn't show it here.
              If you want 4 cards in the first row as per 315.png, keep this.
              If you want strictly 3 as per 316.jpg and "Reminder" below, we need another section.
              Let's keep it here for now as it makes a 4-column row.
          */}
          <DashboardCard
            icon={<FaBell />}
            iconBgColor="bg-green"
            title="Reminder"
            button={<button className="reminder-button">Add a task</button>}
          />
        </div>

        {/* LEAVE DETAILS SECTION */}
        {/* This entire div will take up the full width, then contain its own grid of cards */}
        <div className="leave-details-section">
          <h3 className="leave-details-title">Leave Details</h3>
          <div className="leave-details-cards"> {/* Inner grid for Leave Detail Cards */}
            <DashboardCard
              icon={<FaClipboardList />}
              iconBgColor="bg-purple-dark"
              title="Leave Applied"
              value="5"
            />
            <DashboardCard
              icon={<FaCheckCircle />}
              iconBgColor="bg-green"
              title="Leave Approved"
              value="2"
            />
            <DashboardCard
              icon={<FaHourglassHalf />}
              iconBgColor="bg-orange"
              title="Leave Pending"
              value="4"
            />
            <DashboardCard
              icon={<FaTimesCircle />}
              iconBgColor="bg-red"
              title="Leave Rejected"
              value="1"
            />
          </div>
        </div>

        {/* Add more dashboard sections here if needed, they will stack vertically due to dashboard-sections-grid */}
      </div>
    </div>
  );
};

export default AdminDashboard;