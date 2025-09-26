import Employee from "../models/Employee.js";
import Query from "../models/Query.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

const addQuery = async (req, res) => {
  try {
    const { Id, message, month } = req.body;
    // const userId=Id;
    const employee = await Employee.findOne({ userId: Id });
    if (!employee) {
      return res
        .status(400)
        .json({ success: false, message: "employee not found" });
    }
    const newQuery = new Query({
      employeeId: employee._id,
      message: message,
      forMonth: month,
    });
    newQuery.save();
    return res.status(200).json({ success: true, message: "query submitted" });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error in adding query",
      });
  }
};

const getAllQueries = async (req, res) => {
  try {
    const Queries = await Query.find({ status: "Pending" }).populate({
      path: "employeeId",
      populate: {
        path: "userId", // populate the user from employee
        select: "name", // only get username
      },
    });

    // console.log("All queries",Queries)
    return res.status(200).json({ success: true, Queries });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};
const resolveQuery = async (req, res) => {
  try {
    const id = req.params;
    const { Id } = req.body;
    const { response } = req.body;
    console.log(id);
    console.log(Id);
    const query = await Query.findById({ _id: Id });
    await Notification.create({
      employeeId: query.employeeId,
      title: "Salary Query Resolved 💰",
      message: "Your salary query has been resolved by HR.",
      type: "salary",
    });

    const update = await Query.findByIdAndUpdate(Id, {
      response,
      status: "Resolved",
      new: false,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: true, error: "in handling response" });
  }
};
const getResolvedQueries = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({ userId: id });
    // console.log(employee)
    if (!employee) {
      return res
        .status(400)
        .json({ success: false, message: "employee not found" });
    }
    // console.log(id)
    const resolvedQueries = await Query.find({
      employeeId: employee._id,
      status: "Resolved",
    }).sort({ updatedAt: -1 });
    // console.log("queries",resolvedQueries)
    return res.status(200).json({ success: true, resolvedQueries });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({ userId: id });
    console.log(employee);
    if (!employee) {
      return res
        .status(400)
        .json({ success: false, message: "employee not found" });
    }
    // console.log(id)
    const resolvedQueries = await Query.deleteMany({
      employeeId: employee._id,
      status: "Resolved",
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

const deletePendingQuery = async (req, res) => {
  try {
    const { id } = req.params;
    //   const{response}=req.body;
    const update = await Query.deleteMany({ _id: id });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: true, error: "in handling response" });
  }
};

const getQueryCount = async (req, res) => {
  try {
    const count = await Query.countDocuments({ new: true });
    return res.status(200).json({ success: true, count });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export {
  addQuery,
  getAllQueries,
  resolveQuery,
  getResolvedQueries,
  deleteQuery,
  deletePendingQuery,
  getQueryCount,
};
