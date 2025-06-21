import React from 'react';
import { useAuth } from '../../context/authContext';
import { Navigate } from 'react-router-dom';
import AdminSidebar from '../components/Dashboard/AdminSidebar';
import Navbar from '../components/Dashboard/Navbar';
import AdminSummary from '../components/Dashboard/AdminSummary';

function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className='flex-1'>
      <AdminSidebar />
      <div className='flex-1 ml-64 bg-gray-100 h-screen'>
      <Navbar />
      {/* Main content can go here */}
      <AdminSummary/>
      </div>
    </div>
  );
}

export default AdminDashboard;
