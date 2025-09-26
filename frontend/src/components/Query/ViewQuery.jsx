import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/authContext";

const ViewQuery = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [giveResponse, setGiveResponse] = useState(false);
  const [responseMessage, setRespopnseMessage] = useState("");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const { user } = useAuth();
  const id = user._id;
  console.log("id", id);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/query", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        });
        if (response.data.success) {
          setQueries(response.data.Queries);
        }
      } catch (error) {
        alert("in getting queries");
      }
    };
    fetchQueries();
  }, []);
  const handleQuerySubmit = async () => {
    // const response = prompt("Enter your response:");
    setLoading(true); // show spinner
    try {
      const Id = selectedQuery._id;
      console.log(id);
      const res = await axios.put(
        `http://localhost:3000/api/query/${id}`,
        { responseMessage, Id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setGiveResponse(false);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // hide spinner
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/query/deletePendingQuery/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      if (response.data.success) {
        // setNewQuery(null);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {queries.length === 0 ? (
        <div className="text-center items-center text-2xl font-bold justify-center mt-50">
          No Query Found
        </div>
      ) : (
        <div className="bg-white rounded shadow p-5 m-8">
          <div>
            <h3 className="text-3xl font-bold text-center">
              All Pending Queries
            </h3>
          </div>
          <table className="w-full table-auto text-sm mt-5">
            <thead>
              <tr className="bg-gray-200 border-b">
                <th>EmployeeID</th>
                <th>Employee Name</th>
                <th>Month</th>
                <th>Query</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((q) => (
                <tr key={q._id} className="text-center pt-4">
                  <td>{q.employeeId.employeeId}</td>
                  <td>{q.employeeId.userId.name}</td>
                  <td>
                    {new Date(q.forMonth).toLocaleDateString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td>{q.message || "N/A"}</td>

                  <td className="px-6 py-2 space-x-2">
                    <button
                      onClick={() => {
                        setGiveResponse(true);
                        setSelectedQuery(q);
                      }}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      Response
                    </button>
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {giveResponse && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  bg-white border border-gray-300 shadow-lg rounded-lg p-6 w-96 z-50"
        >
          <div className="font-semibold text-green-600 text-lg text-center">
            ✅ Resolve Query
          </div>
          <div className="mt-3 text-sm text-gray-700">
            <p>
              <strong>Message:</strong> {selectedQuery.message}
            </p>
            <p className="mt-2">
              <strong>Response:</strong>
            </p>
            <input
              type="text"
              placeholder="Enter Response"
              className="border border-gray-300 rounded px-2 py-1 w-full mt-1"
              onChange={(e) => setRespopnseMessage(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={handleQuerySubmit}
            >
              Submit
            </button>
            <button
              className="text-sm bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
              onClick={() => setGiveResponse(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewQuery;
