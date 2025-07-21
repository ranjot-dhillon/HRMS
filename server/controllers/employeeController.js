import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import Department from "../models/Department.js";
import { LuRotateCwSquare } from "react-icons/lu";
import {  useParams } from 'react-router-dom';
 

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/uploads")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})
const upload =multer({storage:storage})
const addEmployee = async (req, res) => {
  try {
     console.log("Incoming employee data:", req.body);
     console.log("employeeId from request:", req.body.employeeId);
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);
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
      salary=Number(req.body.salary),
      password,
      role,
      department,
    } = req.body;

    // Check manually before saving
    if (!name || !email || !employeeId || !password || !department || !salary) {
      console.log("Missing required fields");
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existingEmployee = await User.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ success: false, message: "Employee already exists" });
    }
    const existingEmpId = await Employee.findOne({ employeeId });
    if (existingEmpId) {
  return res.status(400).json({ success: false, message: "Employee ID already exists" });
}

    const newUser = new User({ name, email, password, role,profileImage: req.file?.filename });
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
      profileImage: req.file ? req.file.filename : null,
    });

    await newEmployee.save();

    return res.status(200).json({ success: true, message: "Employee added successfully" });
  } catch (error) {
    console.error("Error in addEmployee:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

const getEmployees= async (req,res)=>{
 try {
    const employees=await Employee.find().populate("userId",{password:0}).populate("department")
    return res.status(200).json({success:true,employees})
    
  } catch (error) {
    return( res.status(500).json({success:false,error:"get department server error"}))
    
  }
}


const getEmployee= async (req,res)=>{
  const {id}=req.params;
 try {
    const employee=await Employee.findById({_id: id}).populate("userId",{password:0}).populate("department")
    return res.status(200).json({success:true,employee})
    
  } catch (error) {
    return( res.status(500).json({success:false,error:"get department server error"}))
    
  }
}

export const updateEmployee=async(req,res)=>{
  try{
  const{id}=req.params;
   const {
      name,
      maritalStatus,
      designation,
      salary=Number(req.body.salary),
      role,
      department,
    } = req.body;
    const employee=await Employee.findById({_id:id})
    if(!employee)
    {
       return res.status(400).json({ success: false, message: "Employee not found" });
    }
    const user=await User.findById({_id:employee.userId})
    if(!user){
       return res.status(400).json({ success: false, message: "User not found" });
    }
    const updateUser=await User.findByIdAndUpdate({_id:employee.userId},{name});
    const updateEmployee=await Employee.findByIdAndUpdate(  { _id: id },
  {
    maritalStatus,
    salary,
    designation,
    department,
  },
  { new: true }
);
    if(!updateEmployee||!updateUser)
    {
        return res.status(400).json({ success: false, message: "document not found" });
    }
    return res.status(200).json({success:true,message:"employee updated successfully"})
  }
  catch(error){
    return res.status(400).json({success:false,message:"update employee error"}) 
  }



}


const fetchEmployeeByDepId=async(req,res)=>{
    const {id}=req.params;
 try {
    const employees=await Employee.find({department: id})
    return res.status(200).json({success:true,employees})
    
  } catch (error) {
    return( res.status(500).json({success:false,error:"get employeeby dep id  server error"}))
    
  }

}
export {addEmployee,upload,getEmployees,getEmployee,fetchEmployeeByDepId};