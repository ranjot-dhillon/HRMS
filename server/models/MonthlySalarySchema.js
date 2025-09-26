// models/MonthlySalary.js
import mongoose from "mongoose";

const monthlySalarySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: {
      type: String, // e.g., "2025-08"
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
    paidOn: {
      type: Date,
    },
  },
  { timestamps: true }
);

const MonthlySalary = mongoose.model("MonthlySalary", monthlySalarySchema);
export default MonthlySalary;
