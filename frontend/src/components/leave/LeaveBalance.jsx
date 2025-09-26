// LeaveBalance.jsx
import React from "react";
import LeaveForm from "./LeaveForm";

const LeaveBalance = () => {
  const balance = [
    { type: "Casual", total: 12, used: 4 },
    { type: "Sick", total: 8, used: 2 },
    { type: "Earned", total: 15, used: 6 },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {balance.map((leave, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <h4 className="font-bold text-purple-700">{leave.type} Leave</h4>
            <p>Total: {leave.total}</p>
            <p>Used: {leave.used}</p>
            <p>Remaining: {leave.total - leave.used}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default LeaveBalance;
