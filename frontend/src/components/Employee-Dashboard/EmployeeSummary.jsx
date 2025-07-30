import React, { useEffect, useState ,useRef} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/authContext";

const EmployeeSummary = () => {
  const [employee, setEmployee] = useState({});
  const [newQuery,setNewQuery]=useState("")
  const [overview, setOverview] = useState({
    presentDays: 0,
    leaveBalance: 0,
    lastSalary: 0,
  });
  const [notices, setNotices] = useState([]);
  const {user}=useAuth()

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const empRes = await axios.get("/api/employee/profile");
//         const overviewRes = await axios.get("/api/employee/overview");
//         const noticeRes = await axios.get("/api/notices");

//         setEmployee(empRes.data);
//         setOverview(overviewRes.data);
//         setNotices(noticeRes.data);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       }
//     };

//     fetchData();
//   }, []);
const hasAlerted = useRef(false);
useEffect(() => {
   
  const fetchQueries = async () => {
    // console.log(user._id)
    if (hasAlerted.current) return; // ✅ Prevent multiple alerts
    hasAlerted.current = true;
    const res = await axios.get(`http://localhost:3000/api/query/resolvedQuery/${user._id}`,
       {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
    );
    console.log(res)
    const latestQuery = res.data?.resolvedQueries;
    // const latestQuery = (res.data.resolvedQueries)[0];

      // if (!queries || queries.length === 0) return;

      // ✅ Sort queries by createdAt in descending order 
      // const latestQuery =  queries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      if(latestQuery.length>0){
      if (latestQuery.status === "Resolved" && latestQuery.new === true) {
        // alert(`✅ Your latest query has been resolved:\nMessage: ${latestQuery.message}\nReply: ${latestQuery.response}`);
        setNewQuery(latestQuery)
      }
    }

  };
  fetchQueries();
}, [user._id]);

const deleteQuery=async()=>{
 try {
   const response = await axios.delete(`http://localhost:3000/api/query/deleteQuery/${user._id}`,
       {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
    );
    if(response.data.success){
    setNewQuery(null);
      window.location.reload()

    }

  
 } catch (error) {
  console.log(error)
  
 }
}


  return (
    <>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-purple-800 mb-4">
        Welcome, {employee.name || "Employee"} 👋
      </h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded shadow-md border-l-4 border-purple-500">
          <h3 className="text-sm text-gray-500">Present Days</h3>
          {/* <p className="text-2xl font-semibold">{overview.presentDays}</p> */}
        </div>
        <div className="bg-white p-5 rounded shadow-md border-l-4 border-purple-500">
          <h3 className="text-sm text-gray-500">Leave Balance</h3>
          {/* <p className="text-2xl font-semibold">{overview.leaveBalance} days</p> */}
        </div>
        <div className="bg-white p-5 rounded shadow-md border-l-4 border-purple-500">
          <h3 className="text-sm text-gray-500">Last Salary</h3>
          {/* <p className="text-2xl font-semibold">₹{overview.lastSalary}</p> */}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link to="/employee/profile" className="bg-purple-100 p-4 rounded hover:bg-purple-200">
          👤 My Profile
        </Link>
        <Link to="/employee/salary" className="bg-purple-100 p-4 rounded hover:bg-purple-200">
          💰 Salary Slips
        </Link>
        <Link to="/employee/apply-leave" className="bg-purple-100 p-4 rounded hover:bg-purple-200">
          📝 Apply for Leave
        </Link>
      </div>

      {/* Notices */}
      {/* <div className="bg-white p-5 rounded shadow">
        <h3 className="text-xl font-semibold text-purple-700 mb-3">📢 Announcements</h3>
        {notices.length === 0 ? (
          <p className="text-gray-500">No announcements available.</p>
        ) : (
          <ul className="space-y-2">
            {notices.map((notice) => (
              <li key={notice._id} className="border-b pb-2 text-gray-700">
                <strong>{notice.title}</strong> – {notice.description}
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
     {newQuery && (
      <div className="fixed bottom-5 items-center right-5 bg-white border border-gray-300 shadow-lg rounded-lg p-4 w-80 z-50 animate-fadeInUp">
        <div className="font-semibold text-green-600">✅ Query Resolved</div>
        <div className="mt-2 text-sm text-gray-700">
          <p><strong>Message:</strong> {newQuery.message}</p>
          <p><strong>Reply:</strong> {newQuery.response}</p>
        </div>
        <button
          className="mt-3 text-sm text-blue-600 hover:underline"
          onClick={()=>deleteQuery()}
        >
          Close
        </button>
      </div>
     )}
     
</>
  );
};

export default EmployeeSummary;
