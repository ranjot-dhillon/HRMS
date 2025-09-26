import React from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
const Department = () => {
  const [department, setdepartment] = useState([]);
  const [deploading, setdeploading] = useState(false);
  const [filteredDepartment, setfilteredDepartment] = useState([]);
  const navigate = useNavigate();

  const onDepartmentDelete = async (id) => {
    const data = department.filter((dep) => dep._id !== id);
    setdepartment(data);
    setfilteredDepartment(data);
  };

  useEffect(() => {
    const fetchDepartment = async () => {
      setdeploading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/department",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // console.log("Fetched departments:", response.data.departments);
        if (response.data.success) {
          let sno = 1;
          const data = await response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            action: (
              <DepartmentButtons
                _id={dep._id}
                onDepartmentDelete={onDepartmentDelete}
              />
            ),
          }));
          setdepartment(data);
          setfilteredDepartment(data);
        }
      } catch (error) {
        if (error.response) alert(error.response.data.error);
      } finally {
        setdeploading(false);
      }
    };
    fetchDepartment();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Do you really want to delete");
    if (confirm) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // console.log("Fetched departments:", response.data.department);
        if (response.data.success) {
          onDepartmentDelete(id);
        }
      } catch (error) {
        if (error.response) alert(error.response.data.error);
      }
    }
  };

  const filterDepartment = (e) => {
    const records = department.filter((dep) =>
      dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setfilteredDepartment(records);
  };
  return (
    <>
      <div className="bg-white rounded shadow p-5 m-8">
        <h3 className=" text-3xl  text-center font-semibold mb-2">
          Manage Department
        </h3>

        <div className="flex justify-between items-center ml-0">
          <input
            type="text"
            placeholder="Filter By Id"
            className="px-4 py-0.5 border-1"
            onChange={filterDepartment}
          />
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => navigate("/admin-dashboard/add-department")}
            >
              Add New Department
            </button>
          </div>
        </div>

        <table className="w-full table-auto text-sm mt-5 ">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">S.No</th>
              <th className="p-2">Department Name</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartment.map((dep, index) => (
              <tr key={dep._id} className="text-center border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{dep.dep_name ?? "N/A"}</td>
                <td className=" w-[30%]">
                  <button
                    className="border bg-green-400 rounded p-1 px-3 m-2"
                    onClick={() =>
                      navigate(`/admin-dashboard/department/${dep._id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="border bg-red-400 rounded p-1 px-3 m-2"
                    onClick={() => handleDelete(dep._id)}
                  >
                    Delete
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

export default Department;
