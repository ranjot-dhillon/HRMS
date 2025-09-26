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
import List from "./components/employee/List.jsx";
import Add from "./components/employee/Add.jsx";
import View from "./components/employee/View.jsx";
import Edit from "./components/employee/Edit.jsx";
import AddSalary from "./components/Salary/Add.jsx";
import ViewSalary from "./components/Salary/ViewSalary.jsx";
import EmployeeSalary from "./components/Salary/EmployeeSalary.jsx";
import EmployeeSummary from "./components/Employee-Dashboard/EmployeeSummary.jsx";
import { useAuth } from "../context/authContext.jsx";
import LeaveList from "./components/leave/LeaveList.jsx";
import LeaveForm from "./components/leave/LeaveForm.jsx";
import Salaries from "./components/Salary/Salaries.jsx";
import AddQuery from "./components/Query/AddQuery.jsx";
import ViewQuery from "./components/Query/ViewQuery.jsx";
import LeaveTable from "./components/leave/LeaveTable.jsx";
import LeaveHistoryForAdmin from "./components/leave/LeaveListForAdmin.jsx";
import ReminderCard from "./components/Dashboard/ReminderCard.jsx";
import AdminCommunity from "./components/Community/Community";
import AdminSettings from "./components/Setting/AdminSetting";
import EmployeeSettings from "./components/Setting/EmployeeSetting";

function App() {
  const [count, setCount] = useState(0);
  const { user } = useAuth;

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Navigate to="admin-dashboard" />}></Route> */}
        <Route
          path="/"
          element={
            user?.role === "admin" ? (
              <Navigate to="/admin-dashboard" />
            ) : user?.role === "employee" ? (
              <Navigate to="/employee-dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
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
          <Route path="department/:id" element={<EdDepartment />}></Route>
          <Route path="add-department" element={<AddDepartment />}></Route>
          <Route path="/admin-dashboard/salary" element={<Salaries />}></Route>
          <Route path="employee" element={<List />}></Route>
          <Route path="/admin-dashboard/add-employee" element={<Add />}></Route>
          <Route path="employee/:id" element={<View />}></Route>
          <Route
            path="/admin-dashboard/employee/edit/:id"
            element={<Edit />}
          ></Route>
          <Route
            path="/admin-dashboard/employee/salary/:id"
            element={<ViewSalary />}
          ></Route>
          <Route
            path="/admin-dashboard/viewQuery"
            element={<ViewQuery />}
          ></Route>
          <Route
            path="/admin-dashboard/employee/Leaves/:id"
            element={<LeaveHistoryForAdmin />}
          ></Route>

          <Route
            path="/admin-dashboard/leaves"
            element={<LeaveTable />}
          ></Route>

          <Route
            path="/admin-dashboard/salary/add"
            element={<AddSalary />}
          ></Route>
            <Route
            path="/admin-dashboard/community"
            element={<AdminCommunity />}
          ></Route>
          <Route
            path="/admin-dashboard/settings"
            element={<AdminSettings />}
          ></Route>
        </Route>
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoute requireRole={["employee"]}>
                <EmployeeDashboard />
              </RoleBasedRoute>
            </PrivateRoutes>
          }
        >
          <Route index element={<EmployeeSummary />}></Route>
          <Route path="myProfile/:id" element={<View />}></Route>
          <Route path="leaves" element={<LeaveList />}></Route>
          <Route path="add-leave" element={<LeaveForm />}></Route>
          <Route path="salary/:id" element={<EmployeeSalary />}></Route>
          <Route path="raiseQuery" element={<AddQuery />}></Route>
          <Route path="employeeSettings" element={<EmployeeSettings/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
