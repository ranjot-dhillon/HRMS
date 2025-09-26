import Employee from "../models/Employee.js";
import User from "../models/User.js";

import multer from "multer";
import path from "path";
import Department from "../models/Department.js";
import { LuRotateCwSquare } from "react-icons/lu";
import { useParams } from "react-router-dom";



import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
 


function generatePassword(length = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function generateEmployeeId(length = 8) {
  const chars = "0123456789";
  let employeeid = "";
  for (let i = 0; i < length; i++) {
    employeeid += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return employeeid;
}

function createOfferLetterBuffer(employee) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // ===== HEADER WITH BACKGROUND =====
      doc.rect(0, 0, doc.page.width, 100).fill("#1e90ff"); // blue header
      doc.fillColor("white").fontSize(20).text("Tech Solutions Pvt Ltd", 50, 40);

      doc.fillColor("white").fontSize(10).text("403, Lane A-5, Nivriti Nagar", 400, 30, { align: "right" });
      doc.text("Vadgaon BK-411041 Pune, India", 400, 45, { align: "right" });
      doc.text("info@TechSolutions.com", 400, 60, { align: "right" });

      doc.moveDown(4);
      doc.fillColor("black"); // Reset text color

      // ===== BORDER LINE =====
      doc.moveTo(50, 120).lineTo(doc.page.width - 50, 120).strokeColor("#1e90ff").lineWidth(2).stroke();

      doc.moveDown(2);

      // ===== LETTER INFO =====
      doc.fontSize(11).fillColor("black").text(`Ref No: ${employee.employeeId}`, { align: "left" });
      doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });
      doc.moveDown(2);

      // ===== CANDIDATE INFO =====
      doc.font("Helvetica-Bold").fontSize(12).fillColor("#1e90ff").text(`${employee.name}`, { align: "left" });
      doc.font("Helvetica").fillColor("black").text(`${employee.email}`);
      doc.moveDown(2);

      // ===== BODY =====
      doc.fontSize(12).text(`Dear ${employee.name},`, { underline: true });
      doc.moveDown();

      doc.text(
        `We are pleased to offer you the position of ${employee.designation} at Tech Solutions Pvt Ltd.
Your joining date is ${"TBD"}, and your CTC will be ${employee.salary || "As per company standards"} LPA.`,
        { align: "justify" }
      );

      doc.moveDown();
      doc.text(
        `Please note that this appointment is subject to the company's rules and policies. Kindly accept this letter as confirmation of your appointment.`
      );

      doc.moveDown(2);
      doc.text(
        `We look forward to welcoming you and wish you success in your journey with us.`,
        { italic: true }
      );

      // ===== SIGNATURE =====
      doc.moveDown(4);
      doc.text("Warm Regards,", { align: "left" });
      doc.text("HR Manager", { align: "left" });
      doc.text("Tech Solutions Pvt Ltd", { align: "left" });

      // ===== FOOTER =====
      doc.rect(0, doc.page.height - 50, doc.page.width, 50).fill("#1e90ff");
      doc.fillColor("white").fontSize(10).text("This is a system-generated document.", 50, doc.page.height - 35);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}





// Utility function to send email
async function sendOfferEmail(employee, pdfBuffer, plainPassword) {
   console.log("Incoming employee data in email fuction:", employee.email);
  const transporter = nodemailer.createTransport({
    service: "gmail", // or SMTP config
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  await transporter.sendMail({
  from: `"HRMS Team" <${process.env.EMAIL_USER}>`,
  to: employee.email,
  subject: "Offer Letter",
  text: `Dear ${employee.name},

We are delighted to share with you your official Offer Letter, attached to this email. 

Along with your offer, we have also created your HRMS account. Please find your login credentials below:

Email: ${employee.email}
Password: ${plainPassword}

For security reasons, we strongly recommend that you log in and update your password upon your first login.

If you have any questions or face any issues accessing your account, feel free to reach out to the HR team.

Welcome aboard, and we look forward to working with you!

Warm regards,  
HRMS Team`,
  attachments: [
    {
      filename: "OfferLetter.pdf",
      content: pdfBuffer, // Attach directly from memory
    },
  ],
});
}



const addEmployee = async (req, res) => {
  try {
    // console.log("Incoming employee data:", req.body);
    // console.log("employeeId from request:", req.body.employeeId);
    // console.log("REQ BODY:", req.body);
    // console.log("REQ FILE:", req.file);
    // if (!req.body.employeeId || req.body.employeeId.trim() === "") {
    //   return res.status(400).json({ message: "Employee ID is required" });
    // }
    // Generate password & hash it
    const plainPassword = await generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const employeeid=await  generateEmployeeId();
    console.log("id generated",employeeid)
    const {
      name,
      email,
      dob,
      gender,
      maritalStatus,
      designation,
      salary = Number(req.body.salary),
      role,
      department,
    } = req.body;

   

    // Check manually before saving
    if (!name || !email || !department) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
     console.log("Incoming employee data:", req.body);

    const existingEmployee = await User.findOne({email});
    if (existingEmployee) {
      return res
        .status(400)
        .json({ success: false, message: "Employee already exists" });
    }
    const existingEmpId = await Employee.findOne({ employeeid });
    if (existingEmpId) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID already exists" });
    }


    const newUser = new User({
      name,
      email,
      password:hashedPassword,
      role,
      firstLogin: true,
    });
    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId:employeeid,
      dob,
      email,
      gender,
      maritalStatus,
      designation,
      salary,
      department,
      // profileImage:req.file.path ? req.file.filename : null,
    });

    await newEmployee.save();

    const employee = {
  name,
  email,
  employeeid,
  dob,
  gender,
  maritalStatus,
  designation,
  salary: Number(salary), // ✅ transform here
  plainPassword,
  role,
  department,
};


    // Generate Offer Letter PDF in memory
    const pdfBuffer = await createOfferLetterBuffer(employee);

    // Send Email with attachment
    await sendOfferEmail(employee, pdfBuffer, plainPassword);

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
export {addEmployee}