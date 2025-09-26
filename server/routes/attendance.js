// routes/attendanceRoutes.js
import express from "express";
import {
  clockIn,
  clockOut,
  depAttendance,
  getAttendanceLogs,
  getWeekData,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/clock-in", clockIn);
router.post("/clock-out", clockOut);
router.get("/logs/:employeeId", getAttendanceLogs);
router.get("/weeklyData/:Id", getWeekData);
router.get("/depAttendance", depAttendance);

export default router;
