// routes/employeeRoutes.js
import express from "express";
import Employee from "../models/Employee.js";
import Salary from "../models/Salary.js";
import nodemailer from "nodemailer";
import MonthlySalary from "../models/MonthlySalarySchema.js";

// Update employee bank details
const addSalaryDetail=async (req, res) => { 
  try {
    const {id}=req.params;
    console.log("id goted",id)
    const employee=await Employee.findOne({userId:id})
    const updated = await Employee.findByIdAndUpdate(
     employee._id,
      { bankDetails: req.body },
      { new: true }
    );
    res.json({ success: true, bankDetails: updated.bankDetails });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get employee details
// router.get("/me", async (req, res) => {
//   try {
//     const employee = await Employee.findById(req.user.id);
//     res.json(employee);
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });




// Run Payroll
const runPayRoll= async (req, res) => {
  try {
    // Find unpaid salaries
    const unpaidSalaries = await MonthlySalary.find({ status: "Unpaid" }).populate("employeeId");

    if (!unpaidSalaries.length) {
      return res.status(400).json({ success: false, message: "No unpaid salaries found" });
    }

    // Update status to Paid
    const updates = unpaidSalaries.map(async (salary) => {
      salary.status = "Paid";
      salary.paidOn = new Date();
      return salary.save();
    });
    await Promise.all(updates);

    // Calculate total payout
    const totalPayout = unpaidSalaries.reduce((acc, s) => acc + s.total, 0);

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to each employee
    for (let s of unpaidSalaries) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: s.employeeId.email,
        subject: "Salary Payment Confirmation",
        text: `Dear ${s.employeeId.name},\n\nYour salary of ₹${s.total} for ${s.month} has been credited.\n\nRegards,\nHR Team`,
      };
      await transporter.sendMail(mailOptions);
    }

    // Prepare bank email
    const bankDetails = unpaidSalaries.map(
      (s) =>
        `Employee: ${s.employeeId.name} | Account: ${s.employeeId.bankAccount} | IFSC: ${s.employeeId.ifscCode} | Amount: ₹${s.total}`
    ).join("\n");

    const bankMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_BANK, // Replace with actual bank email
      subject: "Payroll Processing Request",
      text: `Please process the following payroll:\n\n${bankDetails}\n\nTotal Amount: ₹${totalPayout}`,
    };

    await transporter.sendMail(bankMailOptions);

    res.json({ success: true, message: "Payroll processed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateBankDetail=async(req,res)=>{
    try {
    const {id}=req.params;
    console.log("id goted",id)
    const employee=await Employee.findOne({id})
    const updated = await Employee.findByIdAndUpdate(
        id,
      { bankDetails: req.body },
      { new: true }
    );
    res.json({ success: true, bankDetails: updated.bankDetails });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}



export {addSalaryDetail,runPayRoll,updateBankDetail};
