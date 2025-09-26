import Employee from "../models/Employee.js";
import Notification from "../models/Notification.js";

// const notifications=async(req,res)=>{
//     try {
//         const {id}=req.params
//         console.log(id)
//         const employee=await Employee.findOne({employeeId:id});
//        if(!employee){
//         return res.status(400).json({success:false,error:"employee not found in applying Leave"})
//        }
//        console.log(employee)
//       const empId=employee.employeeId

//     const notifications = await Notification.find({ employeeId:empId})
//       .sort({ createdAt: -1 });

//     res.json(notifications);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching notifications" });
//   }
// }
const notifications = async (req, res) => {
  try {
    const { id } = req.params; // ✅ from URL
    console.log("Received ID:", id);

    const employee = await Employee.findOne({ userId: id }); // ✅ query by _id
    if (!employee) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Employee not found in applying Leave",
        });
    }

    const empId = employee._id; // ✅ employeeId is just a value
    console.log("Employee ID:", empId);

    const notifications = await Notification.find({
      employeeId: empId,
      isRead: false,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Error fetching notifications" });
  }
};

const markAllRead = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({ userId: id });
    if (!employee) {
      return res
        .status(400)
        .json({
          success: false,
          error: "employee not found in applying Leave",
        });
    }
    console.log(employee);
    await Notification.updateMany(
      { employeeId: employee._id, isRead: false },
      { $set: { isRead: true } }
    );
    const notifications = await Notification.find({
      employeeId: employee._id,
      isRead: false,
    }).sort({ createdAt: -1 });

    res.json(notifications);

    // res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Error updating notifications" });
  }
};

export { notifications, markAllRead };
