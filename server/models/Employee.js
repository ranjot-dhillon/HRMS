import mongoose from "mongoose";
import { Schema } from "mongoose";

const employeeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  employeeId: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  email: { type: String },
  maritalStatus: { type: String },
  designation: { type: String },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  profileImage: { type: String,default:"employees/b2rh4r2mkkyrzyxdw2d7" },

  salary: { type: Number, required: true },
  joiningDate:{type:Date},

  bankDetails: {
  accountNumber: { type: String },
  ifscCode: { type: String},
  bankName: { type: String},
  branch: { type: String },
},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
