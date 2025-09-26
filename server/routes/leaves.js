import express from "express";
import verifyUser from "../middleware/authMiddleware.js";
import {
  addLeave,
  getAllLeaves,
  getLeaves,
  handleResponse,
   getLeavesforEmployee,
} from "../controllers/leaveController.js";

const route = express.Router();

route.post("/add", verifyUser, addLeave);
route.get("/appliedLeaves", verifyUser, getAllLeaves);
route.get("/:id", verifyUser, getLeaves);
route.get("/leaveForAdmin/:id", verifyUser, getLeavesforEmployee);
route.put("/responseLeave/:Id", verifyUser, handleResponse);

export default route;
