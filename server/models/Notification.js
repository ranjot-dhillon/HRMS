// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // your user model
      required: true,
    },
    title: { type: String, required: true }, // e.g., "Leave Approved"
    message: { type: String, required: true }, // e.g., "Your leave for 12 Aug has been approved."
    type: {
      type: String,
      enum: ["leave", "salary", "general"],
      default: "general",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
