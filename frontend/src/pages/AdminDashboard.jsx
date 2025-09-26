import React from "react";
import { useAuth } from "../../context/authContext";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/AdminSidebar";
import Navbar from "../components/Dashboard/Navbar";
import AdminSummary from "../components/Dashboard/AdminSummary";

const AdminDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      {/* Sidebar is fixed */}

      <div className="flex flex-col min-h-screen overflow-hidden">
        {/* Navbar */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-[#6A1B9A] z-50">
          {/* Navbar content */}
          <Navbar />
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1 pt-16">
          {/* Sidebar */}
          <aside className=" bg-[#4A148C] h-[calc(100vh-4rem)] fixed top-16 left-0">
            {/* Sidebar content */}
            <Sidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 ml-[240px] bg-[#F3E5F5] pl-5 overflow-y-auto">
            {/* Page content */}
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
