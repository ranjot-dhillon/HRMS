import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import MonthlySalary from "../models/MonthlySalarySchema.js";
import axios from "axios";
import Query from "../models/Query.js";
import moment from "moment"; 
import Poll from "../models/Poll.js";
import User from "../models/User.js";


const getStats = async (req, res) => {
  try {
    // ✅ Await each countDocuments (they return a number directly)
    const totalEmployees = await Employee.countDocuments();
    const today=new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
     const endOfDay = new Date(today.setHours(23, 59, 59, 999));

const presentToday = await Attendance.countDocuments({
  date: { $gte: startOfDay, $lte: endOfDay }
});

const onLeaveToday = await Leave.countDocuments({
  date: { $gte: startOfDay, $lte: endOfDay },
  status: "Approved"
});
    const total = await MonthlySalary.countDocuments();
    const paid = await MonthlySalary.countDocuments({ status: "Paid" });

    const payrollPaidPct =
      total > 0 ? Math.round((paid / total) * 100) : 0;
      console.log("present",presentToday)
  console.log(totalEmployees)
    return res.status(200).json({
      totalEmployees,
      presentToday,
      onLeaveToday,
      payrollPaidPct,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return res
      .status(500)
      .json({ success: false, error: error.message });
  }
};




const API_KEY = "AIzaSyCe5rxCyUglIrsGsJdX3fmOJsVKWGfgF_I";
const CALENDAR_ID = "en.indian%23holiday%40group.v.calendar.google.com"; // URL-encoded

const getHolidays = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const timeMin = `${year}-01-01T00:00:00Z`;
    const timeMax = `${year}-12-31T23:59:59Z`;

    const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

    const response = await axios.get(url);
    const holidays = response.data.items.map(event => ({
      name: event.summary,
      date: event.start.date,
    }));

    res.json({ success: true, holidays });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const getCounts=async(req,res)=>{
 try {
      const today=new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
     const endOfDay = new Date(today.setHours(23, 59, 59, 999));
   const total=await Attendance.countDocuments(
      {  date: { $gte: startOfDay, $lte: endOfDay },
    })
     const checkedIn=await Attendance.countDocuments(
      { 
         date: { $gte: startOfDay, $lte: endOfDay },
        //  checkIn:new Date()
    })
    // console.log(checkedIn)
    const notCheckedIn=total-checkedIn;
    const leaveRequest = await Leave.countDocuments({
  // date: { $gte: startOfDay, $lte: endOfDay },
  status: "Pending"
});

   const query=await Query.countDocuments({new:true})

   const todayday=moment()
   const onemonth=moment().add(1, "month");

   const employees= await Employee.find({
    dob: { $gte: todayday, $lte: onemonth },
    
   }).populate("userId")
     const formatted = employees.map(b => ({
      name: b.userId.name,
      date: moment(b.dob).format("MMM DD"),
    }));

    today.setHours(0, 0, 0, 0);

    // get date 7 days ago
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    // fetch attendance in range
    const records = await Attendance.find({
      date: { $gte: sevenDaysAgo, $lte: today }
    });

    // prepare structure for 7 days
    const result = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(sevenDaysAgo);
      currentDay.setDate(sevenDaysAgo.getDate() + i);

      const dayLabel = currentDay.toLocaleDateString("en-US", { weekday: "short" });

      // count how many checked in this day
      const presentCount = records.filter(
        r => new Date(r.date).toDateString() === currentDay.toDateString()
      ).length;

      result.push({ day: dayLabel, present: presentCount });
    }

   return res.status(200).json({checkedIn,notCheckedIn,leaveRequest,query,formatted,result})
  
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
  
 }
}

export { getStats,getHolidays,getCounts};
