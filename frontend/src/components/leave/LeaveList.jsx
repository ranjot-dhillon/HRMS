// import React from 'react'

// const LeaveList = () => {
//   return (
//     <>
//     <div className='p-6'>
//         <div className='text-center'>
//             <h3 className='text-2xl font-bold'>Manage Employee</h3>
//         </div>
//         <div className='flex'>
//           <div>
//             <input type='text'placeholder='Search '

//         </div>

//     </div>


//     </>
//   )
// }

// export default LeaveList
// EmployeeLeave.jsx
import React from 'react';
import LeaveForm from './LeaveForm';
import LeaveHistory from './LeaveHistory';
import LeaveBalance from './LeaveBalance';
import { Link } from 'react-router-dom';

function LeaveList() {
  return (
    <div className="p-4 px-5 pl-8">
      <h2 className="text-center text-2xl font-bold mb-4">My Leave Management</h2> 

      <div className='flex justify-between items-center'>
        <input type='text' placeholder='Enter type of Leave' className='px-1 py-0.5 border'/>
    <Link to="/employee-dashboard/add-leave" className='px-1 py-2 bg-purple-600 text-white rounded'>Apply for Leave</Link>
    </div>
    <div className='py-5'>
      <LeaveHistory />
    </div>
      
    
    </div>
  );
}

export default LeaveList;