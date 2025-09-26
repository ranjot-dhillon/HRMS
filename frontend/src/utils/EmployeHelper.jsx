import axios from "axios";
import { useNavigate } from "react-router-dom";

export const fetchDepartment = async () => {
  let departments;
  try {
    const response = await axios.get("http://localhost:3000/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    // console.log("Fetched departments:", response.data.departments);
    if (response.data.success) {
      departments = response.data.departments;
    }
  } catch (error) {
    if (error.response) alert(error.response.data.error);
  }
  return departments;
};

// Employee for slary

export const getEmployees = async (id) => {
  let employees;
  try {
    const response = await axios.get(
      `http://localhost:3000/api/employee/department/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("Fetched response:", response);
    if (response.data.success) {
      employees = response.data.employees;
    }
  } catch (error) {
    if (error.response) alert(error.response.data.error);
  }
  return employees;
};
