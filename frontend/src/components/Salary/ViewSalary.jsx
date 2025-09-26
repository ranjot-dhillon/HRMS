import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/salary/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
        console.log("filterred dalaryies", filteredSalaries);
      }
    } catch (error) {
      alert(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
    // eslint-disable-next-line
  }, []);

  const filterSalaries = (q) => {
    const filtered = salaries.filter((salary) =>
      salary.employeeId?.toLowerCase().includes(q.toLowerCase())
    );
    setFilteredSalaries(filtered);
  };

  return (
    // <div className="p-5 max-w-7xl mx-auto">
    //   <div className="text-center mb-6">
    //     <h2 className="text-3xl font-bold text-purple-800">Salary History</h2>
    //   </div>

    //   <div className="flex justify-end mb-4">
    //     <input
    //       type="text"
    //       placeholder="Search by Employee ID"
    //       onChange={(e) => filterSalaries(e.target.value)}
    //       className="border border-gray-400 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
    //     />
    //   </div>

    //   {loading ? (
    //     <div className="text-center text-gray-500">Loading...</div>
    //   ) : filteredSalaries.length === 0 ? (
    //     <div className="text-center text-gray-500">
    //       No salary records found.
    //     </div>
    //   ) : (
    //     <div className="overflow-x-auto rounded-lg shadow-md border border-gray-300">
    //       <table className="w-full table-auto text-sm text-left text-gray-700">
    //         <thead className="bg-purple-600 text-white">
    //           <tr>
    //             <th className="px-4 py-2">#</th>
    //             <th className="px-4 py-2">Employee ID</th>
    //             <th className="px-4 py-2">Basic Salary</th>
    //             <th className="px-4 py-2">Allowances</th>
    //             <th className="px-4 py-2">Deductions</th>
    //             <th className="px-4 py-2">Net Salary</th>
    //             <th className="px-4 py-2">Effective From</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {filteredSalaries.map((salary, index) => (
    //             <tr key={salary._id} className="even:bg-purple-50">
    //               <td className="px-4 py-2">{index + 1}</td>
    //               <td className="px-4 py-2">{salary.employeeId.employeeId}</td>
    //               <td className="px-4 py-2">₹{salary.basicSalary ?? "N/A"}</td>
    //               <td className="px-4 py-2">₹{salary.allowances || 0}</td>
    //               <td className="px-4 py-2">₹{salary.deductions || 0}</td>
    //               <td className="px-4 py-2 font-semibold text-green-700">
    //                 ₹{salary.netSalary}
    //               </td>
    //               <td className="px-4 py-2">
    //                 {salary.effectiveFrom
    //                   ? new Date(salary.effectiveFrom).toLocaleDateString()
    //                   : "N/A"}
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>
    //   )}
    // </div>
     <div className="bg-white rounded shadow p-5 m-8">
      <h3 className=" text-3xl  text-center font-semibold mb-2 pb-7">Salaries</h3>

     
      {loading ? (
        <div className="text-center text-gray-500 pt-10">Loading...</div>
      ) : filteredSalaries.length === 0 ? (
        <div className="text-center text-gray-500">
          No salary records found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-300 ">
          <table className="w-full table-auto text-sm text-left text-gray-700">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Employee ID</th>
                <th className="px-4 py-2">Basic Salary</th>
                <th className="px-4 py-2">Allowances</th>
                <th className="px-4 py-2">Deductions</th>
                <th className="px-4 py-2">Net Salary</th>
                <th className="px-4 py-2">Effective From</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.map((salary, index) => (
                <tr key={salary._id} className="even:bg-purple-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{salary.employeeId.employeeId}</td>
                  <td className="px-4 py-2">₹{salary.basicSalary ?? "N/A"}</td>
                  <td className="px-4 py-2">₹{salary.allowances || 0}</td>
                  <td className="px-4 py-2">₹{salary.deductions || 0}</td>
                  <td className="px-4 py-2 font-semibold text-green-700">
                    ₹{salary.netSalary}
                  </td>
                  <td className="px-4 py-2">
                    {salary.effectiveFrom
                      ? new Date(salary.effectiveFrom).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

  );
};

export default ViewSalary;

 