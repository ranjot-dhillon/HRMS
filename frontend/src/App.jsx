import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import RoleBasedRoute from "./utils/RoleBasedRoute.jsx";
import AdminSummary from "./components/Dashboard/AdminSummary.jsx";
import Department from "./components/Departments/Department.jsx";
import AddDepartment from "./components/Departments/AddDepartment.jsx";
// import EditDepartment from './components/Departments/EditDepartment.jsx'
// import EditDepartment from './components/Departments/EditDepartment.jsx'
import EdDepartment from "./components/Departments/EdDepartment.jsx";
function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="admin-dashboard" />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoute requireRole={["admin"]}>
                <AdminDashboard />
              </RoleBasedRoute>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />}></Route>
          <Route path="departments" element={<Department />}></Route>
          <Route path="add-department" element={<AddDepartment />}></Route>
          <Route path="department/:id" element={<EdDepartment />}></Route>
          <Route
            path="/admin-dashboard/employees"
            element={<Department />}
          ></Route>
          <Route
            path="/admin-dashboard/leaves"
            element={<Department />}
          ></Route>
          <Route
            path="/admin-dashboard/salary"
            element={<Department />}
          ></Route>
          <Route
            path="/admin-dashboard/settings"
            element={<Department />}
          ></Route>
        </Route>
        <Route
          path="/employee-dashboard"
          element={<EmployeeDashboard />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
