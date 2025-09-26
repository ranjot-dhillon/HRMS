import express from "express";
import verifyUser from "../middleware/authMiddleware.js";
import {
  addTask,
  completeTask,
  deleteTask,
  getTask,
} from "../controllers/TaskReminderController.js";
const route = express.Router();

route.post("/", verifyUser, addTask);
route.get("/", verifyUser, getTask);
route.delete("/:id", verifyUser, deleteTask);
route.put("/:id", verifyUser, completeTask);

export default route;
