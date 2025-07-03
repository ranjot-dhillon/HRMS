import React from 'react';
import { useAuth } from '../../context/authContext';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Dashboard/AdminSidebar';
import Navbar from '../components/Dashboard/Navbar';
import AdminSummary from '../components/Dashboard/AdminSummary';

const AdminDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      {/* Sidebar is fixed */}

      <div className='flex p-0'>
      <Sidebar />
      <div className='ml-75 flex-1 min-h-screen bg-gray-100'>
        <Navbar/>
        <div className='ml-0 pt-3 pr-3 mt-16 rem bg-gray-300 h-screen'>
          {/* <AdminSummary/> */}
          <Outlet/>
        </div>
        
      </div>
      
     
     </div>
    </>
  );
};

export default AdminDashboard;
