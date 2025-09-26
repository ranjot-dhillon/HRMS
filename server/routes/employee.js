import express from "express";
import verifyUser from "../middleware/authMiddleware.js";
import {
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeeByDepId,
  updateEmployeePhoto,
} from "../controllers/employeeController.js";
import { addEmployee } from "../controllers/addEmployee.js";

const route = express.Router();
route.get("/", verifyUser, getEmployees);
route.post("/add", verifyUser, upload.single("image"), addEmployee);
route.get("/:id", verifyUser, getEmployee);
route.put("/:id", verifyUser, updateEmployee);
route.put("/photo/:id", upload.single("image"), updateEmployeePhoto);
route.get("/department/:id", verifyUser, fetchEmployeeByDepId);


export default route;
