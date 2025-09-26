import mongoose from "mongoose";
import { Schema } from "mongoose";

const salarySchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    basicSalary: { type: Number, required: true },
    allowances: { type: Number },
    deductions: { type: Number },
    netSalary: { type: Number },
    effectiveFrom: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Salary = mongoose.model("Salary", salarySchema);
export default Salary;
