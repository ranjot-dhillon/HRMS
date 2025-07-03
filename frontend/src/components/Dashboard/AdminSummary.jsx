import React from "react";
import { FaUser } from "react-icons/fa";
import {
  FaUserPlus,
  FaChartPie,
  FaEye,
  FaMoneyCheckAlt,
  FaCalendarAlt,
} from "react-icons/fa";

const AdminSummary = () => {
  return (
    <>
      <div className="p-0 space-y-6">
        {/* Top Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-cyan-500 text-white p-4 rounded-lg shadow-md">
            <p className="text-sm">Total Active Employees</p>
            <h3 className="text-2xl font-bold mt-2">67</h3>
          </div>
          <div className="bg-orange-400 text-white p-4 rounded-lg shadow-md">
            <p className="text-sm">Employees Not Promoted Today</p>
            <h3 className="text-2xl font-bold mt-2">145</h3>
          </div>
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
            <p className="text-sm">Last Login</p>
            <h3 className="text-lg mt-2">2025-06-30 10:43:32</h3>
          </div>
          <div className="bg-indigo-600 text-white p-4 rounded-lg shadow-md">
            <p className="text-sm">You Last Logged in</p>
            <h3 className="text-lg mt-2">13 Minutes Ago</h3>
          </div>
        </div>

        {/* Middle Section with Chart + Employee List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donut Chart Placeholder */}
          <div className="col-span-1 lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-4">Employee Status</h4>
            <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
              Chart Placeholder
            </div>
          </div>

          {/* Employees On Leave */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-4">Employees On Leave</h4>
            <ul className="space-y-2">
              <li className="text-sm border-b pb-2">
                Norman - Manager (IT - Sales), Noida
              </li>
              <li className="text-sm border-b pb-2">
                Rohit Sharma - Executive (IT - Sales), Noida
              </li>
              <li className="text-sm">
                Neha Kapoor - Team Leader (Sales), Noida
              </li>
            </ul>
            <button className="mt-4 text-blue-600 hover:underline text-sm">
              View All Products
            </button>
          </div>
        </div>

        {/* Bottom Section with Actions and Activity Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Action Buttons */}
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-4 justify-evenly">
            <button className="flex flex-col items-center text-sm text-center">
              <FaUserPlus size={24} className="text-blue-500 mb-1" />
              Add New
            </button>
            <button className="flex flex-col items-center text-sm text-center">
              <FaEye size={24} className="text-green-500 mb-1" />
              View Employee
            </button>
            <button className="flex flex-col items-center text-sm text-center">
              <FaChartPie size={24} className="text-purple-500 mb-1" />
              PrePayroll
            </button>
            <button className="flex flex-col items-center text-sm text-center">
              <FaMoneyCheckAlt size={24} className="text-pink-500 mb-1" />
              Run Payroll
            </button>
            <button className="flex flex-col items-center text-sm text-center">
              <FaCalendarAlt size={24} className="text-yellow-500 mb-1" />
              Leave Requests
            </button>
          </div>

          {/* Latest Activity Table Placeholder */}
          <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md overflow-auto">
            <h4 className="text-lg font-semibold mb-4">Latest Activity</h4>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Emp. ID</th>
                  <th className="p-2">Emp. Name</th>
                  <th className="p-2">Activity</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">GATT1205</td>
                  <td className="p-2">Vinod Kumar</td>
                  <td className="p-2">Leave Request</td>
                  <td className="p-2">2025-06-30</td>
                  <td className="p-2 text-blue-500">Unpaid</td>
                </tr>
                {/* Add more rows here */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSummary;
