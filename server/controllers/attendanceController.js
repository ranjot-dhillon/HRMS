// controllers/attendanceController.js
import Attendance from "../models/Attendance.js";
import moment from "moment";
import Employee from "../models/Employee.js";
import axios from "axios";
import dayjs from "dayjs";

// ✅ Clock In

const clockIn = async (req, res) => {
  try {
    const { imageBase64, Id } = req.body;
    console.log(Id);

    const employee = await Employee.findOne({ userId: Id });
    //   if(!employee)
    // {
    //    return res.status(400).json({success:false,message:"employee not found"})
    // }
    console.log(employee);
    if (!employee || !employee.profileImage) {
      return res.status(404).json({ message: "Profile image not found" });
    }
    const today = moment().startOf("day");

    // Face verification
    //  const aiResponse = await axios.post("http://localhost:5001/verify-face", {
    //   employeeId:employee._id,
    //   image: imageBase64
    // });

    // if (!aiResponse.data.success || !aiResponse.data.verified) {
    //   return res.status(403).json({ message: "Face verification failed" });
    // }
    try {
      // console.log("Base64 length:", imageBase64);

      // console.log(employee.profileImage)
      const aiResponse = await axios.post(
        "http://localhost:5001/verify-face",
        {
          employeeId: employee._id,
          image: imageBase64,
          referenceImage: employee.profileImage,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("AI Response:", aiResponse.data);
      if (aiResponse.data.confidence > 30) {
        let record = await Attendance.findOne({
          employeeId: employee._id,
          date: {
            $gte: today.toDate(),
            $lte: moment(today).endOf("day").toDate(),
          },
        });

        if (record)
          return res.status(400).json({ message: "Already clocked in today" });

        record = new Attendance({
          employeeId: employee._id,
          date: new Date(),
          checkIn: new Date(),
          aiVerification: {
            method: "face",
            confidence: aiResponse.data.confidence,
            verified: true,
          },
          // location,
          // deviceInfo
        });
        // console.log(record)

        await record.save();
        return res.status(201).json({
          message: "Clock-in successful",
          aiResponse: aiResponse.data,
        });
      } else {
        return res.status(400).json({ message: "Face not match " });
      }
    } catch (error) {
      console.error(
        "AI verification failed:",
        error.response?.data || error.message
      );
      return res.status(500).json({ message: "AI verification failed" });
    }

    // Check if already clocked in today
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Clock Out
const clockOut = async (req, res) => {
  try {
    const { Id } = req.body;
    const totalHours = req.body.totalHours;
    //  console.log(hrs)
    const employee = await Employee.findOne({ userId: Id });
    if (!employee) {
      return res
        .status(400)
        .json({ success: false, message: "employee not found" });
    }
    // const { employeeId } = req.body;
    const today = moment().startOf("day");

    let record = await Attendance.findOne({
      employeeId: employee._id,
      checkOut:null
      // date: { $gte: today.toDate(), $lte: moment(today).endOf("day").toDate() },
    });
    // console.log(record)
    if (!record || !record.checkIn) {
      return res.status(400).json({ message: "You must clock in first" });
    }
    console.log("attanedce record",record)
    if (record.checkOut!==null) {
      // alert("You have already Chekout for today")
      return res.status(400).json({ message: "already chekout" });
    }

    record.checkOut = new Date();
    const hoursWorked = moment(record.checkOut).diff(
      moment(record.checkIn),
      "hours",
      true
    );
    record.totalHours = Math.round(hoursWorked * 100) / 100; // Round to 2 decimals

    // record.checkOut=new Date()
    // record.totalHours=totalHours;

    await record.save();
    res.status(200).json({ message: "Clock-out successful", record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Attendance Logs
const getAttendanceLogs = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const logs = await Attendance.find({ employeeId }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWeekData = async (req, res) => {
  try {
    const { Id } = req.params;
    const employee = await Employee.findOne({ userId: Id });
    if (!employee) {
      return res
        .status(400)
        .json({ success: false, message: "employee not found" });
    }

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekLabels = [];
    const weekDates = [];

    // Build last 5 days including today
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setHours(0, 0, 0, 0); // start of today local time
      date.setDate(date.getDate() - i);
      weekLabels.push(days[date.getDay()]);
      weekDates.push(
        new Date(date.getFullYear(), date.getMonth(), date.getDate())
      ); // local normalized
    }
    // console.log(weekLabels);
    // console.log(weekDates);

    // Fetch attendance records in range
    const records = await Attendance.find({
      employeeId: employee._id,
      date: {
        $gte: weekDates[0],
        $lte: weekDates[weekDates.length - 1],
      },
    });

    // Map totalHours to correct day
    const weekHours = weekDates.map((date) => {
      const record = records.find((r) => {
        const rDate = new Date(r.date);
        return (
          rDate.getFullYear() === date.getFullYear() &&
          rDate.getMonth() === date.getMonth() &&
          rDate.getDate() === date.getDate()
        );
      });
      return record ? record.totalHours : 0;
    });
    // console.log(weekHours);

    res.json({
      labels: weekLabels,
      datasets: [
        {
          label: "Hours Worked",
          data: weekHours,
          backgroundColor: "rgba(99, 102, 241, 0.6)",
          borderRadius: 10,
        },
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// routes/attendanceRoutes.js
/**
 * GET /api/attendance/department-summary
 * Returns department-wise count of present employees
 */
const depAttendance= async (req, res) => {
  try {
    // Step 1: Get all attendance records for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendanceRecords = await Attendance.find({
      date: { $gte: today, $lt: tomorrow },
    });

    // Step 2: Get employee details
    const employeeIds = attendanceRecords.map((a) => a.employeeId);
    const employees = await Employee.find({ _id: { $in: employeeIds } }).populate("department");

    // Step 3: Count by department
    const deptCount = {};
    employees.forEach((emp) => {
      const deptName = emp.department.dep_name || "Unknown"; // assuming dept model has name field
      deptCount[deptName] = (deptCount[deptName] || 0) + 1;
    });

    // Step 4: Convert into chart-friendly format
    const data = Object.keys(deptCount).map((dept) => ({
      name: dept,
      value: deptCount[dept],
    }));

    res.json(data);
  } catch (error) {
    console.error("Error fetching department-wise attendance:", error);
    res.status(500).json({ message: "Server error" });
  }

}


export { getAttendanceLogs, clockIn, clockOut, getWeekData, depAttendance};
