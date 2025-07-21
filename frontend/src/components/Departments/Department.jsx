import React from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
const Department = () => {
  const [department, setdepartment] = useState([]);
  const [deploading, setdeploading] = useState(false);
  const [filteredDepartment, setfilteredDepartment] = useState([]);

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

  const filterDepartment = (e) => {
    const records = department.filter((dep) =>
      dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setfilteredDepartment(records);
  };
  return (
    <>
      {deploading ? (
        <div>loading...</div>
      ) : (
        <div>
          <div className="text-center items-center justify-center">
            <h3 className="text-3xl font-bold">Manage Department</h3>
          </div>
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="enter name of dep"
              className="px-4 py-0.5 border-1"
              onChange={filterDepartment}
            />
            <Link
              to="/admin-dashboard/add-department"
              className="px-10 py-2 bg-purple-700 mr-20 rounded text-white"
            >
              add new dep
            </Link>
          </div>
          <DataTable columns={columns} data={filteredDepartment} pagination />
        </div>
      )}{" "}
    </>
  );
};

export default Department;
