import React from "react";
import { useAuth } from "../../../context/authContext";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const AddQuery = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [month, setMonth] = useState("");

  const Id = user._id;
  const submitQuery = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/query",
        { Id, message, month },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      console.log("query data", res.data);
      if (res.data.success) {
        navigate(`/employee-dashboard/salary/${Id}`);
      }

      setMessage("");
    } catch (error) {
      {
        alert("in sending query");
      }
    }
  };

  return (
    <div className=" flex items-center justify-center mt-10">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Raise Salary Query
        </h2>
        <form onSubmit={submitQuery}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">For month</label>
            <input
              type="month"
              className="w-full border border-gray-300 p-2 rounded"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">
              Describe your salary issue
            </label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded"
              rows="4"
              placeholder="Describe your salary issue..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold"
          >
            Submit Query
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuery;
