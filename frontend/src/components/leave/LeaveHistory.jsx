// LeaveHistory.jsx
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/authContext";

const LeaveHistory = () => {
  let Sno = 1;
  const [leavesData, setLeavesData] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const { id } = useParams();
  const {user} = useAuth();
  const id= user._id;
  const fetchLeaves = async () => {
    try {
       console.log("Id send for leave history for employee",id);
      
      const response = await axios.get(
        `http://localhost:3000/api/leave/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        console.log("all leaves history for employee",response.data.leaves);
        setLeavesData(response.data.leaves);
        // setFilteredSalaries(response.data.salary);
      }
    } catch (error) {
      alert(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchLeaves();
    // eslint-disable-next-line
  }, []);

  return (
    <>
    {/* <div className="bg-white p-4 rounded shadow"> */}
      {/* <h3 className="text-lg font-semibold mb-2">Leave History</h3> */}
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">SNo</th>
            <th className="p-2">Type</th>
            <th className="p-2">From</th>
            <th className="p-2">To</th>
            <th className="p-2">Description</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {leavesData.map((leave, index) => (
            <tr key={index} className="text-center border-t">
              <td className="p-2">{Sno++}</td>
              <td className="p-2">{leave.leaveType}</td>
              <td className="p-2">
                {new Date(leave.startDate).toLocaleDateString()}
              </td>
              <td className="p-2">
                {new Date(leave.endDate).toLocaleDateString()}
              </td>
              <td className="p-2">{leave.reason}</td>
              <td className="p-2 text-green-600 font-medium">{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    
    </>
  );
};

export default LeaveHistory;
