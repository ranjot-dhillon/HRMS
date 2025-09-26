import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const LeaveTable = () => {
  let Sno = 1;
  const [leaves, setLeaves] = useState([]);
  const [response, setResponseMessage] = useState("");
  const [giveResponse, setGiveResponse] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredLeave, setFilteredLeaves] = useState([]);

  useEffect(() => {
    const fetchAppliedLeaves = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/leave/appliedLeaves",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")} `,
            },
          }
        );
        //  console.log(response);
        if (response.data.success) {
          setLeaves(response.data.AppliedLeaves);
          setFilteredLeaves(response.data.AppliedLeaves);
        }
      } catch (error) {
        alert("in getting All leaves", error.message);
      }
    };
    fetchAppliedLeaves();
  }, []);

  const handleLeaveResponse = async (status) => {
    setLoading(true);
    try {
      console.log(response);
      console.log(status);
      console.log(selectedEmployee._id);
      const Id = selectedEmployee._id;
      const res = await axios.put(
        `http://localhost:3000/api/leave/responseLeave/${Id}`,
        { response: response, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);
      if (res.data.success) {
        setGiveResponse(false);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterInput = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      // Reset to full list when input is cleared
      setFilteredLeaves(leaves);
    } else {
      const records = leaves.filter((leave) =>
        leave.employeeId?.department?.dep_name?.toLowerCase().includes(value)
      );
      // console.log("employee record is",records)
      setFilteredLeaves(records)
  }
  };

  const filterByStatus = (status) => {
    const data = leaves.filter((leave) =>
      leave.status.toLowerCase().includes(status.toLowerCase())
    );
    setFilteredLeaves(data);
  };

  return (
    <>
      <div className="bg-white rounded shadow p-5 m-8">
        <h3 className=" text-3xl  text-center font-semibold mb-2">Leaves</h3>

        <div className="flex justify-between items-center ml-0">
          <input
            type="text"
            placeholder="Filter By Dep"
            className="px-4 py-0.5 border-1"
            onChange={filterInput}
          />
          <div className="flex gap-3">
            <button
              onClick={() => {
                filterByStatus("Approved");
              }}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Approved
            </button>
            <button
              onClick={() => {
                filterByStatus("Pending");
              }}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Pending
            </button>

            <button
              onClick={() => {
                filterByStatus("Rejected");
              }}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Rejected
            </button>
          </div>
        </div>

        <table className="w-full table-auto text-sm mt-5 ">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Sno</th>
              <th className="p-2">EmployeeId</th>
              <th className="p-2">Name</th>
              <th className="p-2">Leave Type</th>
              <th className="p-2">Department</th>
              <th className="p-2">Days</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeave.map((leave, index) => (
              <tr key={index} className="text-center border-t ">
                <td className="p-2">{Sno++}</td>
                <td className="p-2">{leave.employeeId?.employeeId || "N/A"}</td>
                <td className="p-2">{leave.employeeId?.userId?.name || "N/A"}</td>
                <td className="p-2">{leave.leaveType}</td>
                <td className="p-2">{leave.employeeId?.department?.dep_name || "N/A"}</td>
                <td className="p-2">
                  {Math.ceil(
                    (new Date(leave.endDate) - new Date(leave.startDate)) /
                      (1000 * 60 * 60 * 24)
                  )}
                </td>
                <td className="p-2 text-green-600 font-medium">
                  {leave.status}
                </td>
                <td>
                  <button
                    className="border bg-purple-400 rounded p-1 px-3 m-2"
                    onClick={() => {
                      setGiveResponse(true), setSelectedEmployee(leave);
                    }}
                  >
                    view
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {giveResponse && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  bg-white border border-gray-300 shadow-lg rounded-lg p-6 w-96 z-50"
        >
          <div className="font-semibold text-green-600 text-lg text-center">
            ✅ Respond Leave Applied
          </div>
          <div className="mt-3 text-sm text-gray-700">
            <p>
              <strong>Reason:</strong> {selectedEmployee.reason}
            </p>
            <p className="mt-2">
              <strong>Response:</strong>
            </p>
            <input
              type="text"
              placeholder="Enter Response"
              className="border border-gray-300 rounded px-2 py-1 w-full mt-1"
              onChange={(e) => setResponseMessage(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => {
                handleLeaveResponse("Approved");
              }}
            >
              Approve
            </button>
            <button
              className="text-sm bg-Red-300 text-black px-3 py-1 rounded hover:bg-gray-400"
              onClick={() => {
                handleLeaveResponse("Rejected");
                setGiveResponse(false);
              }}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaveTable;
