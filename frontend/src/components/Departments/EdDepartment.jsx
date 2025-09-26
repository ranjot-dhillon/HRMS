import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
const EdDepartment = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [department, setdepartment] = useState([]);
  const [deploading, setdeploading] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      setdeploading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Fetched departments:", response.data.department);
        if (response.data.success) {
          setdepartment(response.data.department);
        }
      } catch (error) {
        if (error.response) alert(error.response.data.error);
      } finally {
        setdeploading(false);
      }
    };
    fetchDepartment();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setdepartment({ ...department, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/department/${id}`,
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      console.log(response.data.success);
      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      if (error.response && !error.response.data.error) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <>
      {deploading ? (
        <div>loading...</div>
      ) : (
        <div className="max-w-3xl text-center mx-auto mt-10 bg-white rounded-md shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 ">Edit Department</h2>
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
                value={department.dep_name || ""}
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
                value={department.description}
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
      )}
    </>
  );
};

export default EdDepartment;
