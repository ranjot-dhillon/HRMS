import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const View = () => {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        console.log("employss Id", id);
        const response = await axios.get(
          `http://localhost:3000/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Fetched employees:", response.data.employee);
        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch (error) {
        if (error.response) alert(error.response.data.error);
      }
    };
    fetchEmployee();
  }, []);

  return (
    <>
      {employee ? (
        <div className="max-w-5xl mx-auto mt-16 bg-white p-8 rounded-xl shadow-lg border border-purple-200">
          <h2 className="text-3xl font-bold text-prple-700 mb-6 text-center">
            Employee Details
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="w-40 h-40 rounded-full overflow-hidden shadow-md border-4 border-purple-300">
              <img
                src={
                  `${employee.userId.profileImage}` ||
                  "/default-profile.png"
                }
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Table */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
              <div>
                <strong className="text-purple-600">Name:</strong>{" "}
                {employee.userId.name}
              </div>
              <div>
                <strong className="text-purple-600">Email:</strong>{" "}
                {employee.userId.email}
              </div>
              <div>
                <strong className="text-purple-600">Employee ID:</strong>{" "}
                {employee.employeeId}
              </div>
              <div>
                <strong className="text-purple-600">DOB:</strong>{" "}
                {employee.dob?.slice(0, 10)}
              </div>
              <div>
                <strong className="text-purple-600">Gender:</strong>{" "}
                {employee.gender}
              </div>
              <div>
                <strong className="text-purple-600">Marital Status:</strong>{" "}
                {employee.maritalStatus}
              </div>
              <div>
                <strong className="text-purple-600">Designation:</strong>{" "}
                {employee.designation}
              </div>
              <div>
                <strong className="text-purple-600">Department:</strong>{" "}
                {employee.department.dep_name || "N/A"}
              </div>
              <div>
                <strong className="text-purple-600">Salary:</strong> ₹
                {employee.salary}
              </div>
              <div>
                <strong className="text-purple-600">Role:</strong>{" "}
                {employee.userId.role}
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md shadow-md transition duration-300"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div>Loading....</div>
      )}
    </>
  );
};
export default View;
