import React, { useEffect, useState } from "react";
import { fetchDepartment } from "../../utils/EmployeHelper";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Edit() {
  const [department, setdepartment] = useState([]);
  const [employee, setEmployee] = useState({
    name: "",
    maritalStatus: "",
    designation: "",
    salary: 0,
    department: "",
  });

  const [showSalaryForm, setShowSalaryForm] = useState(false);
  const [form, setForm] = useState({
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getDeprtment = async () => {
      const department = await fetchDepartment();
      setdepartment(department);
    };
    getDeprtment();
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const employee = response.data.employee;
          setEmployee((prev) => ({
            ...prev,
            name: employee.userId.name,
            maritalStatus: employee.maritalStatus,
            designation: employee.designation,
            salary: employee.salary,
            department: employee.department,
          }));

          if (employee.bankDetail) {
            setForm(employee.bankDetail); // preload bank details if exist
          }
        }
      } catch (error) {
        if (error.response) alert(error.response.data.error);
      }
    };
    fetchEmployee();
  }, [id]);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/employee/${id}`,
        employee,
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
      if (error.response) {
        alert(error.response.data.error);
      }
    }
  };

  const handleChangeBank = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitBankDetail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/salary/updatesalarydetail/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        alert("Bank details updated successfully!");
        setShowSalaryForm(false);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <>
      {department && employee ? (
        <div className="max-w-4xl mx-auto mt-5 bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Edit Employee Details
          </h2>

          {/* Employee Edit Form */}
          {!showSalaryForm && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Insert Name"
                    value={employee.name}
                    onChange={handlechange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Marital Status
                  </label>
                  <select
                    name="maritalStatus"
                    value={employee.maritalStatus}
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
                    value={employee.designation}
                    onChange={handlechange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={employee.salary}
                    onChange={handlechange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    name="department"
                    value={employee.department}
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

                <button
                  type="submit"
                  className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Save Employee
                </button>

                <button
                  type="button"
                  onClick={() => setShowSalaryForm(true)}
                  className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Edit Salary Detail
                </button>
              </div>
            </form>
          )}

          {/* Salary / Bank Detail Form */}
          {showSalaryForm && (
            <form onSubmit={handleSubmitBankDetail} className="space-y-4">
              <h3 className="text-xl font-bold text-center mb-4">
                Bank / Salary Details
              </h3>
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={form.accountNumber}
                onChange={handleChangeBank}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="ifscCode"
                placeholder="IFSC Code"
                value={form.ifscCode}
                onChange={handleChangeBank}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={form.bankName}
                onChange={handleChangeBank}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                value={form.branch}
                onChange={handleChangeBank}
                className="w-full border p-2 rounded"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                Save Details
              </button>
              <button
                type="button"
                onClick={() => setShowSalaryForm(false)}
                className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
              >
                Back
              </button>
            </form>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default Edit;
