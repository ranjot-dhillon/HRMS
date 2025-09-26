import React, { useEffect, useState } from "react";
import { fetchDepartment, getEmployees } from "../../utils/EmployeHelper";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AddSalary() {
  const [department, setdepartment] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [salary, setSalary] = useState({
    employeeId: null,
    basicsalary: 0,
    allowances: 0,
    deductions: 0,
    effectiveFrom: null,
  });

  const navigate = useNavigate();
  useEffect(() => {
    const getDepartment = async () => {
      const department = await fetchDepartment();
      setdepartment(department);
    };
    getDepartment();
  }, []);

  const handleDepartment = async (e) => {
    const emps = await getEmployees(e.target.value);
    setEmployees(emps);
  };

  const handlechange = (e) => {
    const { name, value } = e.target;

    setSalary((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(salary);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/salary/add",
        salary,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );

      if (response.data.success) {
        navigate("/admin-dashboard/employee");
      }
    } catch (error) {
      if (error.response && !error.response.data.error) {
        console.log(error.message);

        alert(error.response.data.error);
      }
    }
  };

  return (
    <>
      {department ? (
        <div className="max-w-4xl mx-auto mt-5 bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6">Add Salary</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  name="department"
                  placeholder="Department"
                  onChange={handleDepartment}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Employees
                  </label>
                  <select
                    name="employeeId"
                    placeholder="Employee"
                    onChange={handlechange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  >
                    <option value="">Select Employees</option>
                    {employees?.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.employeeId}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    basic Salary
                  </label>
                  <input
                    type="number"
                    name="basicSalary"
                    placeholder="Basic-Salary"
                    onChange={handlechange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Allowances
                  </label>
                  <input
                    type="number"
                    name="allowances"
                    placeholder="Allowances"
                    onChange={handlechange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Deductions
                  </label>
                  <input
                    type="number"
                    name="deductions"
                    placeholder="Deductions"
                    onChange={handlechange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Effective From
                  </label>
                  <input
                    type="date"
                    name="effectiveFrom"
                    placeholder="Effective From"
                    onChange={handlechange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Edit Employee
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div>LoaderFunctionArgs..</div>
      )}
    </>
  );
}

export default AddSalary;
