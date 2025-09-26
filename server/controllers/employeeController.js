import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import Department from "../models/Department.js";
import { useParams } from "react-router-dom";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "employees", // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });


const addEmployee = async (req, res) => {
  try {
    // console.log("Incoming employee data:", req.body);
    // console.log("employeeId from request:", req.body.employeeId);
    // console.log("REQ BODY:", req.body);
    // console.log("REQ FILE:", req.file);
    if (!req.body.employeeId || req.body.employeeId.trim() === "") {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      salary = Number(req.body.salary),
      password,
      role,
      department,
    } = req.body;

    // Check manually before saving
    if (!name || !email || !employeeId || !password || !department || !salary) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const existingEmployee = await User.findOne({ email });
    if (existingEmployee) {
      return res
        .status(400)
        .json({ success: false, message: "Employee already exists" });
    }
    const existingEmpId = await Employee.findOne({ employeeId });
    if (existingEmpId) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID already exists" });
    }


    const newUser = new User({
      name,
      email,
      password,
      role,
      profileImage:req.file.path,
    });
    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      salary,
      department,
      profileImage:req.file.path ? req.file.filename : null,
    });

    await newEmployee.save();

    return res
      .status(200)
      .json({ success: true, message: "Employee added successfully" });
  } catch (error) {
    console.error("Error in addEmployee:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employeess = await Employee.find()
       .populate({
      path: "userId",
      match: { role: "employee" }, // ✅ only employees
      select: "-password",
    })
      .populate("department");
        const employees = employeess.filter(emp => emp.userId);
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get department server error" });
  }
};

const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee = await Employee.findById({ _id: id })
      .populate("userId", { password: 0 })
      .populate("department");
    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate("userId", { password: 0 })
        .populate("department");
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employee data error" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      maritalStatus,
      designation,
      salary = Number(req.body.salary),
      role,
      department,
    } = req.body;
    const employee = await Employee.findById({ _id: id });
    if (!employee) {
      return res
        .status(400)
        .json({ success: false, message: "Employee not found" });
    }
    const user = await User.findById({ _id: employee.userId });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const updateUser = await User.findByIdAndUpdate(
      { _id: employee.userId },
      { name }
    );
    const updateEmployee = await Employee.findByIdAndUpdate(
      { _id: id },
      {
        maritalStatus,
        salary,
        designation,
        department,
      },
      { new: true }
    );
    if (!updateEmployee || !updateUser) {
      return res
        .status(400)
        .json({ success: false, message: "document not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "employee updated successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "update employee error" });
  }
};

const fetchEmployeeByDepId = async (req, res) => {
  const { id } = req.params;
  try {
    const employees = await Employee.find({ department: id });
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employeeby dep id  server error" });
  }
};


// Update employee photo
export const updateEmployeePhoto = async (req, res) => {
  try {
    const id= req.params.id; // from route /api/employee/:id/photo
    const file = req.file;

   console.log("id recioved in update section",id);
    if (!file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    // Cloudinary URL
    const imageUrl = file.path;

    // Update both User and Employee
    const employee = await Employee.findOne({userId:id}).populate("userId");


    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Update employee record
    employee.profileImage = imageUrl;
    await employee.save();

    // Update linked user record
    if (employee.userId) {
      await User.findByIdAndUpdate(employee.userId._id, { profileImage: imageUrl });
    }

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      photo: imageUrl,
    });
  } catch (error) {
    console.error("Error updating photo:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};




export { addEmployee, upload, getEmployees, getEmployee, fetchEmployeeByDepId };
