import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const RoleBasedRoute = ({ children, requireRole }) => {
  const { user, loading } = useAuth();
  console.log("User role:", user.role);
  console.log("Required:", requireRole);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (!requireRole.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RoleBasedRoute;
