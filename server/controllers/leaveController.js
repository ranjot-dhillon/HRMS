import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import Notification from "../models/Notification.js";

const addLeave = async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { userId, leaveType, startDate, endDate, reason } = req.body;
    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res
        .status(400)
        .json({
          success: false,
          error: "employee not found in applying Leave",
        });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });
    newLeave.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: "in applying Leave" });
  }
};

const getLeaves = async (req, res) => {
  try {
    const {id} = req.params;
    console.log(id);
    // const leaves = await Leave.find({ employeeId:id});

    // if (!leaves) {
      const employee = await Employee.findOne({userId:id});
      console.log("employee is ",employee)
      const leaves = await Leave.find({employeeId:employee._id });
    // }
    console.log("all leaves fro employee",leaves);
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Leaves get server error" });
  }
};


const getLeavesforEmployee = async (req, res) => {
  try {
    const {id} = req.params;
    console.log(id);
    const leaves = await Leave.find({ employeeId:id});
    console.log("all leaves fro employee",leaves);
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Leaves get server error" });
  }
};


const getAllLeaves = async (req, res) => {
  try {
    const AppliedLeaves = await Leave.find().populate({
      path: "employeeId",
      populate: [
        {
          path: "userId", // populate the user from employee
          select: "name",
        },
        {
          path: "department",
          select: "dep_name",
        },
      ],
    });

    //   console.log("All queries",AppliedLeaves)
    return res.status(200).json({ success: true, AppliedLeaves });
  } catch (error) {
    console.error("❌ Error fetching leaves:", error);
    return res.status(500).json({ success: false, message: error.message });
    //   return res.status(500).json({success:false})
  }
};

const handleResponse = async (req, res) => {
  try {
    console.log(req.originalUrl);

    const {Id} = req.params;
    const {response,status} = req.body;

    console.log(Id);

    const leave = await Leave.findById(Id);
    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" });
    }

    // Create notification based on status
    if (status === "Approved") {
      await Notification.create({
        employeeId: leave.employeeId,
        title: "Leave Approved ✅",
        message: `Your leave for ${leave.startDate} has been approved.`,
        type: "leave",
      });
    } else if (status === "Rejected") {
      await Notification.create({
        employeeId: leave.employeeId,
        title: "Leave Rejected ❌",
        message: `Your leave for ${leave.startDate} has been rejected.`,
        type: "leave",
      });
    }

    // Update leave
    const updateData = { status };
    if (response && response.trim().length > 0) {
      updateData.response = response;
    }

    await Leave.findByIdAndUpdate(Id, updateData);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

const deleteOldLeaves = async (req, res) => {
  try {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const result = await Leave.deleteMany({
      createdAt: { $lt: fiveDaysAgo },
    });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} old leave(s) deleted.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export { addLeave, getLeaves, getAllLeaves, handleResponse, deleteOldLeaves, getLeavesforEmployee };
