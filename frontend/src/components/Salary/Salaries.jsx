
// LeaveHistory.jsx
import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import { Link } from 'react-router-dom';
import { FaQuestionCircle } from "react-icons/fa"; // At top of your component


const Salaries = () => {
  let Sno=1;
  const [salaries,setSalaries]=useState([]);
  const [newQueryCount,setNewQueryCount]=useState('')
    // const [filteredSalaries, setFilteredSalaries] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const { id } = useParams();
    const {user}=useAuth()

    const fetchSalaries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/Salary", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        if (response.data.success) {
          setSalaries(response.data.salaries);
          console.log("Slaries",salaries)
          // setFilteredSalaries(response.data.salary);
        }
      } catch (error) {
        alert(error?.response?.data?.message || error.message);
      } 
    };
     const fetchQueryCount = async () => {
          try {
            const res = await axios.get("http://localhost:3000/api/query/newCount", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            });
            if (res.data.success) {
              setNewQueryCount(res.data.count);
            }
          } catch (err) {
            console.error("Failed to fetch new query count", err);
          }
        };
        
  
    useEffect(() => {
      fetchSalaries();
      fetchQueryCount()
      // eslint-disable-next-line
    }, []);

  

  return (
    <div className="bg-white rounded shadow p-5 m-8">
      <h3 className=" text-3xl  text-center font-semibold mb-2">Salaries</h3>

       <div className="flex justify-between items-center ml-0">
                  <input
                    type="text"
                    placeholder="Filter By status"
                    className="px-4 py-0.5 border-1"
                  />
                  <div className="flex gap-3">
                  <Link
                    to="/admin-dashboard/viewQuery"
                   className="relative flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                       >
                  <FaQuestionCircle className="text-white" />
                   Queries
                    {newQueryCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full text-xs px-2">
            {newQueryCount}
          </span>
        )}
                  </Link>
                  <Link
                    to="/admin-dashboard/salary/add"
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Add Salary Details
                  </Link>
                  </div>


                </div>


      <table className="w-full table-auto text-sm mt-5 ">
        <thead>
          <tr className="bg-gray-200">
            <th className='p-2'>Sno</th>
            <th className="p-2">EmployeeId</th>
            <th className="p-2">Month</th>
            <th className="p-2">Total</th>
            <th className="p-2">PaidOn</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map((salary, index) => (
            <tr key={index} className="text-center border-t">
              <td className='p-2'>{Sno++}</td>
              <td className="p-2">{salary.employeeId?.employeeId || "N/A"}</td>
              <td className="p-2">{salary.month}</td>
              <td className="p-2">{salary.total}</td>
              <td className="p-2">{new Date(salary.paidOn).toLocaleDateString() }</td>
              <td className="p-2 text-green-600 font-medium">{salary.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Salaries;
