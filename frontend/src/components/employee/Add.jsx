import React, { useEffect, useState } from "react";
import { fetchDepartment } from "../../utils/EmployeHelper";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Add() {
  const [department, setdepartment] = useState([]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const getDeprtment = async () => {
      const department = await fetchDepartment();
      setdepartment(department);
    };
    getDeprtment();
  }, []);

  const handlechange = (e) => {
    const { name, value, files } = e.target;
    if (name == "image") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataobj = new FormData();

    Object.keys(formData).forEach((key) => {
      formDataobj.append(key, formData[key]);
    });

    for (let pair of formDataobj.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    console.log("Form Data Being Sent:", formData);

    try {
      const response = await axios.post( 
        "http://localhost:3000/api/employee/add",
        formDataobj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        navigate("/admin-dashboard/employee");
      }
    } catch (error) {
      console.log(error.message);
      if (error.response && !error.response.data.error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-5 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 ">
              {" "}
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Insert Name"
              onChange={handlechange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {" "}
              E-Mail
            </label>
            <input
              type="text"
              name="email"
              placeholder="Insert E-mail"
              onChange={handlechange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
         
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {" "}
              Date Of Birth
            </label>
            <input
              type="Date"
              name="dob"
              placeholder="Insert Name"
              onChange={handlechange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {" "}
              Gender
            </label>
            <select
              name="gender"
              onChange={handlechange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {" "}
              Marital Status
            </label>
            <select
              name="maritalStatus"
              placeholder="Marital status"
              onChange={handlechange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              placeholder="Designation"
              onChange={handlechange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              placeholder="Department"
              onChange={handlechange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="">Select Department</option>
              {department.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salary(LPA)
            </label>
            <input
              type="number"
              name="salary"
              placeholder="Salary"
              onChange={handlechange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              placeholder="role"
              onChange={handlechange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <br></br>
          <button
            type="submit"
            className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
}

export default Add;
