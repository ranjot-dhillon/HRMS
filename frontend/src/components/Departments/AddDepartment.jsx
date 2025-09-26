import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddDepartment = () => {
  const [Department, setdepartment] = useState({
    dep_name: "",
    description: "",
  });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/department/add",
        Department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      if (error.response && !error.response.data.error) {
        alert(error.response.data.error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setdepartment({ ...Department, [name]: value });
  };

  return (
    <>
      <div className="max-w-3xl text-center mx-auto mt-10 bg-white rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 ">Add New Department</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="dep_name"
              className="text-sm font-medium text-gray-700"
            >
              Department Name
            </label>
            <br></br>
            <input
              type="text"
              name="dep_name"
              onChange={handleChange}
              placeholder="Department Name "
              className="mt-1  p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              rows={4}
            />
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default AddDepartment;
