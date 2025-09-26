import express, { json } from "express";
import cors from "cors";
import authRoute from "./routes/auth.js";
import departmentRoute from "./routes/department.js";
import employeeRoute from "./routes/employee.js";
import salaryRoute from "./routes/salary.js";
import connetToDatabase from "./Db/db.js";
import leaveRoute from "./routes/leaves.js";
import queryRoute from "./routes/query.js";
import attendanceRoute from "./routes/attendance.js";
import taskRoute from "./routes/taskReminder.js";
import notificationRoute from "./routes/notification.js";
import adminRoute from "./routes/adminDashboard.js";
import policyRoute from "./routes/PolicyRoute.js";
connetToDatabase();
const app = express();
// app.use(express.json())
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors());
app.use(express.static("uploads"));

app.use("/api/auth", authRoute);
app.use("/api/department", departmentRoute);
app.use("/api/employee", employeeRoute);

app.use("/api/salary", salaryRoute);
app.use("/api/leave", leaveRoute);
app.use("/api/query", queryRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/task", taskRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/admin",adminRoute);
app.use("/api/policy",policyRoute);

app.listen(process.env.PORT, () => {
  console.log(`server is running at ${process.env.PORT}`);
});
