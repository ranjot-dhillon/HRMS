// LeaveForm.jsx
import React, { useState } from "react";
import LeaveBalance from "./LeaveBalance";
import { useAuth } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const LeaveForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaveData, setleaveData] = useState({
    userId: user._id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setleaveData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(leaveData);
    // Send POST request to backend
    try {
      const response = await axios.post(
        "http://localhost:3000/api/leave/add",
        leaveData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        navigate("/employee-dashboard/leaves");
      }
    } catch (error) {
      console.log(error.message);
      if (error.response && !error.response.data.error) {
        alert(error);
      }
    }
  };

  return (
    <>
      <div className="pl-12 px-10 pb-10">
        {/* <h3 className="text-center text-2xl font-bold py-5">Apply For Leave</h3> */}
        {/* <LeaveBalance /> */}

        <div className="bg-white p-6 rounded shadow-md  mx-auto mt-6 w-150">
          <h2 className="text-2xl text-center font-semibold mb-4 text-purple-700">
            Apply for Leave
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Leave Type */}
            <div>
              <label htmlFor="type" className="block font-medium text-gray-700">
                Leave Type
              </label>
              <select
                id="leaveType"
                name="leaveType"
                // value={leaveData.type}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="">Select type</option>
                <option value="Casual">Casual</option>
                <option value="Sick">Sick</option>
                <option value="Earned">Earned</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* From Date */}
              <div>
                <label
                  htmlFor="from"
                  className="block font-medium text-gray-700"
                >
                  From Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  // value={leaveData.from}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>

              {/* To Date */}
              <div>
                <label htmlFor="to" className="block font-medium text-gray-700">
                  To Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  // value={leaveData.to}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label
                htmlFor="reason"
                className="block font-medium text-gray-700"
              >
                Reason for Leave
              </label>
              <textarea
                id="reason"
                name="reason"
                // value={leaveData.reason}
                onChange={handleChange}
                rows="3"
                className="w-full mt-1 p-2 border rounded"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Submit Leave Request
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LeaveForm;
