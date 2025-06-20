import React from 'react';
import { useAuth } from '../../context/authContext';
import { Navigate } from 'react-router-dom';
import AdminSidebar from '../components/Dashboard/AdminSidebar';
import Navbar from '../components/Dashboard/Navbar';

function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <AdminSidebar />
      <Navbar />
      {/* Main content can go here */}
    </div>
  );
}

export default AdminDashboard;
