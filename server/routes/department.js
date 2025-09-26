import express from "express";
import verifyUser from "../middleware/authMiddleware.js";
import {
  addDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";

const route = express.Router();
route.get("/", verifyUser, getDepartments);
route.post("/add", verifyUser, addDepartment);
route.get("/:id", verifyUser, getDepartment);
route.put("/:id", verifyUser, updateDepartment);
route.delete("/:id", verifyUser, deleteDepartment);

export default route;
