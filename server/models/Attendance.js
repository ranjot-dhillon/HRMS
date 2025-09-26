// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      type: Date,
      default: null,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    totalHours: {
      type: Number, // Store in hours (e.g., 8.5)
      default: 0,
    },
    aiVerification: {
      type: {
        method: String, // 'face', 'qr', 'manual'
        confidence: Number, // e.g., 0.98 from face recognition
        verified: Boolean,
      },
      default: null,
    },
    location: {
      lat: Number,
      lng: Number,
    },
    deviceInfo: {
      type: String, // Optional for anomaly detection later
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
