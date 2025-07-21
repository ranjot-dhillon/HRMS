import React from 'react'
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
// import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { EmployeetButtons,columns } from '../../utils/EmployeHelper';
const List = () => {
  const [employees,setEmployees] = useState([]);
  const [emploading, setEmploading] = useState(false);
  

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmploading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/employee",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // console.log("Fetched departments:", response.data.departments);
        if (response.data.success) {
          let sno = 1;
          const data = await response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            dep_name: emp.department.dep_name,
            name:emp.userId.name,
            dob:new Date(emp.dob).toLocaleDateString(),
            profileImage:<img width={40} src={`http://localhost:3000/${emp.userId.profileImage}`}/>,
            // profileImage:emp.userId.profileImage,
            action: (
            
              <EmployeetButtons Id={emp._id}/>
            ),
          }));
          console.log("EMPLOYEES:", data);

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

  const filterDepartment = (e) => {
    const records = department.filter((dep) =>
      dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    
  };
  return (
    <>
      {emploading ? (
        <div>loading...</div>
      ) : (
        <div className='ml-10'>
          <div className="text-center items-center justify-center">
            <h3 className="text-3xl font-bold">Manage Employees</h3>
          </div>
          <div className="flex justify-between items-center ml-10">
            <input
              type="text"
              placeholder="enter name of employee"
              className="px-4 py-0.5 border-1"
            />
            <Link
              to="/admin-dashboard/add-employee"
              className="px-10 py-2 bg-purple-700 mr-20 rounded text-white"
            >
              add new Employee
            </Link>
          </div>
          <div className='mt-7 rounded'><DataTable  columns={columns} data={employees} pagination /></div>
          
        </div>
      )}{" "}
    </>
  );
}

export default List