import React from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
// import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
// import { EmployeetButtons, columns } from "../../utils/EmployeHelper";
import { useNavigate } from "react-router-dom";
// import { useAuth } from '../../../context/authContext';
const List = () => {
  const [employees, setEmployees] = useState([]);
  const [emploading, setEmploading] = useState(false);
  const [allEmployee,setAllEmployee]=useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmploading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // console.log("Fetched departments:", response.data.departments);
        if (response.data.success) {
          let sno = 1;
          const data = await response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            dep_name: emp.department.dep_name,
            name: emp.userId.name,
            dob: new Date(emp.dob).toLocaleDateString(),
            profileImage: (
              <img
                width={40}
                src={`${emp.userId.profileImage}`}
              />
            ),
            // profileImage:emp.userId.profileImage,
          }));
          console.log("EMPLOYEES:", data);
          setAllEmployee(data)
          setEmployees(data);
        }
      } catch (error) {
        if (error.response) alert(error.response.data.error);
      } finally {
        setEmploading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filterInput = (e) => {
      const value = e.target.value.toLowerCase();

    if (!value) {
      // Reset to full list when input is cleared
      setEmployees(allEmployee);
    } else {
      const records = allEmployee.filter((emp) =>
        emp.dep_name?.toLowerCase().includes(value)
      );
      console.log("employee record is",records)
      setEmployees(records)
  }
  };
 
  return (
    <>
      <div className="bg-white rounded shadow p-5 m-8">
        <h3 className=" text-3xl  text-center font-semibold mb-2">Employees</h3>

        <div className="flex justify-between items-center ml-0">
          <input
            type="text"
            placeholder="Filter By Dep"
            className="px-4 py-0.5 border-1"
           onChange={filterInput}
          />
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => navigate("/admin-dashboard/add-employee")}
            >
              Add Employee
            </button>
          </div>
        </div>

        <table className="w-full table-auto text-sm mt-5 ">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">S.No</th>
              <th className="p-2">Image</th>
              <th className="p-2">Name</th>
              <th className="p-2">Department</th>
              <th className="p-2">DOB</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp._id} className="text-center border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2 flex justify-center items-center ">
                  {emp.profileImage}
                </td>
                <td className="p-2">{emp.name ?? "N/A"}</td>
                <td className="p-2">{emp.dep_name || 0}</td>
                <td className="p-2">{emp.dob || 0}</td>
                {/* <td className="p-2 font-semibold text-green-700">{}</td> */}

                <td className=" w-[30%]">
                  <button
                    className="border bg-yellow-400 rounded p-1 px-3 m-2"
                    onClick={() =>
                      navigate(`/admin-dashboard/employee/${emp._id}`)
                    }
                  >
                    view
                  </button>
                  <button
                    className="border bg-green-400 rounded p-1 px-3 m-2"
                    onClick={() =>
                      navigate(`/admin-dashboard/employee/edit/${emp._id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="border bg-blue-400 rounded p-1 px-3 m-2"
                    onClick={() =>
                      navigate(`/admin-dashboard/employee/salary/${emp._id}`)
                    }
                  >
                    Salary
                  </button>
                  <button
                    className="border bg-red-400 rounded p-1 px-3 m-2"
                    onClick={() =>
                      navigate(`/admin-dashboard/employee/Leaves/${emp._id}`)
                    }
                  >
                    Leaves
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default List;
