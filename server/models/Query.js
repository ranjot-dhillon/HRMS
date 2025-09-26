import mongoose from "mongoose";

const QuerySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    forMonth: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },
    response: {
      type: String,
      default: null,
    },
    // In models/Query.js
    new: {
      type: Boolean,
      default: true, // every new query is marked as new initially
    },
  },
  { timestamps: true }
);

const Query = mongoose.model("Query", QuerySchema);
export default Query;
